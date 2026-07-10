Added one focused test in [validate.test.ts](/workspace/subject/packages/core/test/validate.test.ts:62) covering public `formatValidation`.

It verifies:

- Invalid summary
- `[bad-ref]` diagnostic code
- Offending path `(body[0]:w.when)`

Verification passed:

- `pnpm --filter @loopyc/core test -- validate.test.ts`
- `pnpm --filter @loopyc/core typecheck`
- `git diff --check`

No production files changed and nothing was pushed.
