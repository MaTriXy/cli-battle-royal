**Repo State**
- Root: `$TESTBED`
- Commit: `32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e`
- Branch: detached HEAD, shown as `HEAD (no branch)`
- Dirty state: clean, no tracked/untracked changes shown by `git status --short`
- Remotes: `origin` fetches from GitHub; push URL is disabled: `disabled://agentic-harness-lab/no-push`

**Runtime / Package Manager**
- Package manager: `pnpm@10.33.3`, from [package.json]($TESTBED/package.json:10)
- Required Node: `>=22`, from root and most package `engines`
- Workspace: pnpm monorepo via [pnpm-workspace.yaml]($TESTBED/pnpm-workspace.yaml:1), packages are `packages/*`

**Package Boundaries**
- `@loopyc/core`: pure IR/schema/expression/validator/planner, zero-I/O core
- `@loopyc/runtime`: durable execution runtime, journals, replay, effects, caps
- `@loopyc/verify`: interpreter, dry-run verification, scorecard
- `@loopyc/cli`: `loopc` command-line I/O layer
- `@loopyc/mcp`: MCP server surface
- `@loopyc/infer`: deterministic script/journal-to-FactPack/spec scaffold extraction
- `@loopyc/evals`: private eval harness and skill eval tests
- `docs/`, `examples/`, root `README.md`/`SPEC.md`: documentation and examples

**Smallest Verification Commands**
- Documentation-only change:
  ```bash
  git diff --check -- README.md SPEC.md docs examples packages/*/README.md
  ```
  There is no docs lint/test script in the manifests, so this is the smallest relevant check I found.

- Core validation test change:
  ```bash
  pnpm --filter @loopyc/core test -- test/validate.test.ts
  ```
  If the validator implementation changed too, add:
  ```bash
  pnpm --filter @loopyc/core typecheck
  ```

I did not edit files, install dependencies, push, or mutate remotes.
