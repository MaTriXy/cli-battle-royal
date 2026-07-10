Updated only the leading comment block in `examples/deploy-watch.yaml`.

Verification passed:
- `pnpm --dir packages/cli loopc validate ../../examples/deploy-watch.yaml`
- `git diff --check`

Diff review confirms no YAML data or runtime behavior changed. No residual risks; nothing was pushed.
