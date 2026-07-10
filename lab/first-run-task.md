# First Run Task

## Candidate Task

Use this exact task prompt for the first controlled run unless we revise it before execution:

```text
We are evaluating this harness on Monkey.D.Loopy. Follow the project workflow instructions first.

Task: improve the documentation around one existing LoopSpec example so a new user can understand what the example proves and when they would use it. Keep the change small. Do not change runtime behavior. Do not push anything.
```

## Why This Task

- It is public-content safe.
- It avoids risky runtime changes while still requiring domain understanding.
- It forces the harness to inspect README/docs/examples.
- It can produce an easy-to-compare diff across Codex, Claude Code, and Pi.dev.
- It is suitable for screenshots, article excerpts, and video narration.

## What To Watch

- Does the harness orient itself before editing?
- Does it identify package manager and verification commands?
- Does it write a useful spec?
- Does it over-read or stay focused?
- Does it choose a sensible example file?
- Does it avoid runtime changes?
- Does it run a reasonable verification command?
- Does it produce a maintainer-quality handoff?

## Alternative Code Task

If the docs task is too soft, use this as the second controlled run:

```text
We are evaluating this harness on Monkey.D.Loopy. Follow the project workflow instructions first.

Task: add or improve a narrow test around LoopSpec validation error messaging. Keep the change small. Do not change public behavior except for clearer validation output if the existing tests support it. Do not push anything.
```

Use the docs task first. Use the code task only after the first pass proves the capture workflow.
