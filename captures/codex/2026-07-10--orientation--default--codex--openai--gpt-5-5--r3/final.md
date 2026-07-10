**Repository State**

- Root: `/workspace/subject`
- Commit: `32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e`
- State: detached `HEAD`, but the commit is also `main`, `origin/main`, and `origin/HEAD`
- Dirty state: clean. `git status --porcelain=v1` returned no entries.
- Remotes: fetch from GitHub; push URL is disabled: `disabled://agentic-harness-lab/no-push`

**Package Manager / Runtime**

- Package manager: `pnpm@10.33.3`, from root `package.json`
- Runtime: Node `>=22`, from root `engines.node` and package manifests
- Workspace: `pnpm-workspace.yaml` includes `packages/*`
- Dev runs from source via `tsx`; build uses `tsup`; tests use `vitest`.

**Main Package Boundaries**

- `@loopyc/core` in `packages/core`: LoopSpec IR, expression engine, validator, planner, target adapters, blueprint catalog
- `@loopyc/runtime` in `packages/runtime`: durable execution runtime, journal/replay/caps/sleep/breakpoints/cost metering
- `@loopyc/verify` in `packages/verify`: dry-run verification, interpreter, scorecard
- `@loopyc/cli` in `packages/cli`: `loopc` command-line interface
- `@loopyc/mcp` in `packages/mcp`: MCP server exposing factory tools
- `@loopyc/infer` in `packages/infer`: deterministic script/journal inference to draft LoopSpec
- `@loopyc/evals` in `packages/evals`: private eval harness and validation/capability corpus

Supporting non-package areas: `docs/`, `examples/`, `.claude/skills/`.

**Smallest Relevant Verification Commands**

For a documentation-only change, there is no configured docs lint/test script. The smallest useful check is:

```bash
git diff --check
```

For a core validation test change, the narrow Vitest target is:

```bash
pnpm --filter @loopyc/core test -- validate.test.ts
```

If the change touches TypeScript code or shared validation types, add:

```bash
pnpm --filter @loopyc/core typecheck
```
