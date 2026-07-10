#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 || $# -gt 3 ]]; then
  echo "Usage: $0 <codex|claude-code|pi-dev> <default|instructions|native> [testbed-name]" >&2
  exit 1
fi

HARNESS="$1"
LANE="$2"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
TARGET_NAME="${3:-$LANE-$HARNESS-monkey-d-loopy}"
TARGET_DIR="$ROOT_DIR/testbeds/$TARGET_NAME"
BASELINE_COMMIT="32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e"
EXPECTED_PUSH_URL="disabled://agentic-harness-lab/no-push"
PINNED_PNPM="10.33.3"

case "$HARNESS" in
  codex|claude-code|pi-dev) ;;
  *) echo "Unknown harness: $HARNESS" >&2; exit 1 ;;
esac

case "$LANE" in
  default|instructions|native) ;;
  *) echo "Unknown lane: $LANE" >&2; exit 1 ;;
esac

SETUP_DIR="$ROOT_DIR/harness-setups/$LANE/$HARNESS"
if [[ "$LANE" != "default" && ! -d "$SETUP_DIR" ]]; then
  echo "Missing harness setup: $SETUP_DIR" >&2
  exit 1
fi

if [[ "$LANE" == "native" ]]; then
  case "$HARNESS" in
    codex)
      [[ -x "$SETUP_DIR/.codex/hooks/spec-gate.sh" ]] || {
        echo "Native Codex setup is incomplete: missing executable spec-gate.sh" >&2
        exit 1
      }
      [[ -f "$SETUP_DIR/.codex/config.toml" ]] \
        && grep -q '^\[\[hooks\.PreToolUse\]\]$' "$SETUP_DIR/.codex/config.toml" \
        && grep -q '^matcher = "Edit|Write"$' "$SETUP_DIR/.codex/config.toml" || {
        echo "Native Codex setup is incomplete: missing PreToolUse registration" >&2
        exit 1
      }
      ;;
    claude-code)
      [[ -x "$SETUP_DIR/.claude/hooks/spec-gate.sh" ]] || {
        echo "Native Claude Code setup is incomplete: missing executable spec-gate.sh" >&2
        exit 1
      }
      [[ -f "$SETUP_DIR/.claude/settings.json" ]] \
        && jq -e '.hooks.PreToolUse | length > 0' "$SETUP_DIR/.claude/settings.json" >/dev/null || {
        echo "Native Claude Code setup is incomplete: missing PreToolUse registration" >&2
        exit 1
      }
      ;;
    pi-dev)
      [[ -d "$SETUP_DIR/.pi/extensions" ]] && find "$SETUP_DIR/.pi/extensions" -type f -print -quit | grep -q . || {
        echo "Native Pi setup is incomplete: missing extension" >&2
        exit 1
      }
      ;;
  esac
fi

"$ROOT_DIR/scripts/clone-subject.sh" "$TARGET_NAME"

if [[ "$LANE" != "default" ]]; then
  printf '\nApplying %s/%s project resources\n' "$LANE" "$HARNESS"
  cp -R "$SETUP_DIR"/. "$TARGET_DIR"/
fi

exclude_file="$TARGET_DIR/.git/info/exclude"
for pattern in /AGENTS.md /CLAUDE.md /.codex/ /.claude/ /.pi/ /.harness-lab/; do
  if ! grep -qxF "$pattern" "$exclude_file"; then
    printf '%s\n' "$pattern" >> "$exclude_file"
  fi
done

export PATH="$ROOT_DIR/scripts/bin:$PATH"
actual_pnpm="$(pnpm --version)"
if [[ "$actual_pnpm" != "$PINNED_PNPM" ]]; then
  echo "Expected pnpm $PINNED_PNPM, got $actual_pnpm" >&2
  exit 1
fi

if [[ "${PREPARE_SKIP_INSTALL:-0}" != "1" ]]; then
  printf '\nInstalling dependencies with pnpm %s (outside timed run)\n' "$actual_pnpm"
  pnpm --dir "$TARGET_DIR" install --frozen-lockfile
fi

[[ "$(git -C "$TARGET_DIR" rev-parse HEAD)" == "$BASELINE_COMMIT" ]]
[[ "$(git -C "$TARGET_DIR" remote get-url --push origin)" == "$EXPECTED_PUSH_URL" ]]
[[ -x "$TARGET_DIR/.git/hooks/pre-push" ]]

if [[ -n "$(git -C "$TARGET_DIR" status --porcelain)" ]]; then
  echo "Prepared testbed is not clean:" >&2
  git -C "$TARGET_DIR" status --short >&2
  exit 1
fi

printf '\nPrepared run testbed:\n%s\n' "$TARGET_DIR"
printf 'lane=%s harness=%s node=%s pnpm=%s\n' "$LANE" "$HARNESS" "$(node --version)" "$actual_pnpm"
