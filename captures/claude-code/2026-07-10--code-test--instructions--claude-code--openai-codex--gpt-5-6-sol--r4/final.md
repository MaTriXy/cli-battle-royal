Implemented one focused test in `packages/core/test/validate.test.ts:69` covering `formatValidation` with an undeclared state reference.

Assertions verify:
- `✗ invalid`
- `[bad-ref]`
- `body[0]:w.when`

Verification passed:
- `pnpm --filter @loopyc/core test -- validate.test.ts` — 127 tests passed
- `pnpm --filter @loopyc/core typecheck`
- `git diff --check`

Only the requested test file changed. No production code modified or pushed. No residual risks identified.
