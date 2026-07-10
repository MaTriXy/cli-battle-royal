#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const capturesRoot = join(root, "captures");
let manifests = 0;
let artifacts = 0;

for (const harness of readdirSync(capturesRoot)) {
	const harnessRoot = join(capturesRoot, harness);
	if (!statSync(harnessRoot).isDirectory()) continue;
	for (const runId of readdirSync(harnessRoot)) {
		const capture = join(harnessRoot, runId);
		const manifestPath = join(capture, "manifest.json");
		if (!existsSync(manifestPath)) continue;
		const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
		manifest.artifacts ??= {};
		delete manifest.artifacts["manifest.json"];
		delete manifest.artifacts["redaction-scan.txt"];
		for (const name of Object.keys(manifest.artifacts)) {
			const artifactPath = join(capture, name);
			if (!existsSync(artifactPath)) throw new Error(`${runId}: missing artifact ${name}`);
			const content = readFileSync(artifactPath);
			manifest.artifacts[name] = {
				sha256: createHash("sha256").update(content).digest("hex"),
				bytes: content.length,
			};
			artifacts += 1;
		}
		writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
		manifests += 1;
	}
}

console.log(`refreshed_manifests=${manifests} refreshed_artifacts=${artifacts}`);
