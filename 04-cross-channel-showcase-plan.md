# Cross-Channel Showcase Plan

This plan turns the Codex vs Claude Code vs Pi comparison into a reusable content system for X/Twitter, LinkedIn, video, and podcast. `00-series-plan.md` owns the canonical article count, evaluation lanes, subject repository, and production order.

## End-to-End Recap

We are building a content series about agentic coding harnesses, not just AI coding models.

The comparison set:

- Codex: OpenAI's integrated coding-agent workflow.
- Claude Code: Anthropic's lifecycle-rich terminal/IDE coding agent.
- Pi: a minimal and hackable coding-agent harness from pi.dev.

The core question from the team:

> Has anyone compared Pi to the popular harnesses like Claude Code and Codex? How much configuration does Pi require? How minimal is it?

The current answer:

- Yes, the comparison is worth doing.
- Pi should not be treated as a drop-in clone of Codex or Claude Code.
- Pi is useful with core tools and context files, then becomes more programmable through skills, extensions, packages, and SDK modes.
- The useful comparison is not "which model is smartest?" but "which harness gives the right control plane for the workflow?"

## What We Already Have

- `00-series-plan.md`: canonical three-article roadmap and evaluation structure.
- `01-comparison-matrix.md`: practical feature matrix.
- `02-agentic-flow-setups.md`: same agentic workflow setup in each harness.
- `03-team-short-guide.md`: short answer to the team's Pi question.
- `research/sources.md`: verified source notes.

## What We Need To Build

### 1. Canonical Subject Repo

Use `MaTriXy/Monkey.D.Loopy` at the pinned baseline recorded in `lab/subject-repo.md`.

Requirements already satisfied:

- public code and MIT license
- real TypeScript monorepo structure
- documentation, validation, and test surfaces
- enough domain context to require orientation
- pinned commit and ignored local testbeds

Controlled task set:

> Run orientation, a fixed-file documentation change, a narrow validation test, and harmless policy canaries under the lanes defined in `00-series-plan.md`.

### 2. Workflow Gate

Create the same workflow gate for each harness:

- Codex: `AGENTS.md` plus optional skill.
- Claude Code: `CLAUDE.md` plus optional hook/subagent.
- Pi: `AGENTS.md` for instruction parity, then a skill or TypeScript extension for the native lane.

The gate should force:

1. repo orientation
2. acceptance criteria
3. non-goals
4. blocking questions only
5. implementation
6. verification
7. handoff note

### 3. Evidence Captures

For each harness, capture:

- install / first-run notes
- project config files
- first response to the same task
- whether it follows the spec gate
- what it edits
- verification result
- final handoff quality
- number of files required to standardize the workflow
- where the agent could bypass policy

### 4. Visual Assets

Build simple diagrams:

- Harness anatomy: model, context, tools, permissions, workflow policy.
- Same flow in three harnesses.
- Pi default-to-custom ladder.
- Team decision matrix.

These diagrams can be reused in LinkedIn articles, X posts, video, and podcast show notes.

## Showcase Structure

### Part 1: The Hook

Claim:

> The agent harness is now more important than the prompt.

Show:

- One screenshot/table showing Codex, Claude Code, and Pi side by side.
- Explain that all three can run code, but they differ in control surface.

Build:

- A one-page matrix.
- A 60-second video intro.
- One X/LinkedIn post that asks the team's question directly.

### Part 2: Pi Is Minimal On Purpose

Claim:

> Pi starts useful and keeps the product core smaller; stronger policy and isolation remain operator-owned.

Show:

- Fresh authenticated Pi session with no project config.
- Add only `AGENTS.md` for instruction parity.
- Add a skill for reusable guidance.
- Add a TypeScript extension for native behavior.

Build:

- Short guide article.
- Screencast of Pi going from empty to useful workflow.
- Podcast segment: "minimal is useful; programmable is the differentiator."

### Part 3: Codex As Productized Agent Workflow

Claim:

> Codex is strongest when you want the agent workflow to feel coherent across local, IDE, cloud, and review surfaces.

Show:

- `AGENTS.md`.
- `.codex/config.toml`.
- skill usage.
- subagent/review story.

Build:

- Codex-specific article.
- Short video chapter showing setup and first task.
- X thread/post: "Codex is not just chat in a terminal."

### Part 4: Claude Code As Lifecycle Automation

Claim:

> Claude Code's differentiator is lifecycle: memory, hooks, settings, MCP, permissions, and subagents.

Show:

- `CLAUDE.md`.
- `.claude/settings.json`.
- hook example.
- custom review subagent example.

Build:

- Claude-specific article.
- Demo of a hook blocking or logging behavior.
- Podcast segment on policy enforcement vs instruction-only workflows.

### Part 5: Same Workflow, Three Harnesses

Claim:

> The real comparison appears only when the task is identical.

Show:

- Same repo.
- Same task.
- Same gate.
- Same verification expectations.
- Compare results.

Build:

- Main article.
- Main video.
- LinkedIn carousel-style breakdown.
- X long-form Article or multi-post thread.
- Podcast episode with narrative flow and lessons learned.

### Part 6: Decision Guide

Claim:

> The right harness depends on whether you want product workflow, lifecycle policy, or custom harness control.

Show:

- Team matrix:
  - solo builder
  - startup engineering team
  - platform/tooling team
  - enterprise team

Build:

- Final summary article.
- Decision tree graphic.
- Short clips for each recommendation.

## Channel Packaging

### X/Twitter

Use X for:

- sharp claims
- quick comparison tables
- screenshots
- short clips
- long-form Article when the piece deserves full treatment

Format:

- Three long-form X Articles as the primary series.
- 1 hook post per article.
- 3-5 supporting posts per article.
- 1 visual per article.
- Short clips from the video workflow.
- Follow-up articles only when audience comments/questions show demand.

Primary X Article sequence:

1. `The Agent Harness Is the Product`
2. `Pi vs Codex vs Claude Code: How Minimal Is Minimal?`
3. `Same Agentic Workflow, Three Harnesses`

Detailed outline: `drafts/x/series-outline.md`.

Editorial style:

- Direct.
- Opinionated.
- Concrete examples.
- Avoid abstract AI hype.

### LinkedIn

Use LinkedIn for:

- longer professional framing
- team adoption lessons
- decision matrices
- engineering leadership takeaways
- newsletter/article versions

Format:

- Newsletter/article per major part.
- Short feed post to introduce each article.
- Cover image for each article.
- Clear publishing cadence.

Editorial style:

- Practical.
- Less edgy than X.
- Tie each post to team workflow, governance, and repeatability.

### Video

Use video for:

- showing the actual harness behavior
- terminal walkthroughs
- config files
- side-by-side comparisons
- moments where the tools behave differently

Format:

- One main 12-20 minute video: "Codex vs Claude Code vs Pi: same agentic workflow."
- Three 4-8 minute product-specific videos.
- Short clips for each key claim.

Chapters:

1. Why harness matters.
2. Baseline workflow.
3. Codex setup.
4. Claude Code setup.
5. Pi setup.
6. Same task results.
7. Decision guide.

### Podcast

Use podcast for:

- the narrative argument
- tradeoffs
- personal observations
- "what I would choose and why"

Format:

- Solo episode with your voice.
- Use the same spine as the main article.
- Keep code details in show notes.
- Publish transcript as a blog/article draft.

Suggested episode title:

> The Agent Harness Is the Product: Codex vs Claude Code vs Pi

Podcast structure:

1. The team's question.
2. Why model comparison is not enough.
3. What a harness controls.
4. Codex: integrated product workflow.
5. Claude Code: lifecycle automation.
6. Pi: minimal core and custom harness path.
7. What the same workflow revealed.
8. Recommendation by team type.

## Production Order

The canonical order lives in `00-series-plan.md`. Cross-channel production begins only after controlled evidence and redaction checks pass.

## Draft Asset List

- `lab/`: subject identity, pilot assessment, and controlled-run summaries.
- `testbeds/`: ignored local clones prepared from the pinned baseline.
- `captures/codex/`: screenshots, logs, config, outputs.
- `captures/claude-code/`: screenshots, logs, config, outputs.
- `captures/pi-dev/`: screenshots, logs, config, outputs.
- `diagrams/`: source diagrams and exports.
- `drafts/x/`: X post drafts and long-form Article.
- `drafts/linkedin/`: LinkedIn posts/newsletter drafts.
- `drafts/video/`: video script, shot list, chapters.
- `drafts/podcast/`: podcast script, show notes, transcript.

## Next Deliverable

Complete the hardened controlled-run evidence package before drafting publishable conclusions:

> "Same workflow, isolated harnesses, auditable evidence."

The source-grounded framing can be drafted in parallel, but measured claims wait for the corrected runs.
