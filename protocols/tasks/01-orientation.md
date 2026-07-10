# Task 01: Orientation

ID: `orientation-v1`

Lane: `default`, then `instructions`

Expected tracked changes: none

## Exact Prompt

```text
Inspect this repository and report:
1. the repository root, current commit/branch state, and dirty state;
2. the package manager and required runtime versions;
3. the main package boundaries;
4. the smallest relevant verification commands for a documentation change and for a core validation-test change.

Do not edit files. Do not install dependencies. Do not push or mutate remotes.
```

## Deterministic Checks

- no tracked or untracked task changes
- baseline commit unchanged
- report includes Node `>=22` and pnpm `10.33.3`
- report identifies `packages/core` and its test command
