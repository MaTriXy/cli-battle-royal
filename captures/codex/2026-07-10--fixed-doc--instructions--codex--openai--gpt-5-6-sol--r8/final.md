Updated only the leading comment block in [examples/deploy-watch.yaml](/workspace/subject/examples/deploy-watch.yaml:1). YAML data and runtime behavior are unchanged.

Verification passed:

- `pnpm --dir packages/cli loopc validate ../../examples/deploy-watch.yaml`
- `git diff --check`

Final diff review found no scope issues or residual risks. Nothing was pushed.
