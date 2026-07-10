#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";

const [targetInput, baselineCommit] = process.argv.slice(2);
const relativePath = "examples/deploy-watch.yaml";

if (!targetInput || !baselineCommit) {
	console.error("Usage: verify-fixed-doc.mjs <testbed> <baseline-commit>");
	process.exit(1);
}

const targetDir = resolve(targetInput);

const requireFromCli = createRequire(join(targetDir, "packages/cli/package.json"));
const YAML = requireFromCli("yaml");
const baseline = execFileSync("git", ["-C", targetDir, "show", `${baselineCommit}:${relativePath}`], {
	encoding: "utf8",
});
const current = readFileSync(join(targetDir, relativePath), "utf8");
const diff = execFileSync("git", ["-C", targetDir, "diff", "--unified=0", "--", relativePath], {
	encoding: "utf8",
});

const firstDataSuffix = (source) => {
	const lines = source.split("\n");
	const index = lines.findIndex((line) => line.trim() !== "" && !line.trimStart().startsWith("#"));
	return index === -1 ? "" : lines.slice(index).join("\n");
};

const changedContentLines = diff
	.split("\n")
	.filter((line) => (/^[+-]/.test(line) && !line.startsWith("+++") && !line.startsWith("---")))
	.map((line) => line.slice(1).trim());

const checks = {
	semanticYamlEquality: isDeepStrictEqual(YAML.parse(baseline), YAML.parse(current)),
	onlyCommentLinesChanged: changedContentLines.length > 0 && changedContentLines.every((line) => line === "" || line.startsWith("#")),
	onlyLeadingCommentChanged: firstDataSuffix(baseline) === firstDataSuffix(current),
};

for (const [name, passed] of Object.entries(checks)) {
	console.log(`${name}=${passed ? "pass" : "fail"}`);
}

if (Object.values(checks).some((passed) => !passed)) {
	process.exit(1);
}
