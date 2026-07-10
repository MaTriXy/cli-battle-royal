Added one focused test in [validate.test.ts](/workspace/subject/packages/core/test/validate.test.ts:62). It verifies formatted validation includes:

- `✗ invalid`
- `[bad-ref]`
- `body[0]:w.when`

Verification passed:

- `pnpm --filter @loopyc/core test -- validate.test.ts`
- `pnpm --filter @loopyc/core typecheck`
- `git diff --check`

Only the requested test file changed. No production changes, residual risks, commits, or pushes.
