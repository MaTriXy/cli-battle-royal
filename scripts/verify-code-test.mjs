#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const [targetInput] = process.argv.slice(2);
const relativePath = "packages/core/test/validate.test.ts";

if (!targetInput) {
	console.error("Usage: verify-code-test.mjs <testbed>");
	process.exit(1);
}

const targetDir = resolve(targetInput);

const diff = execFileSync("git", ["-C", targetDir, "diff", "--unified=0", "--", relativePath], {
	encoding: "utf8",
});
const additions = diff
	.split("\n")
	.filter((line) => line.startsWith("+") && !line.startsWith("+++"))
	.map((line) => line.slice(1));
const addedText = additions.join("\n");
const focusedTests = additions.filter((line) => /^\s*(?:it|test)\s*\(/.test(line)).length;

const checks = {
	exactlyOneFocusedTestAdded: focusedTests === 1,
	usesPublicFormatter: addedText.includes("formatValidation"),
	usesProcessRaw: addedText.includes("processRaw"),
	assertsInvalidSummary: /invalid/.test(addedText),
	assertsBadRefCode: addedText.includes("[bad-ref]"),
	assertsConditionPath: /body\[0\](?::[A-Za-z0-9_-]+)?\.when/.test(addedText),
};

for (const [name, passed] of Object.entries(checks)) {
	console.log(`${name}=${passed ? "pass" : "fail"}`);
}

if (Object.values(checks).some((passed) => !passed)) {
	process.exit(1);
}
