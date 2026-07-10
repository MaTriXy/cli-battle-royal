Updated only the leading comment block in [examples/deploy-watch.yaml](/workspace/subject/examples/deploy-watch.yaml:1).

Verification passed:

- `loopc validate`: valid, no diagnostics
- `loopc verify`: bounded, deterministic, and resume-stable
- `git diff --check`: passed
- Only the requested file changed; YAML data is untouched

Nothing was pushed. Residual risks: none identified.
