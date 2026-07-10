Updated only the leading comment block in [examples/deploy-watch.yaml](/workspace/subject/examples/deploy-watch.yaml).

Verification passed:

- `pnpm --dir packages/cli loopc validate ../../examples/deploy-watch.yaml`
- `git diff --check`

No YAML data, runtime behavior, or other tracked files changed. Nothing was pushed. Residual risks: none identified.
