Updated only the leading comment block in `examples/deploy-watch.yaml`.

Verification:
- `pnpm --dir packages/cli loopc validate ../../examples/deploy-watch.yaml` — passed
- `git diff --check` — passed

Final review confirms no YAML data or runtime behavior changed. No residual risks identified. Nothing was pushed.
