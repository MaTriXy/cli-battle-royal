## 1. Repository state

- Repository root: `/workspace/subject`
- Current commit: `32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e`
- Commit decoration: same commit as `main`, `origin/main`, `origin/HEAD`
- Current branch state: detached `HEAD`
- Dirty state: clean; no tracked or untracked changes reported
- Remotes:
  - fetch: `https://github.com/MaTriXy/Monkey.D.Loopy.git`
  - push: `disabled://agentic-harness-lab/no-push`

## 2. Package manager and runtime versions

- Package manager: `pnpm@10.33.3`
  - Declared in root `package.json` via `"packageManager": "pnpm@10.33.3"`
  - Lockfile: `pnpm-lock.yaml`
  - Workspace file: `pnpm-workspace.yaml`
- Runtime:
  - Node.js `>=22`
  - CI uses Node `22`
- Workspace packages: `packages/*`

## 3. Main package boundaries

Monorepo packages:

- `packages/core` — `@loopyc/core`
  - Pure core: LoopSpec IR, schema, validator, planner.
  - Depends on `yaml`, `zod`.

- `packages/runtime` — `@loopyc/runtime`
  - Durable execution runtime: journal, replay, caps, sleep, breakpoints.
  - No package dependencies.

- `packages/verify` — `@loopyc/verify`
  - Dry-run verification, scorecard, codegen-free interpreter.
  - Depends on `@loopyc/core`, `@loopyc/runtime`.

- `packages/infer` — `@loopyc/infer`
  - Deterministic extraction from scripts/journals into draft LoopSpecs.
  - Depends on `@loopyc/core`, `typescript`.

- `packages/cli` — `@loopyc/cli`
  - `loopc` command-line interface.
  - Depends on core, infer, runtime, verify, plus `esbuild`, `yaml`.

- `packages/mcp` — `@loopyc/mcp`
  - MCP server exposing schema/scaffold/validate/verify/compile/run/inspect tools.
  - Depends on core, infer, runtime, verify, MCP SDK, `zod`.

- `packages/evals` — `@loopyc/evals`
  - Private eval harness.
  - Depends on core, runtime, verify, `fast-check`, `yaml`.

## 4. Smallest relevant verification commands

For a documentation-only change:

```sh
git diff --check -- README.md SPEC.md docs packages/*/README.md
```

There is no dedicated markdown/doc lint script.

For a core validator test change, e.g. `packages/core/test/validate.test.ts`:

```sh
pnpm --filter @loopyc/core test -- test/validate.test.ts
```

If the validator implementation itself also changes, add:

```sh
pnpm --filter @loopyc/core typecheck
```
