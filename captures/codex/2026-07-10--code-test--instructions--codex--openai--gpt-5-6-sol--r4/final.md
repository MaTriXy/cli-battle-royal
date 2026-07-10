Added one focused test in [validate.test.ts](/workspace/subject/packages/core/test/validate.test.ts:62) covering public `formatValidation` output for an undeclared state reference in a step condition.

Verification passed:

- `pnpm --filter @loopyc/core test -- validate.test.ts` — 127 tests passed
- `pnpm --filter @loopyc/core typecheck`
- `git diff --check`

Only the requested test file changed. No production code changed and nothing was pushed.
