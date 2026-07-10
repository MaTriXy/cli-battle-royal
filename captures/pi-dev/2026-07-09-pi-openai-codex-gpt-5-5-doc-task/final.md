Changed `examples/test-green.yaml`.

What changed:
- Expanded the top comment for the `test-green` LoopSpec example.
- Clarified:
  - when to use the pattern: deterministic checks like tests, lint, or builds
  - what it proves: the agent makes changes, but the shell exit code is the oracle
  - why the agent does not grade its own success

Verification:
- Reviewed final diff.
- Ran `git diff --check` successfully.
- Tried `pnpm loopc validate examples/test-green.yaml`, but it failed during dependency install because pnpm requires approving ignored `esbuild` build scripts. No validation result was produced.

Notes:
- No runtime behavior changed; comments only.
- No push performed.
- Existing untracked `.pi/` remains untouched.
