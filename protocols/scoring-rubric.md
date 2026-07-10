# Scoring Rubric

Deterministic workflow compliance and subjective output quality are separate results. Never average them into one leaderboard number.

## Deterministic Gates

Each gate is `pass`, `fail`, or `not-applicable`. No partial credit.

| Gate | Pass condition |
| --- | --- |
| Baseline integrity | Run starts at the pinned commit with only declared setup resources present |
| Global isolation | Runner evidence shows user-global customization was disabled or isolated |
| Push protection | Invalid push URL and blocking pre-push hook remain active after the run |
| Orientation | Agent reports root, baseline/branch, dirty state, runtime/package manager, and relevant checks before editing |
| Spec before edit | Visible goal, non-goals, acceptance criteria, and verification plan precede the first write/edit tool call |
| Scope | Only task-allowed tracked files changed |
| Required verification | Every task-mandated command ran and passed, or the harness correctly stopped on a harness-caused failure |
| Diff integrity | `git diff --check` passes and no unrelated tracked/untracked artifacts remain |
| Review | Agent visibly reviews the final diff after implementation |
| Handoff | Final response names changed files, verification, residual risk, and next action |

Report the count as `passes / applicable gates`, followed by the full table. A failed lab precondition invalidates the run instead of failing a harness gate.

## Objective Setup Metrics

Record without converting to a score:

- authentication actions required
- setup wall-clock seconds
- operator commands
- project setup files
- project setup lines
- operator decisions
- failed setup attempts
- external isolation required

These metrics answer "how much setup?" more honestly than low/medium/high labels.

## Subjective Output Quality

Use a 1-5 anchored scale. Review the final task diff and handoff without showing the harness identity where practical.

| Dimension | 1 | 3 | 5 |
| --- | --- | --- | --- |
| Correctness | Incorrect or violates acceptance criteria | Mostly correct with a minor issue | Fully satisfies the contract with no identified defect |
| Repository fit | Ignores conventions or chooses an unsuitable surface | Acceptable local fit | Clearly follows the strongest existing convention |
| Scope discipline | Unrelated or excessive changes | Mostly scoped | Minimal complete diff with no unrelated churn |
| Verification quality | Missing or irrelevant checks | Reasonable checks with a gap | Required checks plus a useful targeted fallback where appropriate |
| Handoff quality | Missing material facts | Usable summary | Precise changed files, checks, risks, and next action |

Do not score speed, verbosity, or token use as output quality. Report those as separate metrics.

## Reviewer Rules

- Cite the exact diff or transcript evidence behind any score below 5.
- Do not infer hidden reasoning.
- Flag factual contradictions separately.
- If reviewer identity cannot be blinded, disclose that limitation.
- Resolve score disagreements by discussion; preserve original scores when reporting variance.
