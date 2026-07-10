# Agentic Harness Comparison Workflow

This repository is a controlled comparison target for Codex, Claude Code, and Pi.

## Required Flow

Before editing files:

1. Confirm the repository root, HEAD commit, baseline cleanliness, package manager, runtime requirements, and likely verification commands.
2. Read only the files needed for the task.
3. Publish a short spec containing the goal, non-goals, acceptance criteria, and verification plan.
4. Ask only blocking questions.

During implementation:

1. Make the smallest coherent change.
2. Preserve existing style and project conventions.
3. Do not push, publish, commit, or mutate remotes.

Before handoff:

1. Run the required verification or state exactly why it could not run.
2. Review the final diff as a reviewer.
3. Report changed files, verification results, and residual risks.

## Task Boundary

Optimize for repeatability, traceability, and a clean handoff. Do not expand the requested scope.
