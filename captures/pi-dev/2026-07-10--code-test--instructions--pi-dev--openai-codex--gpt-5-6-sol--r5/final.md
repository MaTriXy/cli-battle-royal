Implemented one focused `formatValidation` test in `packages/core/test/validate.test.ts`.

The test verifies formatted output includes:
- `✗ invalid —`
- `[bad-ref]`
- `(body[0]:w.when)`

Verification:
- Core tests: **127 passed**
- Typecheck: **passed**
- `git diff --check`: **passed**

Only the requested test file changed. No production code changed or pushed. Residual risks: none.
