# Measured-Run and Publication Gate

This gate separates a working lab from publishable comparison evidence. All
checks for a matrix must pass before its runs are labeled `measured`.

## Current disposition

- Pilot runs from 2026-07-09: exploratory only.
- Orientation shakeout from 2026-07-10: exploratory only.
- Same-model instruction lane: 18-run measured matrix complete and reviewed.
- Native lane: setup complete; the final v3 canary recorded a real deny-then-allow sequence for every harness.
- Common outer container: implemented; containment canary passed on 2026-07-10.
- Measured comparison: complete for two tasks, three harnesses, and three repeats per cell. See `lab/same-model-benchmark-2026-07-10.md`.
- Publication: the research repository branch may be pushed under explicit operator approval; social, article, video, and podcast publication remains a separate editorial decision.

## Required checks: OpenAI same-model matrix

- [x] Refresh or explicitly approve the subject baseline and record the commit.
- [x] Run `scripts/prepare-run.sh` for all three harnesses in the `default` lane.
- [x] Run `scripts/prepare-run.sh` for all three harnesses in the `instructions` lane.
- [x] Confirm each run starts detached, clean, and push-protected.
- [x] Confirm the pinned Node and pnpm toolchain before timing an agent.
- [x] Confirm Codex and Pi authentication works through isolated per-run auth volumes.
- [x] Build the pinned disposable agent image and allowlist proxy.
- [x] Prove host-home hiding, read-only rootfs, no Docker socket, workspace writes, direct-egress denial, and resource cleanup.
- [x] Confirm resolved provider/model capture for contained Codex and Pi GPT-5.5 historical shakeouts.
- [x] Confirm contained Codex and Pi resolve `gpt-5.6-sol` before measured runs (provider smoke, 2026-07-10).
- [x] Pass Claude-to-OpenAI adapter unit, HTTP/SSE, real OAuth, resolved-model,
  and multi-turn `Read` tool-loop checks (2026-07-10).
- [x] Confirm resolved provider/model capture for contained Claude Code.
- [x] Confirm the fixed-doc verifier passes independently of agent claims.
- [x] Implement and pass setup validation for the Codex, Claude Code, and Pi native gate mechanisms.
- [x] Run the gate canary and verify a real denial event for each native harness.
- [x] Run the redaction scan and manually review every curated measured capture.
- [x] Keep three independent measured repeats per comparison cell.

## Required checks: Anthropic matrix

- [ ] Add and verify a dedicated Claude container token for native Sonnet/Opus runs; macOS Keychain login is intentionally not mounted.
- [ ] Pin the exact resolved Sonnet model in Claude Code and Pi.
- [ ] Run Opus as a separate condition rather than a fallback.

## Model policy

- Codex, Pi, and Claude Code OpenAI comparison: request `gpt-5.6-sol` at
  `high` effort. Pi uses `openai-codex`; Claude Code uses the recorded
  Anthropic Messages adapter backed by Pi AI's raw provider transport.
- Claude Code comparison: Sonnet or Opus only; never Fable.
- Pi Anthropic comparison: use the same resolved Sonnet or Opus model when
  available, and record the billing/authentication caveat.

## Evidence rule

The completed same-model matrix may support task-bounded measured claims. It
does not support a universal harness ranking. The Anthropic checks block only
the separate native Sonnet/Opus matrix, not this OpenAI same-model comparison.
