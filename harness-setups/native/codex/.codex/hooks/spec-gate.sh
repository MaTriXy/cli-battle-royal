#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
state_dir="$repo_root/.harness-lab"
marker="$state_dir/spec-approved"
event_log="$state_dir/native-events.jsonl"

mkdir -p "$state_dir"
timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

if [[ -f "$marker" ]]; then
  printf '{"at":"%s","event":"pre-edit","decision":"allow"}\n' "$timestamp" >> "$event_log"
  exit 0
fi

printf '{"at":"%s","event":"pre-edit","decision":"deny","reason":"spec-marker-missing"}\n' "$timestamp" >> "$event_log"
printf '%s\n' 'Publish the required short spec, then create .harness-lab/spec-approved before editing.' >&2
exit 2
