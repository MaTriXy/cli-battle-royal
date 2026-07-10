#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: run-claude-openai-gateway <model> <claude-command> [args...]" >&2
  exit 2
fi

MODEL="$1"
shift
PORT="${CLAUDE_OPENAI_GATEWAY_PORT:-8788}"
TOKEN="${CLAUDE_OPENAI_GATEWAY_TOKEN:-harness-lab-loopback-only}"
GATEWAY_STDOUT="${CLAUDE_OPENAI_GATEWAY_STDOUT:-/workspace/subject/.harness-lab/gateway-stdout.log}"
GATEWAY_STDERR="${CLAUDE_OPENAI_GATEWAY_STDERR:-/workspace/subject/.harness-lab/gateway-stderr.log}"

mkdir -p "$(dirname "$GATEWAY_STDOUT")" "$(dirname "$GATEWAY_STDERR")"

export CLAUDE_OPENAI_GATEWAY_PORT="$PORT"
export CLAUDE_OPENAI_GATEWAY_TOKEN="$TOKEN"
export CLAUDE_OPENAI_GATEWAY_PROVIDER="${CLAUDE_OPENAI_GATEWAY_PROVIDER:-openai-codex}"
export CLAUDE_OPENAI_GATEWAY_MODEL="$MODEL"
export CLAUDE_OPENAI_GATEWAY_TRANSPORT="${CLAUDE_OPENAI_GATEWAY_TRANSPORT:-sse}"
export CLAUDE_OPENAI_GATEWAY_AUTH_FILE="${CLAUDE_OPENAI_GATEWAY_AUTH_FILE:-$HOME/.pi/agent/auth.json}"
export CLAUDE_OPENAI_GATEWAY_TRACE="${CLAUDE_OPENAI_GATEWAY_TRACE:-/workspace/subject/.harness-lab/gateway-events.jsonl}"
export CLAUDE_OPENAI_GATEWAY_RESOLVED_MODEL_FILE="${CLAUDE_OPENAI_GATEWAY_RESOLVED_MODEL_FILE:-/workspace/subject/.harness-lab/resolved-model.txt}"
export ANTHROPIC_BASE_URL="http://127.0.0.1:$PORT"
export ANTHROPIC_AUTH_TOKEN="$TOKEN"
export ANTHROPIC_MODEL="$MODEL"

claude-openai-gateway >"$GATEWAY_STDOUT" 2>"$GATEWAY_STDERR" &
gateway_pid=$!

cleanup() {
  kill "$gateway_pid" >/dev/null 2>&1 || true
  wait "$gateway_pid" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

for _ in $(seq 1 200); do
  if curl --noproxy '*' --fail --silent --max-time 1 "http://127.0.0.1:$PORT/health" >/dev/null 2>&1; then
    "$@"
    exit $?
  fi
  if ! kill -0 "$gateway_pid" >/dev/null 2>&1; then
    cat "$GATEWAY_STDERR" >&2 || true
    exit 1
  fi
  sleep 0.1
done

echo "Claude OpenAI gateway did not become ready" >&2
cat "$GATEWAY_STDERR" >&2 || true
exit 1
