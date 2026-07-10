#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
START_REPEAT="${1:-7}"

[[ "$START_REPEAT" =~ ^[1-9][0-9]*$ ]] || {
  echo "Start repeat must be a positive integer" >&2
  exit 1
}

for offset in 0 1 2; do
  repeat=$((START_REPEAT + offset))
  for harness in codex claude-code pi-dev; do
    for task in fixed-doc code-test; do
      if find "$ROOT_DIR/captures/$harness" -maxdepth 1 -type d \
        -name "*--$task--instructions--$harness--*--r$repeat" -print -quit | grep -q . \
        || find "$ROOT_DIR/runs/raw" -maxdepth 1 -type d \
          -name "*--$task--instructions--$harness--*--r$repeat" -print -quit | grep -q .; then
        echo "Run artifacts already exist for $harness/$task repeat $repeat" >&2
        exit 1
      fi
    done
  done
done

"$ROOT_DIR/scripts/check-same-model-readiness.sh"

for offset in 0 1 2; do
  repeat=$((START_REPEAT + offset))
  MEASURED_READINESS_CONFIRMED=1 "$ROOT_DIR/scripts/run-same-model-shakeout.sh" "$repeat" measured
done

node "$ROOT_DIR/scripts/summarize-same-model-benchmark.mjs"
