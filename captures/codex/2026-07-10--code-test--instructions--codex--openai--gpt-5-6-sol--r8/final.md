Added one focused test in [validate.test.ts](/workspace/subject/packages/core/test/validate.test.ts:62). It verifies `formatValidation(processRaw(...).validation!)` includes:

- Invalid summary
- `[bad-ref]`
- `body[0]:w.when` diagnostic path

Verification passed:

- Core tests: 127 passed
- Typecheck: passed
- `git diff --check`: passed

Only the requested test file changed. Nothing was pushed.
