Updated only the leading comment block in [examples/deploy-watch.yaml](/workspace/subject/examples/deploy-watch.yaml:1). YAML data and runtime behavior are unchanged.

Verification:

- Exact non-comment content matches HEAD.
- `git diff --check` passed.
- Only the requested tracked file changed: four comment lines added.
- `loopc validate` and `loopc verify` were attempted but blocked by incompatible macOS dependencies and registry HTTP 403 errors. The subsequent frozen install left `node_modules` incomplete; no tracked dependency files changed.
- Nothing was committed or pushed.
