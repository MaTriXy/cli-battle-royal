#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <capture-directory>" >&2
  exit 1
fi

CAPTURE_DIR="$1"
patterns=(
  '/Users/'
  '/home/'
  'sk-[A-Za-z0-9_-]{12,}'
  'Bearer[[:space:]]+[A-Za-z0-9._~+/-]{12,}'
  '"(access_token|refresh_token|api_key|authorization)"[[:space:]]*:'
  '"thinking"[[:space:]]*:'
  'thinkingSignature'
  'encrypted_content'
)

for pattern in "${patterns[@]}"; do
  if rg -n --hidden --glob '!redaction-scan.txt' "$pattern" "$CAPTURE_DIR" >/dev/null; then
    printf 'redaction_scan=fail\npattern=%s\n' "$pattern"
    exit 1
  fi
done

printf 'redaction_scan=pass\nmanual_review=required\n'
