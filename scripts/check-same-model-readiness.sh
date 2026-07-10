#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
BASELINE="32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e"
REPO_URL="https://github.com/MaTriXy/Monkey.D.Loopy.git"
failures=0

pass() { printf 'pass: %s\n' "$1"; }
fail() { printf 'fail: %s\n' "$1" >&2; failures=$((failures + 1)); }

remote_head="$(git ls-remote "$REPO_URL" refs/heads/main | awk '{print $1}')"
[[ "$remote_head" == "$BASELINE" ]] && pass "subject baseline is current main" || fail "subject baseline is not current main"

[[ -f "$HOME/.codex/auth.json" ]] && pass "Codex auth is available" || fail "Codex auth is missing"
[[ -f "$HOME/.pi/agent/auth.json" ]] && pass "Pi OpenAI auth is available" || fail "Pi OpenAI auth is missing"

docker image inspect agentic-harness-lab:2026-07-10 >/dev/null 2>&1 \
  && docker image inspect agentic-harness-lab-proxy:2026-07-10 >/dev/null 2>&1 \
  && pass "pinned lab images are available" \
  || fail "pinned lab images are missing"

if "$ROOT_DIR/scripts/sandbox-lab.sh" canary >/dev/null; then
  pass "outer-boundary canary"
else
  fail "outer-boundary canary"
fi

if node "$ROOT_DIR/scripts/verify-capture-integrity.mjs" >/dev/null; then
  pass "curated capture integrity"
else
  fail "curated capture integrity"
fi

for harness in codex claude-code pi-dev; do
  for task in fixed-doc code-test; do
    capture="$(find "$ROOT_DIR/captures/$harness" -maxdepth 1 -type d \
      -name "*--$task--instructions--$harness--*gpt-5-6-sol--r6" -print -quit)"
    if [[ -z "$capture" ]]; then
      fail "$harness/$task shakeout evidence is missing"
      continue
    fi
    if grep -qx 'overall=pass' "$capture/verification.txt" \
      && grep -q '"modelResolved": "gpt-5.6-sol"' "$capture/manifest.json" \
      && grep -q '"reasoningEffort": "high"' "$capture/manifest.json" \
      && grep -qx 'redaction_scan=pass' "$capture/redaction-scan.txt"; then
      pass "$harness/$task shakeout evidence"
    else
      fail "$harness/$task shakeout evidence"
    fi
  done
done

for harness in codex claude-code pi-dev; do
  gate_passed=0
  while IFS= read -r capture; do
    if grep -qx 'native_gate_denial=pass' "$capture/verification.txt" \
      && grep -qx 'overall=pass' "$capture/verification.txt" \
      && grep -qx 'redaction_scan=pass' "$capture/redaction-scan.txt"; then
      gate_passed=1
      break
    fi
  done < <(find "$ROOT_DIR/captures/$harness" -maxdepth 1 -type d -name '*--gate-canary--native--*' | sort)
  [[ $gate_passed -eq 1 ]] && pass "$harness native gate denial" || fail "$harness native gate denial"
done

if [[ $failures -ne 0 ]]; then
  printf '%s readiness check(s) failed\n' "$failures" >&2
  exit 1
fi

printf 'same-model measured readiness: pass\n'
