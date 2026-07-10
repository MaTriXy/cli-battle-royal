Implemented one focused test in `packages/core/test/validate.test.ts` covering:

- Invalid formatted summary
- `[bad-ref]` diagnostic code
- `(body[0]:guarded.when)` diagnostic path

Verification passed:

- `pnpm --filter @loopyc/core test -- validate.test.ts`
- `pnpm --filter @loopyc/core typecheck`
- `git diff --check`

Only the requested test file changed. No production changes, pushes, or residual risks.
