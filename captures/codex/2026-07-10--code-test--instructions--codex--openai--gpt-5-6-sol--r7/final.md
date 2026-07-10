Added one focused test in [validate.test.ts](/workspace/subject/packages/core/test/validate.test.ts) that verifies formatted output includes:

- Invalid summary
- `[bad-ref]`
- `body[0]:w.when` diagnostic path

Verification passed:

- `pnpm --filter @loopyc/core test -- validate.test.ts`
- `pnpm --filter @loopyc/core typecheck`
- `git diff --check`

Only the requested test file changed. No production code changed or pushed. Residual risks: none identified.
