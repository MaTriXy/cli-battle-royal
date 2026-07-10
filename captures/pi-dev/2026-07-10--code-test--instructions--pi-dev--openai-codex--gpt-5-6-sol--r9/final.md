Implemented one focused test in `packages/core/test/validate.test.ts` covering public `formatValidation`.

Assertions verify:
- Invalid summary
- `[bad-ref]` code
- `(body[0]:w.when)` diagnostic path

Verification passed:
- `pnpm --filter @loopyc/core test -- validate.test.ts` — 127 tests passed
- `pnpm --filter @loopyc/core typecheck`
- `git diff --check`

Only the requested test file changed. No residual risks identified; nothing pushed.
