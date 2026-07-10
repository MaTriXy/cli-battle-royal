#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const [captureInput, reasonInput] = process.argv.slice(2);
if (!captureInput || !reasonInput) {
	console.error("Usage: invalidate-capture.mjs <capture-directory> <reason>");
	process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const capturesRoot = realpathSync(join(root, "captures"));
const capture = realpathSync(resolve(captureInput));
const relativeCapture = relative(capturesRoot, capture);
if (relativeCapture.startsWith("..") || relativeCapture === "") {
	throw new Error("Capture path must be a child of captures/");
}

const reason = reasonInput.trim();
const manifestPath = join(capture, "manifest.json");
const scorecardPath = join(capture, "scorecard.md");
const limitationsPath = join(capture, "limitations.md");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

let scorecard = readFileSync(scorecardPath, "utf8")
	.replace(/^Status: `[^`]+`/m, "Status: `invalid`")
	.replace(/\n## Invalidation[\s\S]*$/, "");
scorecard += `\n## Invalidation\n\n${reason}\n`;
writeFileSync(scorecardPath, scorecard);

let limitations = readFileSync(limitationsPath, "utf8");
const limitationLine = `- Invalid run: ${reason}`;
if (!limitations.includes(limitationLine)) limitations += `${limitations.endsWith("\n") ? "" : "\n"}${limitationLine}\n`;
writeFileSync(limitationsPath, limitations);

manifest.status = "invalid";
manifest.publishable = false;
manifest.limitations = [...new Set([...(manifest.limitations ?? []), `Invalid run: ${reason}`])];
for (const [name, path] of [["scorecard.md", scorecardPath], ["limitations.md", limitationsPath]]) {
	manifest.artifacts[name] = {
		sha256: createHash("sha256").update(readFileSync(path)).digest("hex"),
		bytes: statSync(path).size,
	};
}
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`invalidated=${manifest.runId}`);
