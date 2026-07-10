#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 10 ]]; then
  echo "Usage: $0 <harness> <lane> <task> <provider> <model> <effort> <testbed> <prompt> <raw-dir> <export-dir>" >&2
  exit 1
fi

HARNESS="$1"
LANE="$2"
TASK="$3"
PROVIDER="$4"
MODEL="$5"
EFFORT="$6"
TARGET_DIR="$7"
PROMPT_FILE="$8"
RAW_DIR="$9"
EXPORT_DIR="${10}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
CONTAINER_PROMPT="/workspace/subject/.harness-lab/run-prompt.txt"
CONTAINER_FINAL="/workspace/subject/.harness-lab/provider-final.txt"

mkdir -p "$TARGET_DIR/.harness-lab" "$EXPORT_DIR"
cp "$PROMPT_FILE" "$TARGET_DIR/.harness-lab/run-prompt.txt"
trap 'rm -f "$TARGET_DIR/.harness-lab/run-prompt.txt"' EXIT

docker image inspect "${HARNESS_LAB_IMAGE:-agentic-harness-lab:2026-07-10}" --format '{{.Id}}' > "$EXPORT_DIR/container-image-id.txt"
docker version --format '{{.Server.Version}}' > "$EXPORT_DIR/docker-server-version.txt"

case "$HARNESS" in
  codex)
    args=(exec --cd /workspace/subject --model "$MODEL" --ignore-rules --strict-config --ephemeral --json --color never --output-last-message "$CONTAINER_FINAL"
      -c 'model_provider="chatgpt-http"'
      -c 'model_providers.chatgpt-http.name="ChatGPT HTTP"'
      -c 'model_providers.chatgpt-http.base_url="https://chatgpt.com/backend-api/codex"'
      -c 'model_providers.chatgpt-http.wire_api="responses"'
      -c 'model_providers.chatgpt-http.requires_openai_auth=true'
      -c 'model_providers.chatgpt-http.supports_websockets=false'
      -c "model_reasoning_effort=\"$EFFORT\"")
    if [[ "$TASK" == "safety-canary" ]]; then
      args+=(--sandbox workspace-write -c approval_policy=never)
    else
      args+=(--dangerously-bypass-approvals-and-sandbox)
    fi
    if [[ "$LANE" == "native" ]]; then
      args+=(--dangerously-bypass-hook-trust)
    else
      args+=(--ignore-user-config)
    fi
    command=(bash -lc '
      lane="$1"
      shift
      if [[ "$lane" == "native" ]]; then
        # This home is a per-run tmpfs. The host Codex configuration is never
        # mounted, and only the disposable workspace receives project trust.
        mkdir -p "$HOME/.codex"
        printf "[projects.\"/workspace/subject\"]\ntrust_level = \"trusted\"\n" > "$HOME/.codex/config.toml"
      fi
      printf "os=%s\narchitecture=%s\nnodeVersion=%s\npnpmVersion=%s\ncwd=%s\n" "$(uname -s)" "$(uname -m)" "$(node --version)" "$(pnpm --version)" "$(pwd)" > .harness-lab/environment.txt
      codex --version > .harness-lab/harness-version.txt
      printf "chatgpt-http\n" > .harness-lab/resolved-provider.txt
      printf "chatgpt-http-sse\n" > .harness-lab/model-transport.txt
      exec codex "$@" - < .harness-lab/run-prompt.txt
    ' bash "$LANE" "${args[@]}")
    ;;
  claude-code)
    args=(-p --output-format stream-json --verbose --include-hook-events --model "$MODEL" --effort "$EFFORT" --no-session-persistence --no-chrome --prompt-suggestions false)
    if [[ "$LANE" == "default" ]]; then
      args+=(--safe-mode)
    else
      args+=(--setting-sources project --disable-slash-commands --strict-mcp-config --mcp-config '{"mcpServers":{}}' --agents '{}')
    fi
    if [[ "$TASK" == "safety-canary" ]]; then
      args+=(--permission-mode dontAsk)
    else
      args+=(--dangerously-skip-permissions)
    fi
    if [[ "$PROVIDER" == "openai-codex" ]]; then
      command=(bash -lc '
        printf "os=%s\narchitecture=%s\nnodeVersion=%s\npnpmVersion=%s\ncwd=%s\n" "$(uname -s)" "$(uname -m)" "$(node --version)" "$(pnpm --version)" "$(pwd)" > .harness-lab/environment.txt
        claude --version > .harness-lab/harness-version.txt
        printf "openai-codex\n" > .harness-lab/resolved-provider.txt
        printf "anthropic-messages-to-pi-ai-openai-codex\n" > .harness-lab/model-transport.txt
        effort="$1"
        model="$2"
        shift 2
        export CLAUDE_OPENAI_GATEWAY_EFFORT="$effort"
        run-claude-openai-gateway "$model" claude "$@" "$(<.harness-lab/run-prompt.txt)"
      ' bash "$EFFORT" "$MODEL" "${args[@]}")
    else
      command=(bash -lc '
        printf "os=%s\narchitecture=%s\nnodeVersion=%s\npnpmVersion=%s\ncwd=%s\n" "$(uname -s)" "$(uname -m)" "$(node --version)" "$(pnpm --version)" "$(pwd)" > .harness-lab/environment.txt
        claude --version > .harness-lab/harness-version.txt
        printf "anthropic\n" > .harness-lab/resolved-provider.txt
        printf "anthropic-messages-native\n" > .harness-lab/model-transport.txt
        exec claude "$@" "$(<.harness-lab/run-prompt.txt)"
      ' bash "${args[@]}")
    fi
    ;;
  pi-dev)
    args=(--print --mode json --no-session --provider "$PROVIDER" --model "$MODEL" --thinking "$EFFORT" --tools read,bash,edit,write --no-skills --no-prompt-templates --no-themes)
    case "$LANE" in
      default) args+=(--no-approve --no-context-files --no-extensions) ;;
      instructions) args+=(--approve --no-extensions) ;;
      native) args+=(--approve) ;;
    esac
    command=(bash -lc '
      printf "os=%s\narchitecture=%s\nnodeVersion=%s\npnpmVersion=%s\ncwd=%s\n" "$(uname -s)" "$(uname -m)" "$(node --version)" "$(pnpm --version)" "$(pwd)" > .harness-lab/environment.txt
      pi --version > .harness-lab/harness-version.txt
      printf "%s\n" "$1" > .harness-lab/resolved-provider.txt
      printf "pi-ai-provider\n" > .harness-lab/model-transport.txt
      shift
      exec pi "$@" "$(<.harness-lab/run-prompt.txt)"
    ' bash "$PROVIDER" "${args[@]}")
    ;;
  *)
    echo "Unknown harness: $HARNESS" >&2
    exit 1
    ;;
esac

set +e
"$ROOT_DIR/scripts/sandbox-lab.sh" run-capture \
  "$TARGET_DIR" "$RAW_DIR/container-diff.patch" "$EXPORT_DIR" \
  "${command[@]}" > "$RAW_DIR/events.jsonl" 2> "$RAW_DIR/stderr.log"
agent_exit=$?
set -e

rm -f "$TARGET_DIR/.harness-lab/run-prompt.txt"

if [[ -s "$RAW_DIR/container-diff.patch" ]]; then
  git -C "$TARGET_DIR" apply --whitespace=nowarn "$RAW_DIR/container-diff.patch"
fi

if [[ -f "$EXPORT_DIR/native-events.jsonl" ]]; then
  mkdir -p "$TARGET_DIR/.harness-lab"
  cp "$EXPORT_DIR/native-events.jsonl" "$TARGET_DIR/.harness-lab/native-events.jsonl"
fi

if [[ -f "$EXPORT_DIR/provider-final.txt" ]]; then
  cp "$EXPORT_DIR/provider-final.txt" "$RAW_DIR/provider-final.txt"
fi

exit "$agent_exit"
