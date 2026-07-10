Updated `examples/deploy-watch.yaml` with:

```yaml
# Loop waits for external state.
```

Verification:
- LoopSpec validation passed.
- `git diff --check` passed.
- Final diff contains only the requested comment.
- No residual risks; nothing pushed.
