Added one focused test in [validate.test.ts](/workspace/subject/packages/core/test/validate.test.ts:62) covering `processRaw` → public `formatValidation`, asserting:

- Invalid summary
- `[bad-ref]`
- `(body[0]:w.when)` diagnostic path

Verification passed:

- Core tests: 127 passed
- Core typecheck
- `git diff --check`

Only the requested test file changed. No production code changed, no residual risks identified, and nothing was pushed.
