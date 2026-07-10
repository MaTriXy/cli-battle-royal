# Benchmark Preflight: 2026-07-10

## Scope

Preflight for the Codex, Claude Code, and Pi same-model comparison against `MaTriXy/Monkey.D.Loopy`.

## Passed

- GitHub `main` resolved to the pinned baseline `32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e`.
- `prepare-run.sh` passed for all three harnesses in both `default` and `instructions` lanes.
- Every prepared testbed was detached, clean, push-disabled, and protected by the blocking pre-push hook.
- Host preparation resolved pnpm `10.33.3`; contained shakeouts recorded Node `v24.4.1` and pnpm `10.33.3`.
- The Docker boundary canary passed after the pinned images were loaded.
- Six repeat-6 instruction-lane shakeouts resolved `gpt-5.6-sol` at `high` effort, passed the independent task verifier, and passed the automated redaction scan.
- The Claude Code adapter unit suite passed four tests in the pinned container.
- Native setup preparation passed for Codex, Claude Code, and Pi.
- Codex `0.144.1` offline hook discovery found the native project `PreToolUse` declaration under disposable project trust.
- The final `gate-canary-v3` runs recorded real deny-then-allow events for Codex r6, Claude Code r3, and Pi r4.
- The measured matrix completed 18 runs: three harnesses, two tasks, and three repeats per cell.
- All 18 measured runs exited zero, passed the independent task verifier, and passed automated redaction scanning.
- All 18 blind output packets and curated transcripts received manual review.

## Open

- Configure a dedicated Claude container token before the separate native Sonnet/Opus matrix.
- Obtain editorial approval before changing any capture to `publishable: true` or publishing derived content.

## Invalid Attempts Retained

- Early Codex native canaries did not load the project hook; they led to the corrected `.codex/config.toml` registration and disposable trust setup.
- Later Codex and Pi canary attempts reached the OpenAI usage limit before agent work. Provider quota failures are now classified as `invalid` even when a CLI exits zero.
