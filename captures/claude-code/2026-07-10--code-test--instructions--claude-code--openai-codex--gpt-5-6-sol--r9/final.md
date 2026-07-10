Implemented one focused test in `packages/core/test/validate.test.ts:62`.

It verifies `formatValidation(processRaw(...).validation!)` includes:

- `✗ invalid`
- `[bad-ref]`
- `body[0]:w.when`

Verification passed:

- `pnpm --filter @loopyc/core test -- validate.test.ts` — 127 tests passed
- `pnpm --filter @loopyc/core typecheck`
- `git diff --check`

Final diff reviewed; only the requested test file changed. No residual risks identified. Nothing committed or pushed.
