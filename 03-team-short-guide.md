# Short Guide: Pi vs Codex vs Claude Code

This guide answers the team's questions:

- Is Pi worth comparing with Codex and Claude Code?
- How much configuration does Pi require?
- How minimal is Pi out of the box?

## Short Answer

Yes, the comparison is useful, but Pi is not empty or unusable until customized.

- Codex and Claude Code are broad coding-agent products with substantial workflow surfaces.
- Pi is a smaller terminal harness that is already useful after authentication and is intentionally easy to rewire.

By default, Pi gives the model four core tools: `read`, `write`, `edit`, and `bash`. It also loads project `AGENTS.md` or `CLAUDE.md` files. Skills, settings, and extensions are optional escalation points rather than prerequisites for basic project instructions.

## One-Sentence Comparison

| Tool | Practical description |
| --- | --- |
| Codex | OpenAI coding-agent workflow with project instructions, configuration, sandboxing, hooks, skills, and subagents. |
| Claude Code | Coding agent with project memory, settings, permissions, hooks, MCP, skills, and subagents. |
| Pi | Minimal terminal coding harness with four core tools, context files, many providers, and deep TypeScript extensibility. |

## How Minimal Is Pi?

Pi keeps the product core smaller than Codex or Claude Code, but "minimal" should not be confused with "blank."

Useful by default after authentication:

- repository file reading and editing
- shell command execution
- automatic session persistence
- model/provider selection
- `AGENTS.md` and `CLAUDE.md` project instructions
- project trust before loading project-local settings, skills, packages, or extensions

Not built into the core as a product layer:

- MCP
- subagents
- plan mode
- permission popups
- a built-in sandbox
- opinionated review or multi-agent workflows

Those capabilities can be added through extensions, packages, skills, or external isolation when the use case needs them.

## Setup Levels

### Level 0: Authenticated default

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
pi
```

Run `/login`, choose a subscription provider such as ChatGPT Plus/Pro (Codex) or Claude Pro/Max, then start working. API-key providers are a separate path.

### Level 1: Persistent project workflow

Add `AGENTS.md`:

```md
# Project workflow

Before editing:
1. Confirm the repository root and dirty state.
2. Identify the relevant verification commands.
3. State the goal, non-goals, acceptance criteria, and verification plan.

Before handoff:
1. Run relevant verification.
2. Review the final diff.
3. Report changed files and residual risk.
```

This is enough to compare instruction-driven behavior with Codex. No `.pi/settings.json` is required for this level.

### Level 2: Reusable capability

Add a skill under `.pi/skills/<name>/SKILL.md` when the workflow should load on demand, include supporting references/scripts, or be packaged for reuse.

### Level 3: Custom harness behavior

Add a TypeScript extension when instructions are insufficient and the workflow needs:

- custom tools or commands
- event interception
- context injection
- custom compaction
- workflow-specific UI
- external policy or orchestration integration

This is where Pi changes from "configure the agent" to "engineer the harness."

## Setup Comparison To Measure

| Use case | Pi | Codex | Claude Code |
| --- | --- | --- | --- |
| Basic coding session | Low after auth | Low after auth | Low after auth |
| Persistent project instructions | Low: `AGENTS.md` or `CLAUDE.md` | Low: `AGENTS.md` | Low: `CLAUDE.md` |
| Reusable workflow guidance | Skill or prompt template | Skill | Skill/plugin |
| Lifecycle enforcement | TypeScript extension | Hook/config/plugin | Hook/settings/plugin |
| Strong process isolation | External container/VM/sandbox | Built-in local sandbox posture | Permission/sandbox configuration, depending on environment |
| Custom harness runtime | Strong fit | Product/plugin shaped | Product/plugin and lifecycle shaped |

The controlled evaluation must replace these qualitative labels with recorded time, files, commands, and decisions.

## Authentication Nuance

Pi distinguishes subscription providers from API-key providers:

- ChatGPT Plus/Pro subscription access uses Pi's OpenAI Codex OAuth provider.
- `openai` is the API-key provider and expects `OPENAI_API_KEY` or stored API-key credentials.
- The supported public setup is Pi's own `/login` flow. Pi does not automatically treat `~/.codex/auth.json` as its auth store.

Our pilot initially selected `openai`, failed for lack of an API key, and then completed with the `openai-codex` provider. That is a useful setup finding, but the corrected repeatable guide should demonstrate `/login` rather than internal credential migration.

## Recommendation

Compare three distinct questions:

1. What does each authenticated harness provide before project configuration?
2. How much can a team standardize with one persistent instruction file?
3. What must be built when instruction-following is not strong enough?

That framing answers "how minimal is Pi?" without pre-deciding that minimal means weaker.
