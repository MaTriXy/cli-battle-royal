# Raw And Curated Evidence Policy

This repository may later become public. Raw local agent sessions are therefore private by default.

## Storage Boundary

- `runs/raw/`: raw stdout, stderr, event streams, provider/session files, and environment manifests; always ignored by Git
- `runs/local/`: temporary auth/config homes, dependency caches, and work files; always ignored by Git
- `captures/`: redacted, curated evidence intended to be reviewable and potentially publishable

## Never Publish

- API keys, OAuth access/refresh tokens, cookies, authorization headers, or auth files
- hidden chain-of-thought, encrypted reasoning payloads, thinking signatures, or internal model signatures
- absolute home paths, usernames embedded in machine paths, hostnames, or unrelated repository paths
- private plugin, skill, MCP, hook, or organization names unrelated to the comparison
- environment dumps or command output that may contain credentials
- full raw transcripts copied from Codex, Claude Code, or Pi session stores

## Curated Transcript Rules

Allowed:

- exact measured prompt
- visible assistant messages
- tool name and task-relevant redacted arguments
- concise command outcome and exit code
- task diff and deterministic verification

Required substitutions:

- user home -> `$HOME`
- lab root -> `$LAB_ROOT`
- testbed root -> `$TESTBED`
- temporary paths -> `$TMP`
- email addresses not required by the analysis -> `[redacted-email]`

Long command outputs should be summarized with the raw artifact hash retained privately.

## Redaction Checks

Before setting `publishable: true`:

1. scan for common secret patterns
2. scan for `/Users/`, `/home/`, and local hostname/path fragments
3. confirm no `thinking`, `thinkingSignature`, `encrypted_content`, token, cookie, or authorization fields remain
4. confirm every source excerpt is necessary and within copyright limits
5. review manually because regex checks are not sufficient

## Current Pilot

`pilot-01` captures remain `publishable: false`. The Codex event stream and recovered Claude/Pi local sessions are raw evidence. Only newly created transcript summaries may be considered curated.
