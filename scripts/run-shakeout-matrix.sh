#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
export HARNESS_LAB_CONTAINED="${HARNESS_LAB_CONTAINED:-1}"

for task in fixed-doc code-test; do
  for harness in codex claude-code pi-dev; do
    "$ROOT_DIR/scripts/run-harness.sh" "$harness" instructions "$task" 1 shakeout
  done
done

for harness in codex claude-code pi-dev; do
  "$ROOT_DIR/scripts/run-harness.sh" "$harness" native gate-canary 1 shakeout
done
