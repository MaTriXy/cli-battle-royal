Updated only the leading comment block in `examples/deploy-watch.yaml`.

Verification passed:
- `pnpm --dir packages/cli loopc validate ../../examples/deploy-watch.yaml`
- `git diff --check`

Final diff reviewed; YAML data and runtime behavior are unchanged. No other tracked files changed, and nothing was pushed. Residual risks: none identified.
