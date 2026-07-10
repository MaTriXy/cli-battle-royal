Implemented one focused test in `packages/core/test/validate.test.ts` covering public `formatValidation`.

It verifies:
- Invalid summary
- `[bad-ref]` code
- `body[0]:work.when` diagnostic path

Verification passed:
- `pnpm --filter @loopyc/core test -- validate.test.ts`
- `pnpm --filter @loopyc/core typecheck`
- `git diff --check`

Only the requested test file changed. No production code changed or pushed.
