Implemented one focused test in `packages/core/test/validate.test.ts` covering public `formatValidation` output for an undeclared step-condition state reference.

Verification passed:
- `pnpm --filter @loopyc/core test -- validate.test.ts` — 127 tests passed
- `pnpm --filter @loopyc/core typecheck`
- `git diff --check`

Final diff reviewed: only the requested test file changed. No production changes, residual risks, commits, or pushes.
