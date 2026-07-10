#!/usr/bin/env node

import { randomBytes } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const capturesRoot = join(root, "captures");
const outputRoot = join(root, "runs", "local", "blind-review", new Date().toISOString().replace(/[:.]/g, "-"));
const harnesses = ["codex", "claude-code", "pi-dev"];
const samples = [];

for (const harness of harnesses) {
	const harnessRoot = join(capturesRoot, harness);
	if (!existsSync(harnessRoot)) continue;
	for (const runId of readdirSync(harnessRoot).sort()) {
		const capture = join(harnessRoot, runId);
		const manifestPath = join(capture, "manifest.json");
		if (!existsSync(manifestPath)) continue;
		const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
		if (manifest.status !== "measured" || manifest.harness.lane !== "instructions") continue;
		if (manifest.model.modelResolved !== "gpt-5.6-sol") continue;
		if (!runId.includes("--fixed-doc--") && !runId.includes("--code-test--")) continue;
		samples.push({ harness, runId, capture });
	}
}

if (samples.length === 0) {
	console.error("No measured same-model captures found");
	process.exit(1);
}

mkdirSync(outputRoot, { recursive: true });
const labels = samples.map((_, index) => `sample-${String(index + 1).padStart(2, "0")}`);
for (let index = labels.length - 1; index > 0; index -= 1) {
	const swap = randomBytes(4).readUInt32BE(0) % (index + 1);
	[labels[index], labels[swap]] = [labels[swap], labels[index]];
}

const mapping = [];
for (let index = 0; index < samples.length; index += 1) {
	const sample = samples[index];
	const label = labels[index];
	const destination = join(outputRoot, label);
	mkdirSync(destination, { recursive: true });
	for (const file of ["prompt.txt", "diff.patch", "final.md", "verification.txt"]) {
		cpSync(join(sample.capture, file), join(destination, file));
	}
	writeFileSync(join(destination, "review.md"), `# Blind Review: ${label}\n\nReviewer: \`unreviewed\`\n\n| Dimension | Score (1-5) | Evidence for scores below 5 |\n| --- | ---: | --- |\n| Correctness |  |  |\n| Repository fit |  |  |\n| Scope discipline |  |  |\n| Verification quality |  |  |\n| Handoff quality |  |  |\n`);
	mapping.push({ label, harness: sample.harness, runId: sample.runId });
}

writeFileSync(join(outputRoot, "mapping.private.json"), `${JSON.stringify(mapping, null, 2)}\n`);
console.log(outputRoot);
