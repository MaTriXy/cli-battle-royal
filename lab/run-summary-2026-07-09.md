# Run Summary: 2026-07-09

## Scope

Subject repo:

- `MaTriXy/Monkey.D.Loopy`
- Baseline: `32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e`
- Task: improve documentation around one existing LoopSpec example so a new user can understand what the example proves and when they would use it.

No pushes were made.

## Harness Results

| Harness | Model request | Status | Change | Verification |
| --- | --- | --- | --- | --- |
| Codex | `gpt-5.5` | Completed | Added an `Example spotlight: deploy-watch` section to `examples/README.md` | `git diff --check` passed; `pnpm loopc` checks were attempted by Codex but blocked by pnpm build-script approval for `esbuild` |
| Claude Code | `sonnet`, fallback `opus` | Completed | Added a comment header to `examples/deploy-watch.yaml` | `git diff --check` passed; YAML parsed successfully with `id: deploy-watch`, `pattern: poll-until` |
| Pi.dev | `openai-codex/gpt-5.5` via `--provider openai-codex --model gpt-5.5` | Completed | Improved the comment header in `examples/test-green.yaml` | `git diff --check` passed; YAML parsed successfully with `id: test-green`, `pattern: react` |
| Pi.dev setup note | `openai/gpt-5.5` via `--provider openai --model gpt-5.5` | Blocked, then corrected | No repo change | `openai` is the API-key provider; the Codex subscription provider is `openai-codex` |

## Captures

- Codex: `captures/codex/2026-07-09-codex-gpt-5-5-doc-task/`
- Claude Code: `captures/claude-code/2026-07-09-claude-sonnet-opus-doc-task/`
- Pi.dev successful run: `captures/pi-dev/2026-07-09-pi-openai-codex-gpt-5-5-doc-task/`
- Pi.dev initial wrong-provider run: `captures/pi-dev/2026-07-09-pi-openai-gpt-5-5-doc-task/`

## Observations

### Codex

Codex selected the examples index as the documentation surface and kept the change outside the YAML spec. This made the change publishable as explanatory documentation without any risk of changing the example content.

Strengths observed:

- Followed the docs-only scope.
- Produced a concise maintainer handoff.
- Ran `git diff --check`.
- Explicitly reported the failed deeper verification and why it failed.

Notable issue:

- Verification tried to pass through `pnpm` and hit an environment approval gap for `esbuild` build scripts.

### Claude Code

Claude Code selected the YAML example itself and matched the existing pattern used by several other examples: a header comment explaining the pattern and use case.

Strengths observed:

- Found a repo-local documentation convention.
- Kept the change comment-only.
- Reported that it reverted an unrelated `pnpm-workspace.yaml` change caused by the failed install attempt.
- Used an alternate verification strategy by parsing YAML to prove the loaded spec was unchanged.

Notable issue:

- Also hit the same `pnpm install` / `esbuild` build-script approval gap.

### Pi.dev

Pi.dev completed after configuring the correct provider.

Important setup finding:

- Pi has two relevant OpenAI-ish provider paths:
  - `openai`: API-key provider, expects `OPENAI_API_KEY` or an `openai` entry in `~/.pi/agent/auth.json`.
  - `openai-codex`: ChatGPT Plus/Pro Codex subscription provider, uses OAuth and defaults to `gpt-5.5`.
- The first Pi attempt used `--provider openai --model gpt-5.5` and failed with `No API key found for openai`.
- The corrected run used `--provider openai-codex --model gpt-5.5`.

Pi selected `examples/test-green.yaml`, improving its comment header to explain when to use the `react` pattern and that the shell exit code is the oracle.

Strengths observed:

- Completed the docs-only task with the same requested GPT-5.5 family via Codex subscription auth.
- Kept the change comment-only.
- Ran `git diff --check`.
- Attempted `pnpm loopc validate examples/test-green.yaml` and reported the same `esbuild` build-script approval blocker.

Notable issue:

- Provider naming is easy to get wrong: Codex-style subscription auth is `openai-codex`, not `openai`.

## Current Testbed State

- `testbeds/codex-monkey-d-loopy`: modified `examples/README.md`; untracked `AGENTS.md`.
- `testbeds/claude-code-monkey-d-loopy`: modified `examples/deploy-watch.yaml`; untracked `CLAUDE.md`.
- `testbeds/pi-dev-monkey-d-loopy`: modified `examples/test-green.yaml`; untracked `.pi/` setup.

## Next Step

Run the second planned Pi comparison with Claude-family auth/model after deciding whether to use Sonnet or Opus:

```bash
cd testbeds/pi-dev-monkey-d-loopy
pi --provider anthropic --model sonnet --approve --print "<common prompt>"
```

Keep the GPT-5.5 Pi/Codex pair as historical same-model shakeout evidence only. The measured comparison was subsequently repinned to `gpt-5.6-sol`.
