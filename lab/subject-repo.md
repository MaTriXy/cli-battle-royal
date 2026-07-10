# Subject Repo: Monkey.D.Loopy

## Identity

- Owner/repo: `MaTriXy/Monkey.D.Loopy`
- URL: <https://github.com/MaTriXy/Monkey.D.Loopy>
- Visibility: public
- Default branch: `main`
- Primary language: TypeScript
- License: MIT
- GitHub description: Factory for runnable, crash-resumable agent loops.

## Baseline

First comparison baseline:

- Branch: `main`
- Commit: `32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e`
- Observed pushed at: `2026-07-08T08:58:47Z`
- Observed updated at: `2026-07-08T08:58:50Z`

Use this commit for the first controlled comparison unless we intentionally refresh the baseline.

## Local Context

For the harness comparison, use a clean clone of the GitHub `main` branch in
this repository's ignored `testbeds/` directory. Do not reuse an unrelated
feature-branch checkout as the baseline.

## Repo Shape

Key files observed at baseline:

- `README.md`
- `SPEC.md`
- `package.json`
- `pnpm-workspace.yaml`
- `docs/cli.md`
- `docs/loopspec.md`
- `docs/mcp.md`
- `docs/runtime.md`
- `examples/*.yaml`
- `packages/cli`
- `packages/core`
- `packages/runtime`
- `packages/verify`
- `packages/mcp`
- `packages/evals`
- `packages/infer`

Package scripts:

- `pnpm build`
- `pnpm typecheck`
- `pnpm test`
- `pnpm eval`
- `pnpm eval:skill`
- `pnpm loopc`

Runtime requirements:

- Node `>=22`
- pnpm `10.33.3`

## Why This Repo Works For The Test

Monkey.D.Loopy is a good harness-comparison target because it is itself about agent loops. It has:

- a real TypeScript monorepo
- docs and examples
- validation/evaluation concepts
- CLI and runtime packages
- enough domain complexity to require repo orientation
- clear verification commands
- public code, so captures can be discussed without private context

## Constraints

- Do not push benchmark-generated changes to the subject repository.
- Do not mutate the subject repository as part of the content workflow.
- Keep each harness run isolated.
- Record the exact baseline commit, commands, prompts, outputs, and final diff.
- If a harness produces useful changes, capture them as patches/evidence in this lab rather than pushing them upstream.
