#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
REPEAT="${1:-1}"
STATUS="${2:-shakeout}"

if [[ "$STATUS" == "measured" && "${MEASURED_READINESS_CONFIRMED:-0}" != "1" ]]; then
  echo "Measured runs must use scripts/run-same-model-benchmark.sh" >&2
  exit 1
fi

export HARNESS_LAB_CONTAINED=1
export EFFORT_OVERRIDE=high

run_cell() {
  local harness="$1"
  local task="$2"
  if [[ "$harness" == "claude-code" ]]; then
    PROVIDER_OVERRIDE=openai-codex MODEL_OVERRIDE=gpt-5.6-sol \
      "$ROOT_DIR/scripts/run-harness.sh" "$harness" instructions "$task" "$REPEAT" "$STATUS"
    return
  fi
  "$ROOT_DIR/scripts/run-harness.sh" "$harness" instructions "$task" "$REPEAT" "$STATUS"
}

case $((REPEAT % 3)) in
  0) harnesses=(codex claude-code pi-dev) ;;
  1) harnesses=(claude-code pi-dev codex) ;;
  2) harnesses=(pi-dev codex claude-code) ;;
esac

if (( REPEAT % 2 == 0 )); then
  tasks=(code-test fixed-doc)
else
  tasks=(fixed-doc code-test)
fi

for task in "${tasks[@]}"; do
  for harness in "${harnesses[@]}"; do
    run_cell "$harness" "$task"
  done
done
