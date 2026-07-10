Updated only the leading comment block in `examples/deploy-watch.yaml`.

Verification passed:
- `pnpm --dir packages/cli loopc validate ../../examples/deploy-watch.yaml`
- `git diff --check`

Final diff review confirms no YAML data or runtime behavior changed. Nothing was pushed.
