Implemented one focused `formatValidation` test in `packages/core/test/validate.test.ts`.

The test verifies:
- `✗ invalid` summary
- `[bad-ref]` diagnostic code
- `body[0]:w.when` diagnostic path

Verification:
- `pnpm --filter @loopyc/core test -- validate.test.ts` — passed, 127 tests
- `pnpm --filter @loopyc/core typecheck` — passed
- `git diff --check` — passed

Final diff reviewed; only the requested test file changed. No production changes or residual risks identified. Nothing pushed.
