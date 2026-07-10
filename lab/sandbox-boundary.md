# Sandbox Boundary

## Decision

Measured runs use a disposable outer container boundary inspired by Boxdown's
Dev Container and portless-SSH architecture. Automated runs use Docker directly
to avoid adding editor, SSH, or global Dev Containers CLI behavior to the
measurement path.

Boxdown remains a useful model for interactive observation and later video
capture. SSH is transport into the container, not the security boundary.

## Run lifecycle

1. Prepare and verify a clean, push-protected subject clone on the host.
2. Copy the clone into a fresh Docker volume through a stopped seed container.
3. Copy only the required auth artifact into a separate disposable volume.
4. Start an allowlist proxy on an external bridge network.
5. Start the agent container on an internal-only network with the proxy as its
   only egress path.
6. Run one harness process as a non-root user.
   For the experimental Claude Code same-model lane, start a loopback-only
   Anthropic Messages adapter in the same container. It delegates model I/O to
   Pi AI's raw `openai-codex` provider but does not load the Pi agent loop.
7. Export the Git patch and `.harness-lab` evidence through a stopped export
   container.
8. Apply the patch to the disposable host testbed for lab-owned verification.
9. Destroy the agent container, proxy, networks, workspace volume, auth volume,
   and temporary home.

## Enforced outer controls

- no writable host bind mount in the agent container
- no host home, SSH agent, Docker socket, or global agent configuration
- read-only root filesystem
- disposable `tmpfs` home and `/tmp`
- non-root UID/GID
- all Linux capabilities dropped
- `no-new-privileges`
- Docker default seccomp profile
- CPU, memory, PID, and run timeout controls
- internal-only network plus provider-domain CONNECT proxy
- invalid Git push URL and blocking pre-push hook inside the copied repository

## What this does not prove

- The proxy does not inspect TLS payloads. An allowed provider domain remains a
  possible exfiltration destination.
- Codex ChatGPT-auth runs use an explicit HTTP-only provider definition because
  the current upstream WebSocket transport does not honor this proxy path. The
  provider retains ChatGPT auth and the Responses API; only the transport is
  changed from WebSocket-preferred to HTTPS/SSE, and the override is recorded in
  run metadata.
- Docker/OrbStack isolation is not a micro-VM security claim.
- The common boundary protects the host; it does not count as a harness-native
  safety feature.
- A writable testbed volume means the agent can destroy its own disposable
  checkout. The baseline host clone and upstream repository remain protected.

## Native safety comparison

The outer boundary remains identical for all harnesses. Native-safety canaries
must target a harmless ephemeral path inside the outer boundary so the result
can still distinguish Codex sandboxing, Claude Code permissions/sandboxing, and
Pi's lack of a built-in process sandbox.

## Authentication disposition

- Codex: isolated copy of `~/.codex/auth.json` is available.
- Pi: isolated copy of `~/.pi/agent/auth.json` is available; use provider
  `openai-codex` for the requested subscription-auth comparison.
- Claude Code: the macOS login currently has no portable
  `~/.claude/.credentials.json`. A dedicated `claude setup-token` must be placed
  in ignored lab storage before contained native Sonnet/Opus runs. The
  experimental GPT-5.6 Sol lane instead uses the isolated Pi OpenAI OAuth file
  behind the local protocol adapter.
