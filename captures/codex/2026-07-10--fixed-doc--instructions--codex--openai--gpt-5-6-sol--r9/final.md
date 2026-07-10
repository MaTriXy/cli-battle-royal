Updated only the leading comment block in [examples/deploy-watch.yaml](/workspace/subject/examples/deploy-watch.yaml). YAML data and runtime behavior are unchanged.

Verification passed:

- `pnpm --dir packages/cli loopc validate ../../examples/deploy-watch.yaml`
- `git diff --check`

Final diff review found no unintended changes or residual risks. Nothing was pushed.
