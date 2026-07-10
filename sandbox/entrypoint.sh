#!/usr/bin/env bash
set -euo pipefail

umask 077

mkdir -p \
  "$HOME/.codex" \
  "$HOME/.claude" \
  "$HOME/.pi/agent" \
  "$HOME/.cache" \
  "$HOME/.config"

copy_auth() {
  local source="$1"
  local target="$2"
  if [[ -f "$source" ]]; then
    cp "$source" "$target"
    chmod 0600 "$target"
  fi
}

copy_auth /run/lab-auth/codex-auth.json "$HOME/.codex/auth.json"
copy_auth /run/lab-auth/pi-auth.json "$HOME/.pi/agent/auth.json"
copy_auth /run/lab-auth/claude-credentials.json "$HOME/.claude/.credentials.json"

if [[ -f /run/lab-auth/claude-oauth-token ]]; then
  export CLAUDE_CODE_OAUTH_TOKEN="$(</run/lab-auth/claude-oauth-token)"
fi

export CODEX_HOME="$HOME/.codex"
export PI_CODING_AGENT_DIR="$HOME/.pi/agent"
export CI=1
export NO_COLOR=1
export DISABLE_TELEMETRY=1
export DISABLE_ERROR_REPORTING=1
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1

exec "$@"
