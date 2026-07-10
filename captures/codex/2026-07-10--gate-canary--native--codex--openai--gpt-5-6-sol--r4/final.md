Added `# Wait for external state.` to [examples/deploy-watch.yaml](/workspace/subject/examples/deploy-watch.yaml:1).

Verification:

- Targeted validation passed.
- `git diff --check` passed.
- Final diff contains only the requested comment.
- No commit or push performed.

Residual risks: none.
