# Limitations

- This is a single shakeout cell unless the status explicitly says measured; it does not establish a universal ranking.
- Provider-native event streams remain private, so the curated transcript intentionally omits non-visible reasoning and full command output.
- Claude Code used a lab-owned Anthropic Messages adapter backed by Pi AI's raw OpenAI Codex provider; the Pi agent loop was not loaded.
- Anthropic does not support non-Claude models behind third-party gateways; this is experimental comparison infrastructure, not a supported production configuration.
- The common Docker boundary protects the host but is lab infrastructure, not a harness-native safety feature.
