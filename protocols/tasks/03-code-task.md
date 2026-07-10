# Task 03: Validation Formatting Test

ID: `code-test-v2`

Lane: `instructions`

Allowed tracked file: `packages/core/test/validate.test.ts`

## Exact Prompt

```text
Add one focused test in packages/core/test/validate.test.ts for the public formatValidation function.

The test must build an invalid LoopSpec with an undeclared state reference in a step when condition, call processRaw, format the returned validation result, and prove that the formatted output includes:
- the invalid summary;
- the [bad-ref] diagnostic code;
- the diagnostic path for the offending step condition.

Keep this test-only. Do not change production code or any other tracked file.

Run exactly these verification commands before handoff:
- pnpm --filter @loopyc/core test -- validate.test.ts
- pnpm --filter @loopyc/core typecheck
- git diff --check

Do not push anything.
```

## Required Verification

```bash
pnpm --filter @loopyc/core test -- validate.test.ts
pnpm --filter @loopyc/core typecheck
git diff --check
```

## Deterministic Checks

- only `packages/core/test/validate.test.ts` changed
- exactly one focused test added
- production source unchanged
- required checks pass
