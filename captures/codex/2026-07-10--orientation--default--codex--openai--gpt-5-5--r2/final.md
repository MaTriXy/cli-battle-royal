**Repository State**
- Root: `/workspace/subject`
- Commit: `32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e`
- Commit summary: `Merge pull request #4 from MaTriXy/feature/docs-claude-native-spec`
- Branch state: detached `HEAD` at `32b2b3c`; commit is also on `main`, `origin/main`, and `origin/HEAD`
- Remotes: fetch from GitHub; push remote is disabled: `disabled://agentic-harness-lab/no-push`
- Dirty state: dirty only from untracked files, apparently AppleDouble `._*` metadata files. `git status --porcelain` reports `150` entries, all shown as `??`; I saw no tracked modifications.
- Git also emits errors about `.git/objects/pack/._pack-...idx is too small`, likely from the same `._*` metadata pattern inside `.git`.

**Package Manager / Runtime**
- Package manager: `pnpm@10.33.3`, from root `packageManager`
- Workspace: `pnpm-workspace.yaml` includes `packages/*`
- Required Node runtime: `>=22`; CI uses Node `22`
- Language/tooling: ESM TypeScript packages, `tsx` for source execution, `tsup` for builds, `vitest` for tests

**Main Package Boundaries**
- `@loopyc/core`: pure core LoopSpec IR, schema/normalization/validation, expression handling, planner/codegen targets
- `@loopyc/runtime`: durable execution engine, journal/replay/caps/effects/pricing/runtime helpers
- `@loopyc/verify`: dry-run verification, scorecard grading, spec interpreter; depends on `core` and `runtime`
- `@loopyc/infer`: deterministic extraction/scaffolding from JS/TS, shell, and journals into draft LoopSpecs; depends on `core`
- `@loopyc/cli`: `loopc` command-line surface; depends on `core`, `infer`, `runtime`, `verify`
- `@loopyc/mcp`: MCP server surface; depends on `core`, `infer`, `runtime`, `verify`
- `@loopyc/evals`: private eval harness and skill evals; depends on `core`, `runtime`, `verify`
- Top-level `docs/`, `examples/`, `README.md`, `SPEC.md` are documentation and examples, not separate packages.

**Smallest Relevant Verification**
- Documentation-only change: there is no configured markdown/docs lint script. Smallest useful check is:
  ```bash
  git diff --check -- README.md SPEC.md docs examples packages/*/README.md
  ```

- Core validation-test change, especially around `packages/core/test/validate.test.ts`:
  ```bash
  pnpm --filter @loopyc/core test -- test/validate.test.ts
  pnpm --filter @loopyc/core typecheck
  ```

Full CI, when needed, is `pnpm -r typecheck`, `pnpm -r test`, `pnpm eval`, and `pnpm build`.
