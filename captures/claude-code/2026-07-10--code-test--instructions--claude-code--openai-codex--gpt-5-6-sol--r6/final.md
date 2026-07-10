Implemented one focused test in `packages/core/test/validate.test.ts:62`.

The test:
- Builds an invalid spec with an undeclared state reference in `when`.
- Calls `processRaw` and public `formatValidation`.
- Verifies `✗ invalid`, `[bad-ref]`, and canonical path `body[0]:w.when`.

Verification passed:
- `pnpm --filter @loopyc/core test -- validate.test.ts` — 127 tests passed
- `pnpm --filter @loopyc/core typecheck`
- `git diff --check`

Final review found no residual risks. Only the requested test file changed; nothing was pushed.
