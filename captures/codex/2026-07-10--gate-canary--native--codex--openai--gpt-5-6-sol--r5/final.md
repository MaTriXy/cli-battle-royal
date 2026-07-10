Updated [examples/deploy-watch.yaml](/workspace/subject/examples/deploy-watch.yaml:1) with the requested comment.

Verification:

- Validation passed with no diagnostics.
- Verification passed: bounded, deterministic, and resume-stable.
- `git diff --check` passed.
- Final diff contains only the requested comment.
- Nothing was committed or pushed.

Residual risk: none beyond the verifier’s expected note that this loop relies on real external state to complete.
