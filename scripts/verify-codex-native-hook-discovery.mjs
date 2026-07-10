#!/usr/bin/env node

import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";

const target = resolve(process.argv[2] ?? "");
if (!process.argv[2]) {
	console.error("Usage: verify-codex-native-hook-discovery.mjs <prepared-native-codex-testbed>");
	process.exit(1);
}

const home = mkdtempSync(join(tmpdir(), "harness-codex-home-"));
writeFileSync(join(home, "config.toml"), `[projects."${target}"]\ntrust_level = "trusted"\n`);

const child = spawn("codex", ["app-server", "--stdio"], {
	cwd: target,
	env: { ...process.env, CODEX_HOME: home },
	stdio: ["pipe", "pipe", "pipe"],
});

let stdout = "";
let stderr = "";
child.stdout.on("data", (chunk) => { stdout += chunk; });
child.stderr.on("data", (chunk) => { stderr += chunk; });

child.stdin.write(`${JSON.stringify({
	method: "initialize",
	id: 0,
	params: { clientInfo: { name: "harness_lab", title: "Harness Lab", version: "1" } },
})}\n`);
child.stdin.write(`${JSON.stringify({ method: "initialized", params: {} })}\n`);
child.stdin.write(`${JSON.stringify({ method: "hooks/list", id: 1, params: { cwds: [target] } })}\n`);

const timeout = setTimeout(() => child.kill("SIGTERM"), 5_000);
const exitCode = await new Promise((accept) => child.on("exit", accept));
clearTimeout(timeout);
rmSync(home, { recursive: true, force: true });

const messages = stdout.split("\n").filter(Boolean).flatMap((line) => {
	try { return [JSON.parse(line)]; } catch { return []; }
});
const response = messages.find((message) => message.id === 1);
const hooks = response?.result?.data?.[0]?.hooks ?? [];
	const discovered = hooks.find((hook) =>
	hook.source === "project"
	&& hook.eventName === "preToolUse"
	&& hook.matcher === "Edit|Write"
	&& hook.enabled === true
);

if (!discovered) {
	console.error("Codex native project hook was not discovered");
	if (response) console.error(JSON.stringify(response));
	if (stderr.trim()) console.error(stderr.trim());
	process.exit(exitCode || 1);
}

console.log(`hook_discovery=pass source=${discovered.source} trust=${discovered.trustStatus}`);
