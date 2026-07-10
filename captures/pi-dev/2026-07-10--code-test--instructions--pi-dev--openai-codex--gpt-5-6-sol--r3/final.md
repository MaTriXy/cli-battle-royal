Implemented one focused test in `packages/core/test/validate.test.ts` covering public `formatValidation`.

It verifies formatted output includes:
- `✗ invalid`
- `[bad-ref]`
- `body[0]:w.when`

Verification passed:
- `pnpm --filter @loopyc/core test -- validate.test.ts`
- `pnpm --filter @loopyc/core typecheck`
- `git diff --check`

Final review found no issues. Only the requested test file changed; no residual risks identified.
