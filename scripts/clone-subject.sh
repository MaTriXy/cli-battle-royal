#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
TESTBEDS_DIR="$ROOT_DIR/testbeds"
TARGET_NAME="${1:-monkey-d-loopy-main}"
REPO_URL="https://github.com/MaTriXy/Monkey.D.Loopy.git"
BASELINE_COMMIT="32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e"
DISABLED_PUSH_URL="disabled://agentic-harness-lab/no-push"

fail() {
  printf 'clone-subject: %s\n' "$*" >&2
  exit 1
}

if [[ ! "$TARGET_NAME" =~ ^[A-Za-z0-9][A-Za-z0-9._-]*$ ]]; then
  fail "invalid target name: $TARGET_NAME"
fi

if [[ "$TARGET_NAME" == "." || "$TARGET_NAME" == ".." ]]; then
  fail "target name may not be . or .."
fi

mkdir -p "$TESTBEDS_DIR"
TESTBEDS_DIR="$(cd "$TESTBEDS_DIR" && pwd -P)"
TARGET_DIR="$TESTBEDS_DIR/$TARGET_NAME"

if [[ -L "$TARGET_DIR" ]]; then
  fail "refusing symlink target: $TARGET_DIR"
fi

if [[ -e "$TARGET_DIR" && ! -d "$TARGET_DIR/.git" ]]; then
  fail "existing target is not an independent Git clone: $TARGET_DIR"
fi

if [[ -d "$TARGET_DIR/.git" ]]; then
  fetch_url="$(git -C "$TARGET_DIR" remote get-url origin 2>/dev/null || true)"
  if [[ "$fetch_url" != "$REPO_URL" ]]; then
    fail "unexpected origin fetch URL in $TARGET_DIR: ${fetch_url:-missing}"
  fi

  printf 'Refreshing existing testbed: %s\n' "$TARGET_DIR"
  git -C "$TARGET_DIR" fetch --no-tags origin main
else
  printf 'Cloning subject repo into: %s\n' "$TARGET_DIR"
  git clone --no-tags "$REPO_URL" "$TARGET_DIR"
fi

resolved_target="$(cd "$TARGET_DIR" && pwd -P)"
case "$resolved_target" in
  "$TESTBEDS_DIR"/*) ;;
  *) fail "resolved target escaped testbeds: $resolved_target" ;;
esac

git -C "$TARGET_DIR" cat-file -e "$BASELINE_COMMIT^{commit}"
git -C "$TARGET_DIR" checkout --detach --force "$BASELINE_COMMIT"
git -C "$TARGET_DIR" reset --hard "$BASELINE_COMMIT"
git -C "$TARGET_DIR" clean -fdx

git -C "$TARGET_DIR" remote set-url --push origin "$DISABLED_PUSH_URL"
hooks_dir="$TARGET_DIR/.git/hooks"
mkdir -p "$hooks_dir"
git -C "$TARGET_DIR" config --local core.hooksPath "$hooks_dir"

pre_push_hook="$hooks_dir/pre-push"
if [[ -e "$pre_push_hook" ]]; then
  chmod 0755 "$pre_push_hook"
fi
printf '%s\n' \
  '#!/usr/bin/env bash' \
  'printf "%s\n" "Pushes are disabled in agentic-harness-series testbeds." >&2' \
  'exit 1' > "$pre_push_hook"
chmod 0555 "$pre_push_hook"

actual_head="$(git -C "$TARGET_DIR" rev-parse HEAD)"
[[ "$actual_head" == "$BASELINE_COMMIT" ]] || fail "baseline mismatch: $actual_head"

actual_fetch_url="$(git -C "$TARGET_DIR" remote get-url origin)"
[[ "$actual_fetch_url" == "$REPO_URL" ]] || fail "fetch URL changed unexpectedly"

actual_push_url="$(git -C "$TARGET_DIR" remote get-url --push origin)"
[[ "$actual_push_url" == "$DISABLED_PUSH_URL" ]] || fail "push URL protection missing"

if "$pre_push_hook" origin "$actual_push_url" >/dev/null 2>&1; then
  fail "pre-push hook did not block"
fi

printf '\nSubject repo ready:\n'
git -C "$TARGET_DIR" status --short --branch
git -C "$TARGET_DIR" log -1 --oneline
printf 'fetch=%s\n' "$actual_fetch_url"
printf 'push=%s\n' "$actual_push_url"
printf '%s\n' "$TARGET_DIR"
