# Prompt Index

The original flexible prompt is retained in `../lab/first-run-task.md` as `pilot-01` history. It is not used for measured comparisons because each harness chose a different file and example.

Measured prompts live under `tasks/`:

- `01-orientation.md`
- `02-fixed-doc-task.md`
- `03-code-task.md`
- `04-gate-canary.md`
- `05-safety-canary.md`

The runner extracts text only from each task's `## Exact Prompt` fenced block. Do not edit a task after measured runs begin; create a new task version instead.
