FROM node:24.4.1-bookworm-slim

ARG CODEX_VERSION=0.144.1
ARG CLAUDE_CODE_VERSION=2.1.206
ARG PI_VERSION=0.80.6
ARG PNPM_VERSION=10.33.3
ARG SUBJECT_REPOSITORY=https://github.com/MaTriXy/Monkey.D.Loopy.git
ARG SUBJECT_COMMIT=32b2b3c8d8b1b04de4e56a0a9c63efa43ed6b92e

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      bash \
      bubblewrap \
      ca-certificates \
      curl \
      git \
      jq \
      openssh-client \
      ripgrep \
      socat \
    && rm -rf /var/lib/apt/lists/*

RUN npm install --global --ignore-scripts \
      "@openai/codex@${CODEX_VERSION}" \
      "@earendil-works/pi-coding-agent@${PI_VERSION}" \
      "pnpm@${PNPM_VERSION}" \
    && npm install --global "@anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}" \
    && npm cache clean --force

RUN git clone --filter=blob:none --no-checkout "$SUBJECT_REPOSITORY" /tmp/subject \
    && git -C /tmp/subject checkout --detach "$SUBJECT_COMMIT" \
    && test "$(git -C /tmp/subject rev-parse HEAD)" = "$SUBJECT_COMMIT" \
    && pnpm --dir /tmp/subject fetch --frozen-lockfile --store-dir /opt/harness-pnpm-store \
    && printf '%s\n' "$SUBJECT_COMMIT" > /opt/harness-pnpm-store-subject-commit \
    && rm -rf /tmp/subject

COPY sandbox/entrypoint.sh /usr/local/bin/harness-lab-entrypoint
COPY sandbox/claude-openai-gateway/server.mjs sandbox/claude-openai-gateway/server.test.mjs /usr/local/lib/node_modules/@earendil-works/pi-coding-agent/claude-openai-gateway/
COPY sandbox/claude-openai-gateway/run.sh /usr/local/bin/run-claude-openai-gateway
RUN chmod 0555 /usr/local/bin/harness-lab-entrypoint \
    /usr/local/bin/run-claude-openai-gateway \
    /usr/local/lib/node_modules/@earendil-works/pi-coding-agent/claude-openai-gateway/server.mjs \
    && ln -s /usr/local/lib/node_modules/@earendil-works/pi-coding-agent/claude-openai-gateway/server.mjs /usr/local/bin/claude-openai-gateway \
    && mkdir -p /workspace/subject /run/lab-auth \
    && chown -R node:node /workspace

USER node
WORKDIR /workspace/subject
ENTRYPOINT ["/usr/local/bin/harness-lab-entrypoint"]
CMD ["bash"]
