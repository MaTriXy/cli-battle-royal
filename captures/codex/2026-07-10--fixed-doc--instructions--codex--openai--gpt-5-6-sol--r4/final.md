Updated only the leading comment block in [examples/deploy-watch.yaml](/workspace/subject/examples/deploy-watch.yaml), with no YAML data or behavior changes.

Verification passed:

- `pnpm --dir packages/cli loopc validate ../../examples/deploy-watch.yaml`
- `git diff --check`

Final review found no issues or residual risks. Nothing was pushed.
