Implemented one focused test in `packages/core/test/validate.test.ts`.

The test:
- Builds an invalid typed `LoopSpec`.
- Calls public `processRaw` and `formatValidation`.
- Verifies `✗ invalid`, `[bad-ref]`, and `(body[0]:w.when)` appear.

Verification passed:
- `pnpm --filter @loopyc/core test -- validate.test.ts` — 127 tests passed.
- `pnpm --filter @loopyc/core typecheck`
- `git diff --check`

Only the requested test file changed. No production changes, commits, or pushes. No residual risks identified.
