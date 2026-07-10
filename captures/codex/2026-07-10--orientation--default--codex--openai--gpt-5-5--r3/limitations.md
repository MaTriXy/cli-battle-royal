# Limitations

- This is a single shakeout cell unless the status explicitly says measured; it does not establish a universal ranking.
- Provider-native event streams remain private, so the curated transcript intentionally omits non-visible reasoning and full command output.
- Codex project hooks are guardrails and do not intercept every possible shell or tool path.
- The common Docker boundary protects the host but is lab infrastructure, not a harness-native safety feature.
- Codex used a recorded ChatGPT-auth HTTP/SSE provider adapter because its WebSocket transport did not route through the lab proxy.
