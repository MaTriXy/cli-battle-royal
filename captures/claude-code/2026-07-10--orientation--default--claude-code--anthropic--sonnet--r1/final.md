Now I have a complete picture. Here's the inspection report:

## 1. Repository state

- **Root:** `$LAB_ROOT`
- **Branch:** `main`, at commit `643f34a687ec42a53f98dd753a5fb4ab42f1180e` ("1")
- **Dirty:** yes —
  - Modified (unstaged): `00-series-plan.md`, `01-comparison-matrix.md`, `02-agentic-flow-setups.md`, `03-team-short-guide.md`, `04-cross-channel-showcase-plan.md`, `README.md`, `drafts/x/series-outline.md`, `research/sources.md`
  - Untracked: `.gitignore`, `articles/`, `captures/`, `drafts/podcast/`, `drafts/video/`, `harness-setups/`, `lab/`, `media/`, `protocols/`, `runs/`, `scripts/`
  - `testbeds/` itself is gitignored (local clones), so it's absent from status but present on disk.

## 2. Package manager / runtime

The **root repo itself is not a package** — it's a research/documentation workspace (no root `package.json`). The actual package manager and runtime constraints belong to the *subject repo* being tested (`MaTriXy/Monkey.D.Loopy`), cloned locally under `testbeds/*`:

- Package manager: **pnpm 10.33.3**, pinned via `packageManager` field and enforced by a local shim `scripts/bin/pnpm` (auto-installs a pinned pnpm into `runs/local/toolchain/` on first use — this is why "don't install dependencies" matters here).
- Runtime: **Node.js ≥ 22** (`engines.node` in root and package manifests, e.g. `packages/core`). Locally installed Node is v26.5.0, which satisfies this.
- It's a pnpm workspace monorepo (`pnpm-workspace.yaml`: `packages/*`).

## 3. Main package boundaries

Two distinct layers:

**A. This repo (agentic-harness-series)** — organized by working directory, not packages:
- `articles/`, `drafts/` (podcast/video/x) — content drafts
- `captures/` — curated evidence from harness runs (tracked; raw provider transcripts gitignored)
- `harness-setups/`, `protocols/` — test setup recipes and evaluation protocol/templates
- `lab/`, `research/` — run metadata and source notes
- `scripts/` — reproducibility tooling (`clone-subject.sh`, `prepare-run.sh`, `run-harness.sh`, `verify-run.sh`, `verify-fixed-doc.mjs`, `verify-code-test.mjs`, `curate-run.mjs`, `finalize-run.mjs`, `bin/pnpm` shim)
- `testbeds/` — gitignored local clones, one per harness/lane (e.g. `smoke-claude-native`, `codex-monkey-d-loopy`, `run-orientation-default-codex-r1`, plus `monkey-d-loopy-main`)

**B. The subject repo** (`testbeds/*/`, pnpm workspace `Monkey.D.Loopy`) — packages under `packages/`:
`core`, `cli`, `runtime`, `verify`, `mcp`, `infer`, `evals`. Relevant ones for this task: `@loopyc/core` (pure validator/IR/planner; owns `packages/core/test/validate.test.ts`) and `@loopyc/cli` (owns `examples/deploy-watch.yaml`, `loopc validate`).

## 4. Smallest verification commands

Both are driven by `scripts/verify-run.sh <testbed> <task> <lane> <summary-file> <log-file>`, which itself calls narrower scripts. The minimal underlying commands per change type:

**Documentation change** (e.g. `examples/deploy-watch.yaml`, task `fixed-doc`):
```
node scripts/verify-fixed-doc.mjs <testbed-dir> <baseline-commit>
```
plus, if you also want the CLI's own semantic check (requires deps already installed in the testbed):
```
PATH="scripts/bin:$PATH" pnpm --dir <testbed-dir> loopc validate examples/deploy-watch.yaml
```

**Core validation-test change** (`packages/core/test/validate.test.ts`, task `code-test`):
```
node scripts/verify-code-test.mjs <testbed-dir>
```
plus the actual test/typecheck run (requires deps installed):
```
PATH="scripts/bin:$PATH" pnpm --filter @loopyc/core test -- validate.test.ts
PATH="scripts/bin:$PATH" pnpm --filter @loopyc/core typecheck
```

The `node scripts/verify-*.mjs` scripts are pure git-diff/AST-shape checks with no dependency install required; the `pnpm --filter` commands require the testbed's `node_modules` to already be installed, which I did not do per your constraints.
