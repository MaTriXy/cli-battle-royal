# Evaluation Protocol

Version: `2.0-draft`

This protocol compares Codex, Claude Code, and Pi on `MaTriXy/Monkey.D.Loopy` without confusing model quality, user-global customization, toolchain drift, or permission posture with harness behavior.

## Release Gate

The lab must pass [05-phase-gate.md](../05-phase-gate.md) before a run may be
marked `measured`. A successful process exit or a complete capture directory
does not override a failed preparation, isolation, or native-enforcement check.

## Experimental Units

One run is identified by:

```text
<date>--<task>--<lane>--<harness>--<provider>--<model>--r<repeat>
```

Example:

```text
2026-07-10--fixed-doc--instructions--pi--openai-codex--gpt-5-6-sol--r1
```

Every conclusion must name the task, lane, harness, provider/model, and repeat count that produced it.

## Subject Control

- Repository: `MaTriXy/Monkey.D.Loopy`
- Baseline: recorded in `../lab/subject-repo.md`
- Starting state: detached baseline commit with no tracked or untracked task changes
- Remote protection: invalid push URL plus blocking `pre-push` hook
- Toolchain: Node `>=22`, pnpm exactly `10.33.3`
- Dependencies: installed before the timed agent run

Preparation must fail closed if the target path escapes `testbeds/`, the remote is not the expected repository, the baseline cannot be checked out, push protection is absent, or the pinned toolchain is unavailable.

## Common Outer Boundary

All measured local runs execute through `scripts/sandbox-lab.sh` and the
architecture in `lab/sandbox-boundary.md`. The agent receives a copied workspace
in a disposable volume, never a writable host bind mount. Measured runs fail
closed unless `HARNESS_LAB_CONTAINED=1`.

This boundary is lab infrastructure, not a harness feature. Capability and
native-safety results must still identify which inner sandbox, permission, or
trust controls were active.

## Evaluation Lanes

### `default`

Question: what does the authenticated harness do without project workflow customization?

- no project instruction/config resources
- no user-global skills, hooks, plugins, MCP, prompts, or extensions
- product system prompt and built-in tools remain intact
- task prompt contains only the task and safety boundary

### `instructions`

Question: what changes when the smallest persistent project-instruction artifact standardizes the workflow?

- Codex: `AGENTS.md`
- Claude Code: `CLAUDE.md`
- Pi: `AGENTS.md`
- equivalent semantic content and recorded file hashes
- no project hook, extension, skill, or subagent configuration

### `native`

Question: what can each harness enforce or automate beyond instruction-following?

- instruction artifact remains present
- one explicitly named native mechanism is added
- project resource count and implementation size are recorded
- canary must prove the mechanism rather than relying on configuration inspection

## Permission Conditions

### Capability condition

Used for docs/code output comparisons. Each harness can edit and run checks inside the protected testbed. Metadata must label any bypass or broad permission flag. These runs do not support default-safety claims.

### Safety condition

Used only for `05-safety-canary.md`. Each harness uses its documented default/recommended safety posture. Pi requires external process containment before strong isolation claims are allowed.

Capability and safety results are never merged.

## Model Conditions

### OpenAI same-model condition

- Codex: requested `gpt-5.6-sol`
- Pi: provider `openai-codex`, requested `gpt-5.6-sol`
- Claude Code: requested `gpt-5.6-sol` through the lab-owned Anthropic Messages
  adapter backed by Pi AI's raw `openai-codex` provider
- all three harnesses: reasoning effort explicitly pinned to `high`
- record the resolved provider/model and transport from every run

The Claude path uses Pi AI only for OAuth, provider transport, and normalized
model events. It does not load Pi's agent loop, tools, system prompt, context
discovery, or task orchestration. This controls the requested model and effort,
not system prompt, tools, transport, context construction, or hidden product
behavior. Anthropic does not support non-Claude models through third-party
gateways, so this lane is experimental comparison infrastructure rather than a
supported Claude Code deployment.

### Anthropic same-model condition

- Claude Code: `sonnet` or exact resolved Sonnet ID
- Pi: Anthropic provider with the same resolved model ID when available
- Opus is a separate condition, not a fallback silently mixed into Sonnet results

### Native product condition

Each harness may use its intended model. Results describe product experience and are not model-controlled.

## Task Set

| ID | File | Purpose |
| --- | --- | --- |
| `orientation` | `tasks/01-orientation.md` | Baseline context discovery without edits |
| `fixed-doc` | `tasks/02-fixed-doc-task.md` | Directly comparable documentation diff |
| `code-test` | `tasks/03-code-task.md` | Exact test-only implementation and verification |
| `gate-canary` | `tasks/04-gate-canary.md` | Instruction compliance versus native enforcement |
| `safety-canary` | `tasks/05-safety-canary.md` | Non-destructive boundary behavior |

Do not paraphrase task text during measured runs.

## Run Sequence

1. Prepare a fresh harness/lane testbed.
2. Verify baseline, remote protection, toolchain, and dependency state.
3. Create disposable workspace and auth volumes containing only the prepared clone and required auth artifact.
4. Record versions, environment manifest, task hash, setup-resource hashes, and starting status.
5. Start the timed harness process and capture raw stdout/stderr/events under ignored `runs/raw/`.
6. Record exit code and end time.
7. Run lab-owned deterministic verification outside the harness.
8. Capture final status, diff, remote configuration, and no-push hook check.
9. Generate a curated transcript and manifest under `captures/`.
10. Run redaction and secret scans before marking the capture publishable.
11. Score deterministic gates.
12. Have a reviewer score output quality without seeing the harness identity when practical.

## Repetition Policy

- Pipeline shakeout: one run per cell, labeled `shakeout`; not publishable comparison evidence.
- Measured comparison: three independent runs per task/lane/model cell.
- If a run fails because of the lab, repair the lab and rerun with a new run ID; do not count it as a harness failure.
- If the harness itself fails after a valid setup, retain and count the failure.

## Evidence Requirements

Each curated capture contains:

- `manifest.json`
- `prompt.txt`
- project setup resources or their redacted copies
- `transcript.md`
- `final.md`
- `diff.patch`
- `diff-stat.txt`
- `git-status.txt`
- `verification.txt`
- `scorecard.md`
- `limitations.md`

Raw provider payloads, hidden reasoning, credentials, and machine-private configuration never enter `captures/`.

## Metrics

Objective setup metrics:

- authentication precondition and supported login flow
- operator setup seconds
- setup commands
- project files and lines added
- decisions required
- failed setup attempts

Run metrics:

- wall-clock duration
- model requests when available
- input/output/cache tokens when available
- tool calls by type
- files read and changed
- verification commands attempted and passed

Scores use `scoring-rubric.md`.

## Claim Rules

- One run may illustrate behavior; it cannot establish a universal ranking.
- A model-controlled pair supports claims about harness differences only within that pair and task.
- A project instruction that the model follows is not mechanical enforcement.
- A configured hook/extension that was not triggered by a canary is not proven enforcement.
- Project trust is not a sandbox.
- An environment failure is not a harness failure.
- Subjective output scores remain separate from deterministic gate scores.

## Non-Goals

- ranking all models
- pushing changes to Monkey.D.Loopy
- publishing credentials, private machine paths, hidden reasoning, or global configuration
- treating the pilot as measured evidence
- collapsing default, instructions, native, capability, and safety conditions into one leaderboard
