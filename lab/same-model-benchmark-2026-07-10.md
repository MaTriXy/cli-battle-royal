# Same-Model Benchmark: 2026-07-10

## Scope

This is the first measured comparison of Codex CLI, Claude Code CLI, and Pi
(pi.dev) against `MaTriXy/Monkey.D.Loopy` at baseline
`32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e`.

- Model: resolved `gpt-5.6-sol`, high effort, no fallback
- Lane: controlled project instructions
- Tasks: one comment-only documentation edit and one focused test addition
- Repeats: three per harness/task cell, 18 runs total
- Boundary: the same disposable Docker workspace, push protection, pinned Node and pnpm, and lab-owned verification
- Review: identity-hidden output review followed by manual transcript review

Claude Code used the lab-owned Anthropic Messages adapter backed by Pi AI's raw
OpenAI Codex provider transport. Pi's agent loop was not loaded into Claude
Code. This is experimental test infrastructure, not a supported Anthropic
deployment.

## Objective Results

| Harness | Task | Runs | Process exits | Verifier passes | Median wall time | Median tool calls | Reported median tokens |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Codex | Fixed doc | 3 | 3/3 | 3/3 | 45s | 6 | 68,428 |
| Codex | Code test | 3 | 3/3 | 3/3 | 79s | 12 | 217,138 |
| Claude Code | Fixed doc | 3 | 3/3 | 3/3 | 30s | 8 | 83,215 |
| Claude Code | Code test | 3 | 3/3 | 3/3 | 94s | 19 | 299,829 |
| Pi | Fixed doc | 3 | 3/3 | 3/3 | 35s | 10 | 24,015 |
| Pi | Code test | 3 | 3/3 | 3/3 | 71s | 19 | 124,184 |

All 18 runs made only the allowed tracked-file change and passed the lab-owned
task checks. Wall time and tool calls are directly observed. Token values are
provider-reported telemetry and are not directly comparable because context
construction, cache accounting, and Claude's adapter transport differ.

## Workflow Review

| Gate | Passes | Finding |
| --- | ---: | --- |
| Orientation | 18/18 | Root, baseline, status, runtime metadata, and target context preceded editing. |
| Spec before edit | 18/18 | Goal, non-goals, acceptance, and verification preceded the first mutation. |
| Final review | 18/18 | Every run inspected the focused diff and final status after editing. |
| Handoff | 14/18 | Four finals omitted the rubric's explicit residual-risk statement. |

The four handoff failures were Codex code-test r8/r9, Claude Code code-test r7,
and Pi fixed-doc r9. They are reporting defects, not task-correctness failures.

## Blind Output Review

- Correctness: 18 scores of 5/5
- Repository fit: 18 scores of 5/5
- Scope discipline: 18 scores of 5/5
- Verification quality: 18 scores of 5/5
- Handoff quality: fourteen 5/5 scores and four 4/5 scores

Handoff scores by cell:

| Harness | Fixed doc | Code test |
| --- | --- | --- |
| Codex | 5, 5, 5 | 5, 4, 4 |
| Claude Code | 5, 5, 5 | 4, 5, 5 |
| Pi | 5, 5, 4 | 5, 5, 5 |

No composite score is calculated. Deterministic gates, subjective output
quality, speed, tool calls, and token telemetry answer different questions.

## Configuration Burden

The controlled instruction lane required one project file with 29 lines for
each harness: `AGENTS.md` for Codex and Pi, and `CLAUDE.md` for Claude Code.
Each measured setup recorded one operator command, zero decisions, and zero
failed setup attempts. This equality is intentional lab control, not a claim
that the products have equal default configuration needs.

The native enforcement canary required:

| Harness | Project files | Project lines | Mechanism | Canary result |
| --- | ---: | ---: | --- | --- |
| Codex | 3 | 62 | `AGENTS.md`, project hook config, shell hook | deny then allow |
| Claude Code | 3 | 69 | `CLAUDE.md`, project settings, shell hook | deny then allow |
| Pi | 2 | 69 | `AGENTS.md`, TypeScript extension | deny then allow |

The common Docker boundary protected the host for every harness. It must not be
credited as a native harness feature. Pi needs this external boundary for
process isolation; the native extension supplies workflow enforcement, not a
process sandbox.

## Interpretation

These two tasks do not identify an output-quality winner. Every implementation
passed, and the blind reviewer found no correctness, repository-fit, scope, or
verification defect. The useful differences in this matrix are operational:

- Claude Code had the lowest median time on the comment task.
- Pi had the lowest median time on the code-test task.
- Codex used the fewest median tool calls on both tasks.
- All three occasionally produced a less complete handoff.

These are task-bounded observations from three repeats, not product-wide
rankings. The stronger article framing is how much control each harness exposes,
how that control is configured, and which behavior belongs to the model,
harness, or outer sandbox.

## Remaining Work

1. Add default-lane runs to show how much behavior comes from each bare harness before project instructions.
2. Run the separate Anthropic same-model matrix: Claude Code versus Pi on the exact resolved Sonnet model. Run Opus as a separate condition; never mix it as fallback.
3. Complete the safety canaries under recommended safety posture; keep them separate from capability runs.
4. Draft the first three-article series from this evidence; publishing derived content requires explicit editorial approval.
