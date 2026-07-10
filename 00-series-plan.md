# Canonical Series Roadmap

This is the canonical editorial and production plan for the Codex, Claude Code, and Pi comparison. Other planning files may add channel-specific detail, but they must not redefine the series count, subject repository, evaluation lanes, or publication order.

## Goal

Produce a source-grounded, hands-on series showing how three coding-agent harnesses shape the same software workflow. The comparison focuses on harness behavior rather than declaring one underlying model universally better.

## Audience

- senior engineers and technical founders
- engineering managers evaluating team adoption
- platform engineers building repeatable agent workflows
- practitioners deciding how much harness customization they want to own

## Canonical Subject

- Repository: `MaTriXy/Monkey.D.Loopy`
- First baseline: `32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e`
- Constraint: no changes from this lab are pushed to the subject repository

The current baseline and refresh policy live in `lab/subject-repo.md`.

## Three-Article Series

### Article 1: The Agent Harness Is the Product

Purpose: establish the vocabulary and explain why a model-only comparison is incomplete.

Show:

- harness anatomy: model, context, tools, permissions, workflow policy, verification, and handoff
- documented control surfaces in Codex, Claude Code, and Pi
- the difference between default behavior, project instructions, and mechanical enforcement
- the evaluation protocol used by the rest of the series

### Article 2: Pi, Codex, and Claude Code: How Minimal Is Minimal?

Purpose: answer the team's practical Pi question without treating Pi as an empty or incomplete clone.

Show:

- Pi's useful default: four core tools plus `AGENTS.md`/`CLAUDE.md` context loading
- level 0: authenticated default harness
- level 1: persistent project instructions
- level 2: native customization with skills, hooks, subagents, or extensions
- setup effort, trust boundaries, and what each harness expects the operator to own

### Article 3: Same Workflow, Controlled Harness Comparison

Purpose: present the measured runs and decision guide.

Show:

- the same baseline, exact task, verification commands, and permission envelope
- GPT-5.6 Sol in Codex versus GPT-5.6 Sol through Pi's `openai-codex` provider
- Claude Sonnet in Claude Code versus the same resolved Claude model through Pi, when available
- deterministic workflow-gate results separated from subjective output-quality review
- which conclusions are observations, hypotheses, or unresolved questions

## Evaluation Lanes

Every hands-on claim must identify its lane.

| Lane | Purpose | Project setup |
| --- | --- | --- |
| `default` | Show useful out-of-box behavior after authentication | No project instruction, skill, hook, or extension files |
| `instructions` | Compare persistent project guidance | Equivalent `AGENTS.md` or `CLAUDE.md` content only |
| `native` | Compare each harness's stronger workflow mechanisms | Codex hook/skill, Claude hook/subagent, Pi skill/extension as appropriate |

Do not combine results from different lanes into one score.

## Task Set

1. Orientation task: inspect the repository and report the app boundary and verification commands without editing.
2. Fixed documentation task: update the same named example and documentation surface in every run.
3. Narrow code task: add or improve one validation test with an exact acceptance contract.
4. Gate canary: issue a harmless request that attempts to skip the required spec step and record whether instruction-only or native enforcement stops it.
5. Safety canary: exercise a non-destructive operation outside the allowed policy and record the harness response.

Task text and expected outcomes live in `protocols/tasks/`.

## Model Matrix

| Comparison | Harnesses | Model control |
| --- | --- | --- |
| OpenAI same-model | Codex, Claude Code, and Pi | `gpt-5.6-sol` at `high` effort in all three. Claude Code uses the lab-owned experimental Anthropic Messages adapter backed by Pi AI's raw OpenAI Codex transport; record the resolved provider, model, and transport. |
| Anthropic same-model | Claude Code and Pi | Resolve and record the exact Sonnet model in both; Opus may be a separate run |
| Native product experience | Codex, Claude Code, and Pi | Use the intended model for each product; do not call this a model-controlled comparison |

The user-requested `gpt-5.6-sol` target is pinned for the measured OpenAI comparison. Earlier GPT-5.5 runs remain historical shakeouts only.

## Measured Core Matrix

The first publishable same-model benchmark contains 18 cells:

- 3 harnesses: Codex, Claude Code, and Pi
- 2 exact tasks: `fixed-doc-v2` and `code-test-v2`
- 3 independent, counterbalanced repeats per harness/task cell
- one controlled `instructions` lane, one pinned baseline, and one common outer container

Orientation, native gate canaries, and safety canaries are companion diagnostics. Report them separately because they answer different questions and use different permission conditions. Do not average them into the output comparison.

The Claude Code OpenAI condition measures Claude Code's harness behavior through experimental lab infrastructure. It is not a supported Anthropic deployment configuration and must be labeled accordingly in every public claim.

## Evidence Standard

Every publishable comparison requires:

- exact harness and resolved model versions
- baseline commit and clean starting state
- exact prompt and instruction/config file hashes
- permission and sandbox posture
- global customization isolation status
- start time, end time, duration, and exit code
- curated visible transcript or step log
- final diff and deterministic verification output
- workflow-gate score and separately reviewed output-quality score
- explicit limitations and failed checks

Raw local transcripts remain ignored. Only redacted, curated evidence belongs in `captures/`.

## Channel Packaging

- X: three long-form Articles, one hook post and several evidence posts per article
- LinkedIn: professional adaptations focused on team workflow and governance
- Video: one main controlled-comparison walkthrough plus shorter harness chapters
- Podcast: one narrative episode using the article spine, with technical details in show notes

Channel-specific material lives under `drafts/` and `articles/`.

## Current Status

- `pilot-01` completed on 2026-07-09 and exposed protocol defects.
- Pilot output is retained as exploratory evidence, not benchmark evidence.
- Protocol hardening is in progress; the native lane is blocked until its setup and canary checks pass.
- No new model comparison should be interpreted until the corrected controlled runs complete.

## Production Order

1. Canonicalize claims, terminology, and source ownership.
2. Harden clone, toolchain, auth isolation, no-push, and capture tooling.
3. Normalize and reassess `pilot-01`.
4. Run the `default` and `instructions` lanes.
5. Build and run the `native` lane.
6. Complete the same-model OpenAI and Anthropic comparisons.
7. Draft Article 3 from measured evidence.
8. Draft Articles 1 and 2 with the final factual framing.
9. Adapt the articles for LinkedIn, video, and podcast.
10. Publish only after a final source, redaction, and claim audit.

## Editorial Rules

- Documented feature claims, observed run behavior, and editorial interpretation must remain visibly separate.
- Do not call a one-run observation statistically conclusive.
- Do not call project trust a sandbox or permission system.
- Do not treat a model alias as a resolved model without capture evidence.
- Do not turn environment or toolchain failures into harness failures.
- Prefer "Pi" or "Pi (pi.dev)" as the product name; use `pi` for the CLI.
