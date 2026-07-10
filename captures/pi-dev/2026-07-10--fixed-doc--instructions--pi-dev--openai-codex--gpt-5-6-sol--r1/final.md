Updated only the leading comment block in `examples/deploy-watch.yaml`. YAML data and behavior are unchanged.

Verification passed:
- `pnpm --dir packages/cli loopc validate ../../examples/deploy-watch.yaml`
- `git diff --check`

Final diff reviewed; no residual risks. Nothing was pushed.
