## Handoff

**Changed:** `examples/deploy-watch.yaml` — added a 6-line header comment.

**Why this file:** every other example in `examples/` (`test-green.yaml`, `link-sweep.yaml`, `migrate-deprecations.yaml`, `issue-triage.yaml`, `release-notes.yaml`) opens with a comment explaining its pattern, what it proves, and (implicitly) when to reach for it. `deploy-watch.yaml` was the one outlier with no such header, so a new user landing on it had less context than on the others.

**What the new comment says:** names the `poll-until` pattern, states what the example does (poll → agent-fix-on-red → sleep-on-pending), calls out the grounding (exit is decided by the HTTP response, not the agent), and gives explicit "use this when / not for" guidance — external status with its own timeline (deploys, jobs, provisioning) vs. one-shot agent work.

**Verification:** `loopc validate` couldn't run — `pnpm install` in this sandbox halts on an unapproved `esbuild` build script (pre-existing environment gap, unrelated to this change; running `pnpm approve-builds` would mutate install state so I left it alone). Instead I confirmed correctness the tool would have checked anyway: parsed the file with PyYAML before and after the edit and diffed the resulting structures — identical, confirming the edit is comment-only with zero effect on the loaded spec. I also caught and reverted an unrelated stray edit to `pnpm-workspace.yaml` that the failed install attempt had made, so the working tree only contains the intended change.

**Residual risk:** none functionally (comments aren't parsed into the spec). Documentation-only risk is that the guidance in the comment could drift from the pattern's actual semantics if `poll-until` behavior changes later — no different from the existing headers on other examples.

**Not done (out of scope):** did not touch `examples/README.md`'s summary table (already accurate for this example) or `nightly-digest.yaml` (the other example lacking a header) — task asked for one example, kept small.

**Nothing pushed** — all changes are local and uncommitted.
