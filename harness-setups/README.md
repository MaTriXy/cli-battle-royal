# Harness Setups

These resources define the three evaluation lanes. `prepare-run.sh` copies only
the selected harness/lane directory into a fresh subject checkout.

| Lane | Project resources |
| --- | --- |
| `default` | None |
| `instructions` | One native project instruction file |
| `native` | The same instruction text plus one logged edit-gate mechanism |

The instruction text is intentionally equivalent across harnesses. Filenames
differ because each product discovers a different native project file.

The native gate blocks the harness's normal file-edit tool until
`.harness-lab/spec-approved` exists. The workflow tells the agent to create that
marker only after publishing its short spec. This is an observable guardrail,
not a sandbox: shell-based writes or other tool paths may bypass an edit hook.

`default` has no directory because even a placeholder file would contaminate
that lane.
