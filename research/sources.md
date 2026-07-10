# Source Register

Last live audit: 2026-07-09.

## Source Rules

- Product facts use current first-party documentation.
- Run observations use captured transcripts, commands, and diffs from this lab.
- Editorial interpretations are labeled as hypotheses until controlled runs support them.
- A page access date does not make subjective "best fit" language a verified fact.
- Model aliases are not treated as resolved model IDs without run evidence.

## Codex

- [Codex CLI](https://developers.openai.com/codex/cli)
  - Local coding CLI and installation path.
- [Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
  - Codex reads `AGENTS.md` before work and layers global, root, and nested guidance.
- [Advanced configuration](https://learn.chatgpt.com/docs/config-file/config-advanced)
  - User/project configuration, trusted project layers, hooks, profiles, providers, and instruction discovery.
- [Configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference)
  - Exact configuration keys and accepted values.
- [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
  - Current Codex releases enable subagent workflows; direct instructions or applicable project/skill guidance can request delegation.
- [Agent approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security)
  - Standard local posture combines an OS-enforced sandbox, approval policy, and network controls.

Notes for this series:

- The measured same-model comparison is intentionally pinned to `gpt-5.6-sol` in Codex and Pi. GPT-5.5 captures predate this decision and remain historical shakeouts only.
- Codex project hooks may live in `.codex/hooks.json` or the project config layer when the project is trusted.

## Claude Code

- [Claude Code overview](https://code.claude.com/docs/en/overview)
  - Product scope across code reading, edits, command execution, and integrations.
- [Claude Code quickstart](https://code.claude.com/docs/en/quickstart)
  - Native installer, first run, and default interaction flow.
- [Settings](https://code.claude.com/docs/en/settings)
  - User, project, and local settings hierarchy.
- [Memory](https://code.claude.com/docs/en/memory)
  - `CLAUDE.md`, rules, and auto-memory behavior.
- [Hooks](https://code.claude.com/docs/en/hooks)
  - Lifecycle events and command, HTTP, MCP-tool, prompt, and agent hook types.
- [Permissions](https://code.claude.com/docs/en/permissions)
  - Permission rules and modes, including the risk of bypass mode.
- [Subagents](https://code.claude.com/docs/en/sub-agents)
  - Built-in and custom subagents, model/tool/permission configuration, and delegation.

Notes for this series:

- Use Sonnet or Opus, never Fable.
- Capture the resolved model, such as `claude-sonnet-5`, rather than reporting only the `sonnet` alias.
- `--safe-mode` is useful for isolating user customization, but it also disables project customization; controlled instruction injection must therefore be documented explicitly when used.

## Pi

- [Pi documentation](https://pi.dev/docs/latest)
  - Product index and current installation path.
- [Quickstart](https://pi.dev/docs/latest/quickstart)
  - Four default tools, authentication, `AGENTS.md`/`CLAUDE.md` project instructions, and non-interactive mode.
- [Using Pi](https://pi.dev/docs/latest/usage)
  - Context files, project trust, sessions, resource-disabling flags, and CLI reference.
- [Security](https://pi.dev/docs/latest/security)
  - Project trust is an input-loading guard, not a sandbox; Pi runs with the permissions of its process.
- [Settings](https://pi.dev/docs/latest/settings)
  - User and project settings.
- [Skills](https://pi.dev/docs/latest/skills)
  - Agent Skills discovery, progressive loading, commands, and shared skill paths.
- [Extensions](https://pi.dev/docs/latest/extensions)
  - TypeScript tools, commands, event interception, UI, context, and compaction customization.
- [Providers](https://pi.dev/docs/latest/providers)
  - Subscription OAuth providers and API-key providers.
- [Pi GitHub repository](https://github.com/earendil-works/pi)
  - Source, package layout, release history, and examples.

Notes for this series:

- Pi is useful before project settings: it starts with `read`, `write`, `edit`, and `bash` and loads `AGENTS.md`/`CLAUDE.md`.
- `--approve` trusts project-local Pi resources for a run. It does not grant shell permissions or create a sandbox.
- `openai` is the API-key provider. The successful pilot used the OpenAI Codex subscription provider exposed by the installed Pi build as `openai-codex`.
- The public setup guide should use Pi's `/login` flow. It should not teach internal credential conversion from Codex CLI state.
- Pi's provider documentation warns that Claude Pro/Max use through a third-party harness can draw from billed extra usage rather than normal plan limits; record this before the Anthropic comparison.

## Subject Repository

- [MaTriXy/Monkey.D.Loopy](https://github.com/MaTriXy/Monkey.D.Loopy)
  - Public MIT-licensed TypeScript monorepo used for all controlled runs.
- Baseline and runtime details are pinned in `lab/subject-repo.md`.

## Containment

- [Boxdown](https://github.com/MaTriXy/boxdown/tree/main)
  - Reusable Dev Container lifecycle, generated out-of-repo state, coding-agent
    installation, and portless SSH through a host-side proxy command.
- [Boxdown Dev Container profile](https://github.com/MaTriXy/boxdown/blob/main/assets/devcontainer/devcontainer.json)
  - Development-oriented base profile reviewed before creating the separate lab
    boundary.
- [Docker Engine security](https://docs.docker.com/engine/security/)
  - Namespaces, cgroups, daemon attack surface, and capability guidance.
- [Docker bind mounts](https://docs.docker.com/engine/storage/bind-mounts/)
  - Writable bind mounts can change host files; the measured runner uses a copied
    workspace in a disposable volume instead.
- [Docker seccomp](https://docs.docker.com/engine/security/seccomp/)
  - The lab retains Docker's default seccomp profile.
- [Codex HTTP-only provider workaround](https://github.com/openai/codex/issues/13041)
  - The current ChatGPT WebSocket transport does not reliably follow standard
    proxy routing; an explicit provider with `supports_websockets = false`
    preserves ChatGPT auth while using HTTPS/SSE.
- [Claude Code sandboxing](https://code.claude.com/docs/en/sandboxing)
  - Native filesystem/network sandboxing and its relationship to Dev Containers.
- [Pi security](https://pi.dev/docs/latest/security)
  - Pi has no built-in sandbox and recommends an OS, container, VM, or remote
    isolation boundary for untrusted or unattended work.

## Evidence Ownership

- `research/sources.md`: documented product facts.
- `lab/`: baseline identity, pilot limitations, and cross-run synthesis.
- `captures/`: redacted, curated run evidence only.
- `runs/raw/`: ignored local raw transcripts and command output.
- `01-comparison-matrix.md`: factual comparison plus explicitly labeled hypotheses.
