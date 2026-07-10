# Task 02: Fixed Documentation Change

ID: `fixed-doc-v2`

Lane: `instructions`

Allowed tracked file: `examples/deploy-watch.yaml`

## Exact Prompt

```text
Update only the leading comment block in examples/deploy-watch.yaml.

The comment must help a new user understand:
- that this is the poll-until pattern;
- what external condition decides completion;
- when this pattern is appropriate;
- when a one-pass task would be more appropriate.

Do not change YAML data, runtime behavior, or any other tracked file.

Run exactly these verification commands before handoff:
- pnpm --dir packages/cli loopc validate ../../examples/deploy-watch.yaml
- git diff --check

Do not push anything.
```

## Required Verification

```bash
pnpm --dir packages/cli loopc validate ../../examples/deploy-watch.yaml
git diff --check
```

The lab also parses baseline and modified YAML and requires semantic equality.

## Deterministic Checks

- only `examples/deploy-watch.yaml` changed
- diff contains comments only
- parsed YAML is semantically equal to baseline
- required commands pass
