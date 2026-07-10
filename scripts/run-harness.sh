#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 3 || $# -gt 5 ]]; then
  echo "Usage: $0 <codex|claude-code|pi-dev> <default|instructions|native> <orientation|fixed-doc|code-test|gate-canary|safety-canary> [repeat] [shakeout|measured]" >&2
  exit 1
fi

HARNESS="$1"
LANE="$2"
TASK="$3"
REPEAT="${4:-1}"
RUN_STATUS="${5:-shakeout}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
REAL_HOME="$HOME"
CONTAINED="${HARNESS_LAB_CONTAINED:-0}"
EFFORT="${EFFORT_OVERRIDE:-high}"

if [[ "$RUN_STATUS" == "measured" && "$CONTAINED" != "1" ]]; then
  echo "Measured runs require HARNESS_LAB_CONTAINED=1" >&2
  exit 1
fi

if [[ "$RUN_STATUS" == "measured" && "${MEASURED_READINESS_CONFIRMED:-0}" != "1" ]]; then
  echo "Measured runs require an approved readiness launcher" >&2
  exit 1
fi

if [[ "$HARNESS" == "claude-code" && "$LANE" != "default" && ! -f "$ROOT_DIR/harness-setups/$LANE/claude-code/CLAUDE.md" ]]; then
  echo "Missing controlled Claude project instructions" >&2
  exit 1
fi

case "$HARNESS" in
  codex) PROVIDER="${PROVIDER_OVERRIDE:-openai}"; MODEL="${MODEL_OVERRIDE:-gpt-5.6-sol}"; HARNESS_VERSION="$(codex --version | awk '{print $2}')" ;;
  claude-code) PROVIDER="${PROVIDER_OVERRIDE:-anthropic}"; MODEL="${MODEL_OVERRIDE:-sonnet}"; HARNESS_VERSION="$(claude --version | awk '{print $1}')" ;;
  pi-dev) PROVIDER="${PROVIDER_OVERRIDE:-openai-codex}"; MODEL="${MODEL_OVERRIDE:-gpt-5.6-sol}"; HARNESS_VERSION="$(pi --version)" ;;
  *) echo "Unknown harness: $HARNESS" >&2; exit 1 ;;
esac

case "$LANE" in default|instructions|native) ;; *) echo "Unknown lane: $LANE" >&2; exit 1 ;; esac
case "$TASK" in orientation|fixed-doc|code-test|gate-canary|safety-canary) ;; *) echo "Unknown task: $TASK" >&2; exit 1 ;; esac
case "$RUN_STATUS" in shakeout|measured) ;; *) echo "Unknown run status: $RUN_STATUS" >&2; exit 1 ;; esac
case "$EFFORT" in minimal|low|medium|high|xhigh|max) ;; *) echo "Unknown effort: $EFFORT" >&2; exit 1 ;; esac
[[ "$REPEAT" =~ ^[1-9][0-9]*$ ]] || { echo "Repeat must be a positive integer" >&2; exit 1; }

if [[ "$HARNESS" == "claude-code" && "$PROVIDER" == "openai-codex" && "$CONTAINED" != "1" ]]; then
  echo "Claude Code with OpenAI Codex requires HARNESS_LAB_CONTAINED=1" >&2
  exit 1
fi

case "$TASK:$LANE" in
  orientation:default|orientation:instructions|fixed-doc:instructions|code-test:instructions|gate-canary:instructions|gate-canary:native|safety-canary:default) ;;
  *) echo "Task $TASK is not defined for lane $LANE" >&2; exit 1 ;;
esac

if [[ "$HARNESS" == "pi-dev" && "$TASK" == "safety-canary" && "$CONTAINED" != "1" && "${PI_EXTERNAL_CONTAINMENT:-0}" != "1" ]]; then
  echo "Pi safety runs require PI_EXTERNAL_CONTAINMENT=1 and an externally contained process." >&2
  exit 1
fi

case "$TASK" in
  orientation) TASK_FILE="$ROOT_DIR/protocols/tasks/01-orientation.md" ;;
  fixed-doc) TASK_FILE="$ROOT_DIR/protocols/tasks/02-fixed-doc-task.md" ;;
  code-test) TASK_FILE="$ROOT_DIR/protocols/tasks/03-code-task.md" ;;
  gate-canary) TASK_FILE="$ROOT_DIR/protocols/tasks/04-gate-canary.md" ;;
  safety-canary) TASK_FILE="$ROOT_DIR/protocols/tasks/05-safety-canary.md" ;;
esac

slug() { printf '%s' "$1" | tr '[:upper:]/.' '[:lower:]--' | tr -cs 'a-z0-9_-' '-'; }
RUN_ID="$(date +%Y-%m-%d)--$TASK--$LANE--$HARNESS--$(slug "$PROVIDER")--$(slug "$MODEL")--r$REPEAT"
RAW_DIR="$ROOT_DIR/runs/raw/$RUN_ID"
LOCAL_DIR="$ROOT_DIR/runs/local/$RUN_ID"
CAPTURE_DIR="$ROOT_DIR/captures/$HARNESS/$RUN_ID"
TARGET_NAME="run-$TASK-$LANE-$HARNESS-r$REPEAT"
TARGET_DIR="$ROOT_DIR/testbeds/$TARGET_NAME"

if [[ -e "$RAW_DIR" || -e "$CAPTURE_DIR" ]]; then
  echo "Run artifacts already exist for $RUN_ID" >&2
  exit 1
fi

mkdir -p "$RAW_DIR" "$LOCAL_DIR" "$CAPTURE_DIR"
node "$ROOT_DIR/scripts/extract-task-prompt.mjs" "$TASK_FILE" > "$RAW_DIR/prompt.txt"

setup_start="$(date +%s)"
set +e
if [[ "$CONTAINED" == "1" ]]; then
  PREPARE_SKIP_INSTALL=1 "$ROOT_DIR/scripts/prepare-run.sh" "$HARNESS" "$LANE" "$TARGET_NAME" > "$RAW_DIR/prepare.log" 2>&1
else
  "$ROOT_DIR/scripts/prepare-run.sh" "$HARNESS" "$LANE" "$TARGET_NAME" > "$RAW_DIR/prepare.log" 2>&1
fi
prepare_exit=$?
set -e
setup_end="$(date +%s)"
setup_seconds=$((setup_end - setup_start))
if [[ $prepare_exit -ne 0 ]]; then
  echo "Preparation failed; raw log: $RAW_DIR/prepare.log" >&2
  exit 1
fi

git -C "$TARGET_DIR" status --short --branch > "$RAW_DIR/starting-status.txt"
git -C "$TARGET_DIR" remote -v > "$RAW_DIR/starting-remotes.txt"

mkdir -p "$LOCAL_DIR/home" "$LOCAL_DIR/tmp"
RUN_PATH="$ROOT_DIR/scripts/bin:$PATH"
COMMON_ENV=(
  PATH="$RUN_PATH"
  USER="${USER:-matrixy}"
  LOGNAME="${LOGNAME:-${USER:-matrixy}}"
  SHELL=/bin/zsh
  LANG=en_US.UTF-8
  LC_ALL=en_US.UTF-8
  TMPDIR="$LOCAL_DIR/tmp"
  CI=1
  NO_COLOR=1
)

started_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
started_epoch="$(date +%s)"
set +e

if [[ "$CONTAINED" == "1" ]]; then
  "$ROOT_DIR/scripts/run-agent-contained.sh" \
    "$HARNESS" "$LANE" "$TASK" "$PROVIDER" "$MODEL" "$EFFORT" "$TARGET_DIR" "$RAW_DIR/prompt.txt" "$RAW_DIR" "$RAW_DIR/contained-export"
  agent_exit=$?
elif [[ "$CONTAINED" != "0" ]]; then
  echo "HARNESS_LAB_CONTAINED must be 0 or 1" > "$RAW_DIR/stderr.log"
  agent_exit=2
else
case "$HARNESS" in
  codex)
    mkdir -p "$LOCAL_DIR/codex-home"
    if [[ ! -f "$REAL_HOME/.codex/auth.json" ]]; then
      echo "Missing Codex auth file" >&2
      exit 1
    fi
    cp "$REAL_HOME/.codex/auth.json" "$LOCAL_DIR/codex-home/auth.json"
    chmod 0600 "$LOCAL_DIR/codex-home/auth.json"
    codex_args=(exec --cd "$TARGET_DIR" --model "$MODEL" --ignore-user-config --ignore-rules --strict-config --ephemeral --json --color never --output-last-message "$RAW_DIR/provider-final.txt" -c "model_reasoning_effort=\"$EFFORT\"")
    if [[ "$TASK" == "safety-canary" ]]; then
      codex_args+=(--sandbox workspace-write -c approval_policy=never)
    else
      codex_args+=(--dangerously-bypass-approvals-and-sandbox)
    fi
    if [[ "$LANE" == "native" ]]; then
      codex_args+=(--dangerously-bypass-hook-trust)
    fi
    env -i "${COMMON_ENV[@]}" HOME="$LOCAL_DIR/home" CODEX_HOME="$LOCAL_DIR/codex-home" \
      codex "${codex_args[@]}" - < "$RAW_DIR/prompt.txt" > "$RAW_DIR/events.jsonl" 2> "$RAW_DIR/stderr.log"
    agent_exit=$?
    ;;
  claude-code)
    claude_args=(-p --output-format stream-json --verbose --include-hook-events --model "$MODEL" --effort "$EFFORT" --no-session-persistence --no-chrome --prompt-suggestions false)
    if [[ "$LANE" == "default" ]]; then
      claude_args+=(--safe-mode)
    else
      claude_args+=(--setting-sources project --disable-slash-commands --strict-mcp-config --mcp-config '{"mcpServers":{}}' --agents '{}')
    fi
    if [[ "$TASK" == "safety-canary" ]]; then
      claude_args+=(--permission-mode dontAsk)
    else
      claude_args+=(--dangerously-skip-permissions)
    fi
    mkdir -p "$LOCAL_DIR/claude-home"
    if [[ -f "$REAL_HOME/.claude/.credentials.json" ]]; then
      mkdir -p "$LOCAL_DIR/claude-home/.claude"
      cp "$REAL_HOME/.claude/.credentials.json" "$LOCAL_DIR/claude-home/.claude/.credentials.json"
      chmod 0600 "$LOCAL_DIR/claude-home/.claude/.credentials.json"
    fi
    (cd "$TARGET_DIR" && env -i "${COMMON_ENV[@]}" HOME="$LOCAL_DIR/claude-home" CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1 DISABLE_TELEMETRY=1 DISABLE_ERROR_REPORTING=1 \
      claude "${claude_args[@]}" "$(<"$RAW_DIR/prompt.txt")") > "$RAW_DIR/events.jsonl" 2> "$RAW_DIR/stderr.log"
    agent_exit=$?
    ;;
  pi-dev)
    mkdir -p "$LOCAL_DIR/pi-agent"
    if [[ ! -f "$REAL_HOME/.pi/agent/auth.json" ]]; then
      echo "Missing Pi auth file" >&2
      exit 1
    fi
    cp "$REAL_HOME/.pi/agent/auth.json" "$LOCAL_DIR/pi-agent/auth.json"
    chmod 0600 "$LOCAL_DIR/pi-agent/auth.json"
    pi_args=(--print --mode json --no-session --provider "$PROVIDER" --model "$MODEL" --thinking "$EFFORT" --tools read,bash,edit,write --no-skills --no-prompt-templates --no-themes)
    case "$LANE" in
      default) pi_args+=(--no-approve --no-context-files --no-extensions) ;;
      instructions) pi_args+=(--approve --no-extensions) ;;
      native) pi_args+=(--approve) ;;
    esac
    (cd "$TARGET_DIR" && env -i "${COMMON_ENV[@]}" HOME="$LOCAL_DIR/home" PI_CODING_AGENT_DIR="$LOCAL_DIR/pi-agent" PI_TELEMETRY=0 \
      pi "${pi_args[@]}" "$(<"$RAW_DIR/prompt.txt")") > "$RAW_DIR/events.jsonl" 2> "$RAW_DIR/stderr.log"
    agent_exit=$?
    ;;
esac
fi

set -e
ended_epoch="$(date +%s)"
ended_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
duration_seconds=$((ended_epoch - started_epoch))
if [[ "$CONTAINED" == "1" && -s "$RAW_DIR/contained-export/agent-wall-seconds.txt" ]]; then
  duration_seconds="$(head -n 1 "$RAW_DIR/contained-export/agent-wall-seconds.txt")"
fi
printf '%s\n' "$agent_exit" > "$RAW_DIR/exit-code.txt"

if [[ "$CONTAINED" == "1" && -s "$RAW_DIR/contained-export/harness-version.txt" ]]; then
  HARNESS_VERSION="$(head -n 1 "$RAW_DIR/contained-export/harness-version.txt")"
fi

host_verification_setup_seconds=0
host_verification_setup_exit=0
if [[ "$CONTAINED" == "1" ]]; then
  host_setup_start="$(date +%s)"
  set +e
  pnpm --dir "$TARGET_DIR" install --frozen-lockfile > "$RAW_DIR/host-verification-setup.log" 2>&1
  host_verification_setup_exit=$?
  set -e
  host_verification_setup_seconds=$(( $(date +%s) - host_setup_start ))
fi
printf '%s\n' "$host_verification_setup_seconds" > "$RAW_DIR/host-verification-setup-seconds.txt"
printf '%s\n' "$host_verification_setup_exit" > "$RAW_DIR/host-verification-setup-exit.txt"

FINAL_STATUS="$RUN_STATUS"
INVALID_REASON=""
if [[ $host_verification_setup_exit -ne 0 ]]; then
  FINAL_STATUS=invalid
  INVALID_REASON="host verification dependency setup failed"
elif grep -Eqi 'hit your usage limit|usage limit (has been )?reached|HTTP (401|429)|status (401|429)|authentication_error|No OAuth credential configured|No API key found' \
  "$RAW_DIR/events.jsonl" "$RAW_DIR/stderr.log"; then
  FINAL_STATUS=invalid
  INVALID_REASON="provider authentication or quota precondition failed"
fi

"$ROOT_DIR/scripts/verify-run.sh" "$TARGET_DIR" "$TASK" "$LANE" "$RAW_DIR/verification.txt" "$RAW_DIR/verification.log"
git -C "$TARGET_DIR" diff --binary > "$RAW_DIR/diff.patch"
git -C "$TARGET_DIR" diff --stat > "$RAW_DIR/diff-stat.txt"
git -C "$TARGET_DIR" status --short --branch > "$RAW_DIR/git-status.txt"
git -C "$TARGET_DIR" remote -v > "$RAW_DIR/final-remotes.txt"

node "$ROOT_DIR/scripts/curate-run.mjs" "$HARNESS" "$RAW_DIR/events.jsonl" "$RAW_DIR/prompt.txt" "$CAPTURE_DIR/transcript.md" "$CAPTURE_DIR/final.md" "$ROOT_DIR" "$TARGET_DIR" "$RAW_DIR/provider-final.txt"
node "$ROOT_DIR/scripts/finalize-run.mjs" \
  "$ROOT_DIR" "$TARGET_DIR" "$RAW_DIR" "$CAPTURE_DIR" "$RUN_ID" "$FINAL_STATUS" "$HARNESS" "$LANE" "$TASK" \
  "$PROVIDER" "$MODEL" "$HARNESS_VERSION" "$started_at" "$ended_at" "$duration_seconds" "$agent_exit" "$setup_seconds" \
  "$EFFORT" \
  > "$RAW_DIR/finalize.log"

set +e
"$ROOT_DIR/scripts/scan-capture.sh" "$CAPTURE_DIR" > "$CAPTURE_DIR/redaction-scan.txt"
scan_exit=$?
set -e

printf 'run_id=%s\nagent_exit=%s\nredaction_scan=%s\ncapture=%s\n' \
  "$RUN_ID" "$agent_exit" "$([[ $scan_exit -eq 0 ]] && echo pass || echo fail)" "$CAPTURE_DIR"

if [[ "$RUN_STATUS" == "measured" && "$FINAL_STATUS" == "invalid" ]]; then
  printf 'Measured run invalid: %s\n' "$INVALID_REASON" >&2
  exit 1
fi

if [[ "$RUN_STATUS" == "measured" && $scan_exit -ne 0 ]]; then
  echo "Measured run redaction scan failed" >&2
  exit 1
fi
