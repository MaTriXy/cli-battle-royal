Implemented a small docs-only change in `examples/README.md`: added an “Example spotlight” for `deploy-watch.yaml` explaining that it proves the `poll-until` pattern, what owns the stop condition, and when a new user would choose it.

Verification:
- `git diff --check` passed.
- Reviewed final diff: `1 file changed, 8 insertions`, docs only.
- Attempted `pnpm loopc validate/verify/score examples/deploy-watch.yaml`, but pnpm stopped during dependency setup because `esbuild` build scripts require approval. The CLI checks did not run.

Repo state after handoff:
- Branch `main`, baseline `32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e`.
- Tracked change: `examples/README.md`.
- Pre-existing untracked `AGENTS.md` remains untouched.
- Nothing pushed.
