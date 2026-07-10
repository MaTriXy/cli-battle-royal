#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
IMAGE="${HARNESS_LAB_IMAGE:-agentic-harness-lab:2026-07-10}"
PROXY_IMAGE="${HARNESS_LAB_PROXY_IMAGE:-agentic-harness-lab-proxy:2026-07-10}"
MEMORY="${HARNESS_LAB_MEMORY:-4g}"
CPUS="${HARNESS_LAB_CPUS:-4}"
PIDS="${HARNESS_LAB_PIDS:-512}"
TIMEOUT_SECONDS="${HARNESS_LAB_TIMEOUT_SECONDS:-1800}"
SUBJECT_COMMIT="32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e"
ACTIVE_PROXY=""
ACTIVE_INTERNAL_NETWORK=""
ACTIVE_EGRESS_NETWORK=""
ACTIVE_WORKSPACE_VOLUME=""
ACTIVE_AUTH_VOLUME=""
ACTIVE_SEED_CONTAINER=""
ACTIVE_TEMP_DIR=""
ACTIVE_EXPORT_CONTAINER=""
ACTIVE_AGENT_CONTAINER=""

fail() {
  printf 'sandbox-lab: %s\n' "$*" >&2
  exit 1
}

require_docker() {
  command -v docker >/dev/null 2>&1 || fail "docker is not installed"
  docker info >/dev/null 2>&1 || fail "docker daemon is unavailable"
}

build_images() {
  docker build -f "$ROOT_DIR/sandbox/Dockerfile" -t "$IMAGE" "$ROOT_DIR"
  docker build -f "$ROOT_DIR/sandbox/proxy/Dockerfile" -t "$PROXY_IMAGE" "$ROOT_DIR"
}

container_args() {
  local workspace_volume="$1"
  local auth_volume="$2"
  local network="$3"
  printf '%s\0' \
    --read-only \
    --cap-drop ALL \
    --security-opt no-new-privileges \
    --pids-limit "$PIDS" \
    --memory "$MEMORY" \
    --cpus "$CPUS" \
    --network "$network" \
    --user 1000:1000 \
    --workdir /workspace/subject \
    --tmpfs /home/node:rw,nosuid,nodev,size=512m,uid=1000,gid=1000,mode=0700 \
    --tmpfs /tmp:rw,nosuid,nodev,size=1g,uid=1000,gid=1000,mode=1777 \
    --mount "type=volume,src=$workspace_volume,dst=/workspace" \
    --mount "type=volume,src=$auth_volume,dst=/run/lab-auth,readonly" \
    --env HOME=/home/node \
    --env HTTP_PROXY=http://harness-lab-proxy:3128 \
    --env HTTPS_PROXY=http://harness-lab-proxy:3128 \
    --env NO_PROXY=localhost,127.0.0.1
}

seed_volumes() {
  local workspace_volume="$1"
  local auth_volume="$2"
  local source_dir="$3"
  local seed_name="harness-lab-seed-$$-$RANDOM"
  ACTIVE_SEED_CONTAINER="$seed_name"

  docker volume create "$workspace_volume" >/dev/null
  docker volume create "$auth_volume" >/dev/null
  docker create --name "$seed_name" \
    --mount "type=volume,src=$workspace_volume,dst=/workspace" \
    --mount "type=volume,src=$auth_volume,dst=/auth" \
    "$IMAGE" true >/dev/null

  COPYFILE_DISABLE=1 tar \
    --exclude='./.git/fsmonitor--daemon.ipc' \
    --exclude='node_modules' \
    --exclude='*/node_modules' \
    -C "$source_dir" -cf - . \
    | docker cp - "$seed_name:/workspace/subject"
  [[ -f "$HOME/.codex/auth.json" ]] && docker cp "$HOME/.codex/auth.json" "$seed_name:/auth/codex-auth.json"
  [[ -f "$HOME/.pi/agent/auth.json" ]] && docker cp "$HOME/.pi/agent/auth.json" "$seed_name:/auth/pi-auth.json"
  [[ -f "$ROOT_DIR/runs/local/auth/claude-credentials.json" ]] && docker cp "$ROOT_DIR/runs/local/auth/claude-credentials.json" "$seed_name:/auth/claude-credentials.json"
  [[ -f "$ROOT_DIR/runs/local/auth/claude-oauth-token" ]] && docker cp "$ROOT_DIR/runs/local/auth/claude-oauth-token" "$seed_name:/auth/claude-oauth-token"
  docker rm "$seed_name" >/dev/null
  ACTIVE_SEED_CONTAINER=""

  docker run --rm --user root \
    --mount "type=volume,src=$workspace_volume,dst=/workspace" \
    --mount "type=volume,src=$auth_volume,dst=/auth" \
    --entrypoint /bin/chown "$IMAGE" -R 1000:1000 /workspace /auth
}

prepare_workspace_dependencies() {
  local workspace_volume="$1"

  docker run --rm --user 1000:1000 \
    --network none \
    --cap-drop ALL \
    --security-opt no-new-privileges \
    --pids-limit "$PIDS" \
    --memory "$MEMORY" \
    --cpus "$CPUS" \
    --workdir /workspace/subject \
    --mount "type=volume,src=$workspace_volume,dst=/workspace" \
    --env HOME=/home/node \
    --tmpfs /home/node:rw,nosuid,nodev,size=512m,uid=1000,gid=1000,mode=0700 \
    --tmpfs /tmp:rw,nosuid,nodev,size=1g,mode=1777 \
    --entrypoint /bin/bash \
    "$IMAGE" -lc '
      set -euo pipefail
      test "$(cat /opt/harness-pnpm-store-subject-commit)" = "$(git -c safe.directory=/workspace/subject rev-parse HEAD)"
      mkdir -p /workspace/.pnpm-store
      cp -a /opt/harness-pnpm-store/. /workspace/.pnpm-store/
      pnpm install --offline --frozen-lockfile \
        --store-dir /workspace/.pnpm-store \
        --package-import-method=copy
      status="$(git -c safe.directory=/workspace/subject status --porcelain)"
      if [[ -n "$status" ]]; then
        echo "offline dependency setup changed tracked or untracked non-ignored files" >&2
        git -c safe.directory=/workspace/subject status --short >&2
        exit 1
      fi
    '
}

cleanup() {
  local proxy_name="${1:-}"
  local internal_network="${2:-}"
  local egress_network="${3:-}"
  local workspace_volume="${4:-}"
  local auth_volume="${5:-}"
  [[ -n "$proxy_name" ]] && docker rm -f "$proxy_name" >/dev/null 2>&1 || true
  [[ -n "$internal_network" ]] && docker network rm "$internal_network" >/dev/null 2>&1 || true
  [[ -n "$egress_network" ]] && docker network rm "$egress_network" >/dev/null 2>&1 || true
  [[ -n "$workspace_volume" ]] && docker volume rm "$workspace_volume" >/dev/null 2>&1 || true
  [[ -n "$auth_volume" ]] && docker volume rm "$auth_volume" >/dev/null 2>&1 || true
  return 0
}

cleanup_active() {
  [[ -n "$ACTIVE_SEED_CONTAINER" ]] && docker rm -f "$ACTIVE_SEED_CONTAINER" >/dev/null 2>&1 || true
  [[ -n "$ACTIVE_EXPORT_CONTAINER" ]] && docker rm -f "$ACTIVE_EXPORT_CONTAINER" >/dev/null 2>&1 || true
  [[ -n "$ACTIVE_AGENT_CONTAINER" ]] && docker rm -f "$ACTIVE_AGENT_CONTAINER" >/dev/null 2>&1 || true
  cleanup "$ACTIVE_PROXY" "$ACTIVE_INTERNAL_NETWORK" "$ACTIVE_EGRESS_NETWORK" "$ACTIVE_WORKSPACE_VOLUME" "$ACTIVE_AUTH_VOLUME"
  [[ -n "$ACTIVE_TEMP_DIR" ]] && rm -rf "$ACTIVE_TEMP_DIR"
  return 0
}

trap cleanup_active EXIT INT TERM

export_run_artifacts() {
  local workspace_volume="$1"
  local patch_file="$2"
  local export_dir="$3"
  local export_name="harness-lab-export-$$-$RANDOM"

  mkdir -p "$(dirname "$patch_file")" "$export_dir"
  docker run --rm --user 1000:1000 \
    --read-only --cap-drop ALL --security-opt no-new-privileges \
    --mount "type=volume,src=$workspace_volume,dst=/workspace,readonly" \
    --entrypoint /usr/bin/git "$IMAGE" \
    -C /workspace/subject diff --binary > "$patch_file"

  ACTIVE_EXPORT_CONTAINER="$export_name"
  docker create --name "$export_name" \
    --mount "type=volume,src=$workspace_volume,dst=/workspace,readonly" \
    "$IMAGE" true >/dev/null
  if docker cp "$export_name:/workspace/subject/.harness-lab/." "$export_dir" 2>/dev/null; then
    :
  fi
  docker rm "$export_name" >/dev/null
  ACTIVE_EXPORT_CONTAINER=""
}

run_ephemeral() {
  local source_dir="$1"
  shift
  local suffix="$$-$RANDOM"
  local workspace_volume="harness-lab-workspace-$suffix"
  local auth_volume="harness-lab-auth-$suffix"
  local internal_network="harness-lab-internal-$suffix"
  local egress_network="harness-lab-egress-$suffix"
  local proxy_name="harness-lab-proxy-$suffix"
  local agent_name="harness-lab-agent-$suffix"
  local patch_file="${HARNESS_LAB_EXPORT_PATCH:-}"
  local export_dir="${HARNESS_LAB_EXPORT_DIR:-}"
  local -a args=()
  local run_exit
  local dependency_setup_started
  local dependency_setup_seconds
  local agent_started
  local agent_wall_seconds

  ACTIVE_PROXY="$proxy_name"
  ACTIVE_INTERNAL_NETWORK="$internal_network"
  ACTIVE_EGRESS_NETWORK="$egress_network"
  ACTIVE_WORKSPACE_VOLUME="$workspace_volume"
  ACTIVE_AUTH_VOLUME="$auth_volume"
  ACTIVE_AGENT_CONTAINER="$agent_name"

  seed_volumes "$workspace_volume" "$auth_volume" "$source_dir"
  dependency_setup_started="$(date +%s)"
  if [[ -f "$source_dir/pnpm-lock.yaml" \
    && "$(git -C "$source_dir" rev-parse HEAD 2>/dev/null || true)" == "$SUBJECT_COMMIT" ]]; then
    prepare_workspace_dependencies "$workspace_volume"
  fi
  dependency_setup_seconds=$(( $(date +%s) - dependency_setup_started ))
  docker network create --internal "$internal_network" >/dev/null
  docker network create "$egress_network" >/dev/null
  docker run -d --name "$proxy_name" --network "$egress_network" \
    --user 13:13 \
    --read-only --cap-drop ALL --security-opt no-new-privileges \
    --pids-limit 128 --memory 256m --cpus 1 \
    --tmpfs /run:rw,nosuid,nodev,size=16m,uid=13,gid=13 \
    --tmpfs /var/log/squid:rw,nosuid,nodev,size=32m,uid=13,gid=13 \
    --tmpfs /var/spool/squid:rw,nosuid,nodev,size=32m,uid=13,gid=13 \
    "$PROXY_IMAGE" >/dev/null
  docker network connect --alias harness-lab-proxy "$internal_network" "$proxy_name"
  sleep 1
  [[ "$(docker inspect -f '{{.State.Running}}' "$proxy_name")" == "true" ]] || {
    docker logs "$proxy_name" >&2 || true
    fail "allowlist proxy failed to start"
  }

  while IFS= read -r -d '' arg; do args+=("$arg"); done < <(container_args "$workspace_volume" "$auth_volume" "$internal_network")
  agent_started="$(date +%s)"
  set +e
  perl -e '
    my $seconds = shift;
    my $pid = fork();
    die "fork failed: $!\n" unless defined $pid;
    if ($pid == 0) { exec @ARGV or die "exec failed: $!\n"; }
    $SIG{ALRM} = sub { kill 9, $pid; waitpid($pid, 0); exit 124; };
    alarm $seconds;
    waitpid($pid, 0);
    alarm 0;
    exit(($? & 127) ? 128 + ($? & 127) : $? >> 8);
  ' \
    "$TIMEOUT_SECONDS" docker run --name "$agent_name" "${args[@]}" "$IMAGE" "$@"
  run_exit=$?
  set -e
  agent_wall_seconds=$(( $(date +%s) - agent_started ))
  if [[ $run_exit -eq 124 ]]; then
    printf 'sandbox-lab: agent exceeded %s seconds\n' "$TIMEOUT_SECONDS" >&2
  fi

  docker rm -f "$agent_name" >/dev/null 2>&1 || true
  ACTIVE_AGENT_CONTAINER=""

  if [[ -n "$patch_file" && -n "$export_dir" ]]; then
    export_run_artifacts "$workspace_volume" "$patch_file" "$export_dir"
    printf '%s\n' "$dependency_setup_seconds" > "$export_dir/dependency-setup-seconds.txt"
    printf '%s\n' "$agent_wall_seconds" > "$export_dir/agent-wall-seconds.txt"
  fi

  cleanup_active
  ACTIVE_PROXY=""
  ACTIVE_INTERNAL_NETWORK=""
  ACTIVE_EGRESS_NETWORK=""
  ACTIVE_WORKSPACE_VOLUME=""
  ACTIVE_AUTH_VOLUME=""
  return "$run_exit"
}

run_canary() {
  local temp_dir
  temp_dir="$(mktemp -d)"
  ACTIVE_TEMP_DIR="$temp_dir"
  printf 'seed-visible-%s\n' "$RANDOM" > "$temp_dir/seed-visible-sentinel"

  run_ephemeral "$temp_dir" bash -lc '
    set -euo pipefail
    failures=0
    [[ -f /workspace/subject/seed-visible-sentinel ]] || { echo seeded_workspace=fail; failures=1; }
    [[ ! -d /Users ]] || { echo host_home_hidden=fail; failures=1; }
    [[ ! -S /var/run/docker.sock ]] || { echo docker_socket=fail; failures=1; }
    if touch /rootfs-write-canary 2>/dev/null; then echo rootfs_read_only=fail; failures=1; else echo rootfs_read_only=pass; fi
    if touch /workspace/subject/workspace-write-canary; then echo workspace_write=pass; else echo workspace_write=fail; failures=1; fi
    if curl -fsS --noproxy "*" --connect-timeout 3 https://example.com >/dev/null 2>&1; then echo direct_egress=fail; failures=1; else echo direct_egress=pass; fi
    if curl -sS --connect-timeout 5 -o /dev/null https://api.openai.com/; then echo provider_proxy=pass; else echo provider_proxy=fail; failures=1; fi
    if curl -fsS --connect-timeout 5 https://example.com >/dev/null 2>&1; then echo proxy_deny=fail; failures=1; else echo proxy_deny=pass; fi
    [[ -f /workspace/subject/seed-visible-sentinel ]] && echo seeded_workspace=pass
    [[ ! -d /Users ]] && echo host_home_hidden=pass
    [[ ! -S /var/run/docker.sock ]] && echo docker_socket=pass
    exit "$failures"
  '
  rm -rf "$temp_dir"
  ACTIVE_TEMP_DIR=""
}

require_docker

case "${1:-}" in
  build)
    build_images
    ;;
  canary)
    docker image inspect "$IMAGE" >/dev/null 2>&1 || build_images
    docker image inspect "$PROXY_IMAGE" >/dev/null 2>&1 || build_images
    run_canary
    ;;
  shell)
    docker image inspect "$IMAGE" >/dev/null 2>&1 || build_images
    docker image inspect "$PROXY_IMAGE" >/dev/null 2>&1 || build_images
    run_ephemeral "${2:-$ROOT_DIR/testbeds/monkey-d-loopy-main}" bash
    ;;
  run)
    [[ $# -ge 3 ]] || fail "usage: $0 run <source-directory> <command> [args...]"
    docker image inspect "$IMAGE" >/dev/null 2>&1 || build_images
    docker image inspect "$PROXY_IMAGE" >/dev/null 2>&1 || build_images
    source_dir="$2"
    shift 2
    [[ -d "$source_dir" ]] || fail "source directory not found: $source_dir"
    run_ephemeral "$source_dir" "$@"
    ;;
  run-capture)
    [[ $# -ge 5 ]] || fail "usage: $0 run-capture <source-directory> <patch-file> <export-directory> <command> [args...]"
    docker image inspect "$IMAGE" >/dev/null 2>&1 || build_images
    docker image inspect "$PROXY_IMAGE" >/dev/null 2>&1 || build_images
    source_dir="$2"
    export HARNESS_LAB_EXPORT_PATCH="$3"
    export HARNESS_LAB_EXPORT_DIR="$4"
    shift 4
    [[ -d "$source_dir" ]] || fail "source directory not found: $source_dir"
    run_ephemeral "$source_dir" "$@"
    ;;
  *)
    fail "usage: $0 <build|canary|shell|run|run-capture>"
    ;;
esac
