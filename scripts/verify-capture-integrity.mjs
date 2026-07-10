#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const capturesRoot = join(root, "captures");
let manifests = 0;
let artifacts = 0;
const failures = [];

for (const harness of readdirSync(capturesRoot)) {
	const harnessRoot = join(capturesRoot, harness);
	if (!statSync(harnessRoot).isDirectory()) continue;
	for (const runId of readdirSync(harnessRoot)) {
		const capture = join(harnessRoot, runId);
		const manifestPath = join(capture, "manifest.json");
		if (!existsSync(manifestPath)) continue;
		const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
		manifests += 1;
		for (const [name, expected] of Object.entries(manifest.artifacts ?? {})) {
			artifacts += 1;
			const artifactPath = join(capture, name);
			if (!existsSync(artifactPath)) {
				failures.push(`${runId}: missing ${name}`);
				continue;
			}
			const content = readFileSync(artifactPath);
			const hash = createHash("sha256").update(content).digest("hex");
			if (hash !== expected.sha256 || content.length !== expected.bytes) {
				failures.push(`${runId}: hash or size mismatch for ${name}`);
			}
		}
	}
}

for (const failure of failures) console.error(failure);
console.log(`capture_integrity=${failures.length ? "fail" : "pass"} manifests=${manifests} artifacts=${artifacts}`);
if (failures.length) process.exit(1);
