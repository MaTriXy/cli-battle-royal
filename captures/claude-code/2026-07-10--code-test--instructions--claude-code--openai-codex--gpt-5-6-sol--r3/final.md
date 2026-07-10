Implemented one focused test in `packages/core/test/validate.test.ts` for public `formatValidation`.

The test verifies:
- `✗ invalid` summary
- `[bad-ref]` diagnostic code
- `body[0]:w.when` diagnostic path

Verification:
- `pnpm --filter @loopyc/core test -- validate.test.ts` — **127 tests passed**
- `pnpm --filter @loopyc/core typecheck` — **passed**
- `git diff --check` — **passed**

Final diff reviewed; only the requested test file changed. No production changes, commits, or pushes.
