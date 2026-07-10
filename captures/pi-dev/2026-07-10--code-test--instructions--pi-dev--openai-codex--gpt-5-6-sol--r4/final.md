Implemented one focused test in `packages/core/test/validate.test.ts` covering public `formatValidation`.

It verifies formatted output contains:
- `✗ invalid`
- `[bad-ref]`
- `(body[0]:w.when)`

Verification passed:
- `pnpm --filter @loopyc/core test -- validate.test.ts` — 127 tests passed
- `pnpm --filter @loopyc/core typecheck`
- `git diff --check`

Only the requested test file changed. No production changes, commits, or pushes. No residual risks identified.
