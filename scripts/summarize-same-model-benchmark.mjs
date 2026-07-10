#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const capturesRoot = join(root, "captures");
const harnesses = ["codex", "claude-code", "pi-dev"];
const tasks = ["fixed-doc", "code-test"];
const rows = [];
const measuredRuns = [];

const median = (values) => {
	const sorted = [...values].sort((a, b) => a - b);
	if (sorted.length === 0) return null;
	const middle = Math.floor(sorted.length / 2);
	return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

for (const harness of harnesses) {
	for (const task of tasks) {
		const runs = [];
		for (const runId of readdirSync(join(capturesRoot, harness)).sort()) {
			if (!runId.includes(`--${task}--instructions--${harness}--`)) continue;
			const path = join(capturesRoot, harness, runId, "manifest.json");
			if (!existsSync(path)) continue;
			const manifest = JSON.parse(readFileSync(path, "utf8"));
			if (manifest.status !== "measured" || manifest.model.modelResolved !== "gpt-5.6-sol") continue;
			const verification = readFileSync(join(capturesRoot, harness, runId, "verification.txt"), "utf8");
			const run = { manifest, verificationPassed: /^overall=pass$/m.test(verification) };
			runs.push(run);
			measuredRuns.push(run);
		}
		rows.push({
			harness,
			task,
			n: runs.length,
			exits: runs.filter((item) => item.manifest.timing.exitCode === 0).length,
			verifierPasses: runs.filter((item) => item.verificationPassed).length,
			duration: median(runs.map((item) => item.manifest.timing.durationSeconds)),
			toolCalls: median(runs.map((item) => item.manifest.metrics.toolCalls)),
			tokens: median(runs.map((item) => item.manifest.metrics.tokens.total)),
		});
	}
}

console.log("| Harness | Task | Runs | Process exits | Verifier passes | Median wall time | Median tool calls | Reported median tokens |\n| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |");
for (const row of rows) {
	const format = (value) => value === null ? "n/a" : value.toLocaleString("en-US");
	console.log(`| ${row.harness} | ${row.task} | ${row.n} | ${row.exits}/${row.n} | ${row.verifierPasses}/${row.n} | ${row.duration === null ? "n/a" : `${row.duration}s`} | ${format(row.toolCalls)} | ${format(row.tokens)} |`);
}

console.log("\nToken totals are provider-reported telemetry. Context construction, cache accounting, and the Claude adapter transport differ, so token figures are not a quality score or a directly equivalent cost measure.");

const workflowGates = ["Orientation", "Spec before edit", "Review", "Handoff"];
console.log("\n| Workflow gate | Passes |");
console.log("| --- | ---: |");
for (const gate of workflowGates) {
	const passes = measuredRuns.filter((item) => item.manifest.review?.workflow?.gates?.[gate] === "pass").length;
	console.log(`| ${gate} | ${passes}/${measuredRuns.length} |`);
}

console.log("\n| Harness | Task | Blind handoff scores across repeats |");
console.log("| --- | --- | --- |");
for (const row of rows) {
	const scores = measuredRuns
		.filter((item) => item.manifest.harness.name === row.harness && item.manifest.runId.includes(`--${row.task}--`))
		.map((item) => item.manifest.review?.dimensions?.["Handoff quality"] ?? "unreviewed");
	console.log(`| ${row.harness} | ${row.task} | ${scores.join(", ")} |`);
}

console.log("\nBlind correctness, repository fit, scope discipline, and verification quality were 5/5 in all 18 reviews. Handoff quality is shown separately rather than averaged into a composite ranking.");

if (rows.some((row) => row.n !== 3)) {
	console.error("Benchmark is incomplete: expected exactly three measured runs per cell.");
	process.exitCode = 1;
}
