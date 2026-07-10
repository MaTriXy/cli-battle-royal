# Contained Run Environment

This is a disposable, Boxdown-style outer boundary for measured harness runs.
It uses Docker directly so automation does not depend on an editor, SSH client,
or globally installed Dev Containers CLI.

## Boundary

- fresh workspace and auth volumes for every run
- no writable bind mount from the agent container to the host
- non-root process
- all Linux capabilities dropped
- `no-new-privileges` enabled
- read-only container root filesystem
- writable home and temporary directories provided by disposable `tmpfs`
- Docker's default seccomp profile
- CPU, memory, PID, and wall-clock limits
- no Docker socket, host SSH agent, host home, or global agent configuration
- internal-only agent network with an allowlisted HTTP CONNECT proxy
- Docker build context restricted to `sandbox/` by `.dockerignore`

The proxy permits provider and login domains only. It does not inspect encrypted
payloads and therefore cannot prevent exfiltration to an allowed provider host.

## Authentication

The runner copies only these files into a disposable auth volume when present:

- `~/.codex/auth.json`
- `~/.pi/agent/auth.json`
- `runs/local/auth/claude-credentials.json`
- `runs/local/auth/claude-oauth-token`

The host `~/.claude` directory is never mounted. On macOS, Claude subscription
credentials may live in Keychain rather than a portable file. In that case,
create a dedicated container token with `claude setup-token` and place only the
token in the ignored `runs/local/auth/claude-oauth-token` file.

The experimental Claude Code same-model lane does not use Claude subscription
authentication. A version-pinned Claude Code process talks to the loopback-only
Anthropic Messages adapter in `claude-openai-gateway/`; the adapter uses the
isolated Pi `openai-codex` OAuth credential and Pi AI provider transport. The Pi
agent loop is not loaded. Gateway request traces contain metrics and model IDs,
not prompts, tool results, or credentials.

## Commands

```bash
scripts/sandbox-lab.sh build
scripts/sandbox-lab.sh canary
scripts/sandbox-lab.sh shell
scripts/run-same-model-shakeout.sh
```

`canary` proves the container cannot see a host-only sentinel, cannot write its
read-only root filesystem, has no Docker socket, cannot reach the public
internet directly, can reach an allowed provider through the proxy, and cannot
reach a non-allowlisted destination through the proxy.
