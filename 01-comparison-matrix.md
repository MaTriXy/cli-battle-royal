# Comparison Matrix

Last source audit: 2026-07-09. Source links and verification notes live in `research/sources.md`.

This file separates documented product behavior from hypotheses that still require controlled runs.

## Documented Control Surfaces

| Axis | Codex | Claude Code | Pi |
| --- | --- | --- | --- |
| Primary CLI | `codex` | `claude` | `pi` |
| Project instructions | `AGENTS.md`, including nested overrides | `CLAUDE.md`, `.claude/rules/`, and settings hierarchy | `AGENTS.md` or `CLAUDE.md` from parent/current directories |
| User config | `~/.codex/config.toml` | `~/.claude/settings.json` | `~/.pi/agent/settings.json` |
| Project config | `.codex/config.toml` in trusted projects | `.claude/settings.json`, `.claude/settings.local.json` | `.pi/settings.json` after project trust |
| Default local tools | Codex-managed coding tools and shell under its sandbox/approval posture | Built-in read, edit, shell, search, and agent tools under Claude permissions | `read`, `write`, `edit`, and `bash`; optional read-only tools can be enabled |
| Skills | Agent Skills with `SKILL.md` | Skills and plugin-packaged workflows | Agent Skills from Pi, `.agents`, packages, settings, or CLI paths |
| Lifecycle policy | Hooks in user/project Codex configuration | First-class lifecycle hooks | TypeScript extension events |
| Delegation | Built-in subagent workflows; direct or instruction-triggered delegation | Built-in and custom subagents | No built-in subagent product layer; add orchestration through extensions/packages |
| MCP | Supported | Supported | Not built into the minimal core; add through an extension/package if desired |
| Default safety boundary | OS-enforced sandbox, approvals, and network restrictions in standard local posture | Permission rules/modes, hooks, and managed policy | Project trust controls resource loading; Pi itself has no built-in sandbox |
| Primary customization unit | Instructions, config, hooks, skills, plugins, MCP, agents | Instructions, settings, hooks, skills, plugins, MCP, subagents | Context files, settings, skills, prompt templates, extensions, packages, SDK/RPC |

## Persistent Instructions: Correct Baseline

Persistent project guidance is a low-setup capability in all three harnesses:

| Harness | Minimum project artifact |
| --- | --- |
| Codex | `AGENTS.md` |
| Claude Code | `CLAUDE.md` |
| Pi | `AGENTS.md` or `CLAUDE.md` |

Pi does not require `.pi/settings.json` or a skill merely to load repository instructions. Those become relevant when the workflow needs reusable on-demand guidance or executable harness customization.

## Three Setup Levels

| Level | Codex | Claude Code | Pi |
| --- | --- | --- | --- |
| Authenticated default | Product defaults | Product defaults | Four core tools and default system behavior |
| Persistent project workflow | `AGENTS.md` | `CLAUDE.md` | `AGENTS.md` or `CLAUDE.md` |
| Mechanical/native customization | Hooks, skills, plugins, agents, config | Hooks, skills, plugins, subagents, settings | Skills, TypeScript extensions, packages, custom providers, SDK/RPC |

## Hypotheses To Test

These are editorial hypotheses, not verified conclusions:

- Codex may require the least custom code when teams want a governed OpenAI workflow across local and hosted surfaces.
- Claude Code may offer the most direct lifecycle-policy surface through hooks and subagents.
- Pi may offer the shortest path from a minimal core to deeply custom harness behavior through TypeScript extensions.
- Pi's lack of a built-in sandbox may increase operator-owned setup for unattended or untrusted work.
- A shared instruction file may produce similar behavior across harnesses, while native enforcement mechanisms may create the meaningful differences.

The controlled runs must be allowed to disprove these hypotheses.

## Comparison Rules

- Compare outputs directly only when the baseline, exact task, target file, model condition, and permission envelope match.
- Treat harness-native model runs and same-model runs as separate evidence.
- Measure setup effort using time, commands, files, and operator decisions rather than adjectives alone.
- Score deterministic gate compliance separately from subjective output quality.
- Record environment failures as lab failures unless evidence shows a harness-specific cause.

## Publishable Decision Frame

Do not write "X wins" before measured evidence exists. The eventual decision guide should answer:

- Which harness is useful with the least project setup?
- Which makes team policy easiest to express?
- Which can enforce policy mechanically?
- Which asks the operator to provide sandboxing or orchestration?
- Which customization surface fits the team's engineering appetite?
