# CLI Battle Royale: Agentic Harness Lab

Research repository for the Codex vs Claude Code vs Pi (pi.dev) comparison series.

Repository: [`MaTriXy/cli-battle-royal`](https://github.com/MaTriXy/cli-battle-royal)

Status: first same-model measured benchmark complete and reviewed as of 2026-07-10. Curated evidence is versioned here; article, video, and podcast publication still requires explicit editorial approval.

No automation may publish derived content or mutate the subject repository. Repository pushes also require an explicit operator request. This is the working home for:

- harness comparison research
- test protocol and captures
- X/Twitter articles
- LinkedIn adaptations
- video scripts and captures
- podcast scripts, show notes, and later audio assets

## Repo Under Test

Primary target repo:

- GitHub: `MaTriXy/Monkey.D.Loopy`
- URL: <https://github.com/MaTriXy/Monkey.D.Loopy>
- Default branch: `main`
- Baseline commit for first protocol draft: `32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e`
- Description: factory for runnable, crash-resumable agent loops.

Use a clean local clone from `main` for tests. Do not use an unrelated local feature branch as the baseline.

## Terminology

- Codex: OpenAI Codex CLI/app/IDE/cloud coding agent. This covers the item called "Kodex" in the initial notes.
- Claude Code: Anthropic Claude Code. This assumes "Cloud Code" was a voice transcription of "Claude Code".
- Pi: Pi Coding Agent from `pi.dev`, written as P-I dot dev in the initial notes. Use "Pi (pi.dev)" on first public mention and "Pi" afterward.

Open question: if "Cloud Code" means Google Cloud Code instead of Claude Code, split that into a separate comparison because it is an IDE/cloud tooling product, not the same category of agent harness.

## Files

- [00-series-plan.md](00-series-plan.md): canonical three-article roadmap, evaluation lanes, and production order.
- [01-comparison-matrix.md](01-comparison-matrix.md): documented facts, setup levels, and hypotheses to test.
- [02-agentic-flow-setups.md](02-agentic-flow-setups.md): setup recipes for the same agentic workflow in each harness.
- [03-team-short-guide.md](03-team-short-guide.md): short practical answer to the team question about Pi configuration and minimal defaults.
- [04-cross-channel-showcase-plan.md](04-cross-channel-showcase-plan.md): end-to-end plan for X/Twitter, LinkedIn, video, and podcast packaging.
- [05-phase-gate.md](05-phase-gate.md): required checks before any run can be labeled measured or used for ranking claims.
- [lab/subject-repo.md](lab/subject-repo.md): target repo identity, baseline, and constraints.
- [lab/run-summary-2026-07-09.md](lab/run-summary-2026-07-09.md): exploratory `pilot-01` run summary and limitations.
- [lab/preflight-2026-07-10.md](lab/preflight-2026-07-10.md): measured-run preflight evidence and remaining blockers.
- [lab/same-model-benchmark-2026-07-10.md](lab/same-model-benchmark-2026-07-10.md): reviewed results from the 18-run same-model matrix.
- [lab/sandbox-boundary.md](lab/sandbox-boundary.md): disposable outer-container architecture and authentication disposition.
- [protocols/evaluation-protocol.md](protocols/evaluation-protocol.md): common test procedure for each harness.
- [protocols/capture-template.md](protocols/capture-template.md): run note template for Codex, Claude Code, and Pi captures.
- [research/sources.md](research/sources.md): source list and verification notes.
- [scripts/clone-subject.sh](scripts/clone-subject.sh): local helper to clone the subject repo into ignored `testbeds/`.

## Benchmark Workflow

The core same-model benchmark is 18 measured runs: three harnesses, two exact tasks, and three counterbalanced repeats. All use `gpt-5.6-sol` at high effort in the controlled `instructions` lane.

```bash
# Must pass before a measured run can start.
scripts/check-same-model-readiness.sh

# Runs three unused repeat IDs, starting at 7 by default.
scripts/run-same-model-benchmark.sh 7

# Creates identity-hidden review packets under ignored runs/local/.
scripts/create-blind-review-packets.mjs

# After every packet is scored, attaches reviews to the curated captures.
scripts/apply-blind-review-scores.mjs runs/local/blind-review/<batch>

# Attaches manual transcript-gate findings to all measured captures.
node scripts/apply-workflow-review.mjs

# Prints objective aggregates, workflow gates, and blind handoff scores.
scripts/summarize-same-model-benchmark.mjs
```

The Claude Code cell uses an experimental lab-owned Anthropic Messages adapter backed by the isolated Pi OpenAI Codex transport. It measures harness behavior under a controlled model; it is not a supported Claude Code provider configuration.

Orientation, native enforcement canaries, and safety canaries are companion diagnostics. They are reported separately and never averaged into the output comparison.

## Working Thesis

Codex, Claude Code, and Pi all support agentic software work, but they optimize for different operators:

- Codex is the integrated coding-agent surface with strong local/cloud continuity, AGENTS.md guidance, managed config, sandboxing, skills, and explicit subagent orchestration.
- Claude Code is the batteries-included terminal and IDE agent with CLAUDE.md memory, settings hierarchy, hooks, MCP, and built-in/custom subagents.
- Pi is the minimal, hackable harness: it is useful with core tools and context files, while advanced workflows can be built from extensions, skills, prompt templates, providers, packages, and SDK usage.

The series should avoid generic "which is best" framing. The better framing is: which harness gives you the right control plane for your agentic workflow?

These are working hypotheses, not conclusions. Controlled results must be allowed to change the framing.

## Working Directories

- `articles/`: final-ish article drafts by channel.
- `captures/`: curated evidence from harness runs.
- `drafts/`: working social/video/podcast drafts.
- `lab/`: subject-repo and evaluation metadata.
- `protocols/`: repeatable test procedure and templates.
- `scripts/`: helper scripts for reproducible local setup.
- `sandbox/`: pinned agent image, provider allowlist proxy, and boundary documentation.
- `testbeds/`: ignored local clones of repos under test.
