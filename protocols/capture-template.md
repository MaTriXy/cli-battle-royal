# Curated Capture Template

Raw process output belongs under ignored `runs/raw/`. This template describes the redacted evidence package under `captures/<harness>/<run-id>/`.

## Manifest

Required `manifest.json` fields:

```json
{
  "schemaVersion": 1,
  "runId": "",
  "status": "shakeout|measured|pilot|invalid",
  "publishable": false,
  "harness": {
    "name": "",
    "version": "",
    "lane": "default|instructions|native",
    "permissionCondition": "capability|safety",
    "commandRedacted": ""
  },
  "model": {
    "providerRequested": "",
    "modelRequested": "",
    "providerResolved": "",
    "modelResolved": "",
    "fallbackConfigured": "",
    "fallbackUsed": false
  },
  "subject": {
    "repository": "MaTriXy/Monkey.D.Loopy",
    "baselineCommit": "",
    "startingBranch": "detached",
    "startingClean": true
  },
  "environment": {
    "os": "",
    "architecture": "",
    "nodeVersion": "",
    "pnpmVersion": "10.33.3",
    "globalCustomizationsIsolated": true,
    "pushProtectionVerified": true
  },
  "timing": {
    "startedAt": "",
    "endedAt": "",
    "durationSeconds": 0,
    "exitCode": 0
  },
  "setup": {
    "operatorSeconds": 0,
    "commands": 0,
    "projectFiles": 0,
    "projectLines": 0,
    "decisions": 0,
    "failedAttempts": 0,
    "resourceSha256": {}
  },
  "artifacts": {},
  "limitations": []
}
```

## Curated Transcript

`transcript.md` includes only:

- exact user-visible prompt
- visible assistant progress/spec/handoff text
- tool names and redacted arguments needed to understand the run
- concise, redacted command outcomes

It excludes hidden thinking, encrypted reasoning, signatures, credentials, full environment dumps, unrelated global resource names, and absolute home paths.

## Verification

`verification.txt` records lab-owned checks after the harness exits:

```text
baseline=<sha>
push_protection=pass|fail
pinned_pnpm=pass|fail
task_check=pass|fail
git_diff_check=pass|fail
scope_check=pass|fail
```

## Scorecard

`scorecard.md` uses `scoring-rubric.md` and contains:

- deterministic gate table
- objective setup metrics
- blind output-quality scores, when reviewed
- reviewer identity or `unreviewed`
- invalidation reason, if any

## Publication Gate

A capture remains `publishable: false` until:

- manifest fields are complete
- transcript is curated
- redaction scan passes
- no credentials or private paths appear
- deterministic checks are attached
- limitations are explicit
- factual claims match the evidence
