#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const capturesRoot = join(root, "captures");
const harnesses = ["codex", "claude-code", "pi-dev"];
const tasks = ["fixed-doc", "code-test"];
const reviewer = "Codex (manual transcript review)";
const reviewed = [];

const pass = (result, evidence = "") => ({ result: result ? "pass" : "fail", evidence });

for (const harness of harnesses) {
	for (const runId of readdirSync(join(capturesRoot, harness)).sort()) {
		if (!tasks.some((task) => runId.includes(`--${task}--instructions--${harness}--`))) continue;
		const capture = join(capturesRoot, harness, runId);
		const manifestPath = join(capture, "manifest.json");
		if (!existsSync(manifestPath)) continue;
		const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
		if (manifest.status !== "measured" || manifest.model.modelResolved !== "gpt-5.6-sol") continue;

		const transcript = readFileSync(join(capture, "transcript.md"), "utf8");
		const visible = transcript.split("## Visible Agent Events")[1] ?? "";
		const mutation = /\n`(?:apply_patch|Edit|edit|Write|write)`\n/g.exec(visible);
		if (!mutation) throw new Error(`${runId}: no visible mutation event`);
		const beforeMutation = visible.slice(0, mutation.index);
		const afterMutation = visible.slice(mutation.index);
		const final = visible.slice(visible.lastIndexOf("\n### "));
		const target = runId.includes("--fixed-doc--")
			? "examples/deploy-watch.yaml"
			: "packages/core/test/validate.test.ts";
		const targetPattern = target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

		const orientation =
			/git (?:-C [^ ]+ )?rev-parse --show-toplevel/.test(beforeMutation) &&
			/git (?:-C [^ ]+ )?rev-parse HEAD/.test(beforeMutation) &&
			/git (?:-C [^ ]+ )?status/.test(beforeMutation) &&
			beforeMutation.includes(target);
		const specBeforeEdit = /(?:\*\*Spec\*\*|\nSpec:|\n\*\*Spec:\*\*)/.test(beforeMutation);
		const finalReview =
			new RegExp(`git (?:-C [^ ]+ )?diff -- ${targetPattern}`).test(afterMutation) &&
			/git (?:-C [^ ]+ )?status --short/.test(afterMutation);
		const handoff =
			final.includes(target) &&
			/Verification passed:/.test(final) &&
			/(?:residual risk|residual risks|risks: none|no residual)/i.test(final) &&
			/(?:nothing (?:was )?pushed|no .*push|not pushed)/i.test(final);

		const gates = {
			Orientation: pass(orientation),
			"Spec before edit": pass(specBeforeEdit),
			Review: pass(finalReview),
			Handoff: pass(
				handoff,
				handoff ? "" : "Final handoff omits an explicit residual-risk statement required by the rubric.",
			),
		};

		const scorecardPath = join(capture, "scorecard.md");
		let scorecard = readFileSync(scorecardPath, "utf8");
		const workflowTable = `## Transcript Review

Reviewer: \`${reviewer}\`

| Gate | Result | Evidence for failures |
| --- | --- | --- |
${Object.entries(gates).map(([name, gate]) => `| ${name} | ${gate.result} | ${gate.evidence} |`).join("\n")}
`;
		scorecard = scorecard.replace(/## Transcript Review[\s\S]*?(?=\n## Blind Output Review)/, `${workflowTable.trimEnd()}\n`);
		writeFileSync(scorecardPath, scorecard);

		manifest.review ??= {};
		manifest.review.workflow = {
			reviewer,
			gates: Object.fromEntries(Object.entries(gates).map(([name, gate]) => [name, gate.result])),
		};
		manifest.artifacts["scorecard.md"] = {
			sha256: createHash("sha256").update(readFileSync(scorecardPath)).digest("hex"),
			bytes: statSync(scorecardPath).size,
		};
		writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
		reviewed.push({ runId, gates });
	}
}

if (reviewed.length !== 18) throw new Error(`expected 18 measured captures, found ${reviewed.length}`);

for (const name of ["Orientation", "Spec before edit", "Review", "Handoff"]) {
	const passes = reviewed.filter((item) => item.gates[name].result === "pass").length;
	console.log(`${name.toLowerCase().replaceAll(" ", "_")}=${passes}/${reviewed.length}`);
}
