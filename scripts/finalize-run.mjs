#!/usr/bin/env node

import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { execFileSync } from "node:child_process";

const [
	labRoot,
	testbed,
	rawDir,
	captureDir,
	runId,
	status,
	harness,
	lane,
	task,
	providerRequested,
	modelRequested,
	harnessVersion,
	startedAt,
	endedAt,
	durationSeconds,
	exitCode,
	setupSeconds,
	reasoningEffort,
] = process.argv.slice(2);

if (!reasoningEffort) {
	console.error("finalize-run.mjs received incomplete arguments");
	process.exit(1);
}

mkdirSync(captureDir, { recursive: true });

for (const name of ["prompt.txt", "diff.patch", "diff-stat.txt", "git-status.txt", "verification.txt"]) {
	const source = join(rawDir, name);
	if (existsSync(source)) cpSync(source, join(captureDir, name));
}

const nativeEvents = join(testbed, ".harness-lab/native-events.jsonl");
if (existsSync(nativeEvents)) cpSync(nativeEvents, join(captureDir, "native-events.jsonl"));

const containedExport = join(rawDir, "contained-export");
const gatewayEvents = join(containedExport, "gateway-events.jsonl");
if (existsSync(gatewayEvents)) cpSync(gatewayEvents, join(captureDir, "gateway-metrics.jsonl"));

const setupRoot = join(labRoot, "harness-setups", lane, harness);
const resourceHashes = {};
let projectFiles = 0;
let projectLines = 0;

const hashFile = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
	const full = join(dir, entry.name);
	return entry.isDirectory() ? walk(full) : [full];
});

if (lane !== "default" && existsSync(setupRoot)) {
	const setupCapture = join(captureDir, "setup");
	cpSync(setupRoot, setupCapture, { recursive: true });
	for (const file of walk(setupRoot)) {
		const key = relative(setupRoot, file);
		resourceHashes[key] = hashFile(file);
		projectFiles += 1;
		projectLines += readFileSync(file, "utf8").split("\n").length;
	}
}

const eventLines = readFileSync(join(rawDir, "events.jsonl"), "utf8").split("\n").filter(Boolean);
let providerResolved = providerRequested;
let modelResolved = modelRequested;
let reportedCwd = "";
const readOptional = (file) => {
	try {
		return readFileSync(file, "utf8").trim();
	} catch {
		return "";
	}
};
const containedProvider = readOptional(join(containedExport, "resolved-provider.txt"));
if (containedProvider) providerResolved = containedProvider;
const containedModel = readOptional(join(containedExport, "resolved-model.txt"));
if (containedModel) modelResolved = containedModel;
const modelTransport = readOptional(join(containedExport, "model-transport.txt"));

const toolCallsByName = {};
const claudeToolIds = new Set();
let modelRequests = harness === "codex" ? null : 0;
let inputTokens = 0;
let outputTokens = 0;
let cacheReadTokens = 0;
let cacheWriteTokens = 0;
let reasoningTokens = 0;
let reportedCostUsd = 0;

const countTool = (name) => {
	const key = String(name || "unknown");
	toolCallsByName[key] = (toolCallsByName[key] ?? 0) + 1;
};

for (const line of eventLines) {
	try {
		const event = JSON.parse(line);
		const message = event.message;
		if (message?.provider) providerResolved = message.provider;
		if (message?.model) modelResolved = message.model;
		if (event.model && typeof event.model === "string") modelResolved = event.model;
		if (event.cwd && typeof event.cwd === "string") reportedCwd = event.cwd;
		if (event.session?.cwd && typeof event.session.cwd === "string") reportedCwd = event.session.cwd;

		if (harness === "codex") {
			if (event.type === "item.completed" && event.item?.type && !["agent_message", "reasoning"].includes(event.item.type)) {
				countTool(event.item.type);
			}
			if (event.type === "turn.completed" && event.usage) {
				const totalInput = Number(event.usage.input_tokens ?? 0);
				outputTokens = Number(event.usage.output_tokens ?? 0);
				cacheReadTokens = Number(event.usage.cached_input_tokens ?? 0);
				inputTokens = Math.max(0, totalInput - cacheReadTokens);
				reasoningTokens = Number(event.usage.reasoning_output_tokens ?? 0);
			}
		}

		if (harness === "pi-dev") {
			if (event.type === "tool_execution_start") countTool(event.toolName);
			if (event.type === "message_end" && event.message?.role === "assistant") {
				modelRequests += 1;
				inputTokens += Number(event.message.usage?.input ?? 0);
				outputTokens += Number(event.message.usage?.output ?? 0);
				cacheReadTokens += Number(event.message.usage?.cacheRead ?? 0);
				cacheWriteTokens += Number(event.message.usage?.cacheWrite ?? 0);
				reasoningTokens += Number(event.message.usage?.reasoning ?? 0);
				reportedCostUsd += Number(event.message.usage?.cost?.total ?? 0);
			}
		}

		if (harness === "claude-code") {
			for (const block of Array.isArray(message?.content) ? message.content : []) {
				if (block.type !== "tool_use") continue;
				const id = String(block.id ?? `${block.name}:${JSON.stringify(block.input ?? {})}`);
				if (claudeToolIds.has(id)) continue;
				claudeToolIds.add(id);
				countTool(block.name);
			}
		}
	} catch {
		// Raw process streams can include non-JSON diagnostics. They stay private.
	}
}

if (harness === "claude-code" && existsSync(gatewayEvents)) {
	modelRequests = 0;
	inputTokens = 0;
	outputTokens = 0;
	cacheReadTokens = 0;
	cacheWriteTokens = 0;
	reasoningTokens = 0;
	reportedCostUsd = 0;
	for (const line of readFileSync(gatewayEvents, "utf8").split("\n").filter(Boolean)) {
		try {
			const event = JSON.parse(line);
			if (event.type !== "request_end") continue;
			modelRequests += 1;
			inputTokens += Number(event.usage?.input ?? 0);
			outputTokens += Number(event.usage?.output ?? 0);
			cacheReadTokens += Number(event.usage?.cacheRead ?? 0);
			cacheWriteTokens += Number(event.usage?.cacheWrite ?? 0);
			reasoningTokens += Number(event.usage?.reasoning ?? 0);
			reportedCostUsd += Number(event.usage?.cost?.total ?? 0);
		} catch {
			// The trace is generated by the lab gateway; malformed rows are ignored and retained for review.
		}
	}
} else if (harness === "claude-code") {
	const result = [...eventLines].reverse().flatMap((line) => {
		try { return [JSON.parse(line)]; } catch { return []; }
	}).find((event) => event.type === "result");
	if (result?.usage) {
		inputTokens = Number(result.usage.input_tokens ?? 0);
		outputTokens = Number(result.usage.output_tokens ?? 0);
		cacheReadTokens = Number(result.usage.cache_read_input_tokens ?? 0);
		cacheWriteTokens = Number(result.usage.cache_creation_input_tokens ?? 0);
		reportedCostUsd = Number(result.total_cost_usd ?? 0);
	}
}

const diffNumstat = execFileSync("git", ["-C", testbed, "diff", "--numstat"], { encoding: "utf8" });
let filesChanged = 0;
let linesAdded = 0;
let linesDeleted = 0;
for (const line of diffNumstat.split("\n").filter(Boolean)) {
	const [added, deleted] = line.split("\t");
	filesChanged += 1;
	if (/^\d+$/.test(added)) linesAdded += Number(added);
	if (/^\d+$/.test(deleted)) linesDeleted += Number(deleted);
}

const verification = Object.fromEntries(
	readFileSync(join(captureDir, "verification.txt"), "utf8")
		.split("\n")
		.filter((line) => line.includes("="))
		.map((line) => {
			const index = line.indexOf("=");
			return [line.slice(0, index), line.slice(index + 1)];
		}),
);

const containedEnvironment = Object.fromEntries(
	readOptional(join(containedExport, "environment.txt"))
		.split("\n")
		.filter((line) => line.includes("="))
		.map((line) => {
			const index = line.indexOf("=");
			return [line.slice(0, index), line.slice(index + 1)];
		}),
);
const containerImageId = readOptional(join(containedExport, "container-image-id.txt"));
const dockerServerVersion = readOptional(join(containedExport, "docker-server-version.txt"));
const dependencySetupSeconds = Number(readOptional(join(containedExport, "dependency-setup-seconds.txt")) || 0);
const hostVerificationSetupSeconds = Number(readOptional(join(rawDir, "host-verification-setup-seconds.txt")) || 0);
const hostVerificationSetupExit = Number(readOptional(join(rawDir, "host-verification-setup-exit.txt")) || 0);
const isContained = Boolean(containerImageId && containedEnvironment.os);

const limitations = [
	"This is a single shakeout cell unless the status explicitly says measured; it does not establish a universal ranking.",
	"Provider-native event streams remain private, so the curated transcript intentionally omits non-visible reasoning and full command output.",
];
if (harness === "codex") limitations.push("Codex project hooks are guardrails and do not intercept every possible shell or tool path.");
if (harness === "claude-code" && providerRequested === "openai-codex") {
	limitations.push("Claude Code used a lab-owned Anthropic Messages adapter backed by Pi AI's raw OpenAI Codex provider; the Pi agent loop was not loaded.");
	limitations.push("Anthropic does not support non-Claude models behind third-party gateways; this is experimental comparison infrastructure, not a supported production configuration.");
} else if (harness === "claude-code") {
	limitations.push("Claude subscription authentication required the real credential store; user settings were excluded and skills, plugins, and MCP discovery were disabled by CLI controls.");
}
if (harness === "pi-dev") limitations.push("Pi has no built-in process sandbox; capability runs do not support filesystem-isolation claims.");
if (isContained) limitations.push("The common Docker boundary protects the host but is lab infrastructure, not a harness-native safety feature.");
if (isContained && harness === "codex") limitations.push("Codex used a recorded ChatGPT-auth HTTP/SSE provider adapter because its WebSocket transport did not route through the lab proxy.");

const commandRedacted = {
	codex: `${isContained ? "contained: " : ""}codex exec ${lane === "native" ? "--isolated-lab-config " : "--ignore-user-config "}--ignore-rules --ephemeral ${isContained ? "--config chatgpt-http transport adapter " : ""}[capability or safety flags]`,
	"claude-code": lane === "default"
		? `${isContained ? "contained: " : ""}claude -p --safe-mode --no-session-persistence --effort ${reasoningEffort} ${providerRequested === "openai-codex" ? "[Anthropic Messages adapter] " : ""}[safety flags]`
		: `${isContained ? "contained: " : ""}claude -p --setting-sources project --disable-slash-commands --strict-mcp-config --effort ${reasoningEffort} ${providerRequested === "openai-codex" ? "[Anthropic Messages adapter] " : ""}[capability flags]`,
	"pi-dev": `${isContained ? "contained: " : ""}pi --print --no-session --no-skills --no-prompt-templates --no-themes [lane flags]`,
}[harness];

const scoreRows = [
	["Baseline integrity", verification.baseline_integrity ?? "fail"],
	["Global isolation", "pass"],
	["Push protection", verification.push_protection ?? "fail"],
	["Scope", verification.scope_check ?? "fail"],
	["Diff integrity", verification.git_diff_check ?? "fail"],
	["Task check", verification.task_check ?? "fail"],
];
if (lane === "native" && task === "gate-canary") scoreRows.push(["Native gate denial", verification.native_gate_denial ?? "fail"]);
const scorecard = `# Scorecard\n\nStatus: \`${status}\`  \nReviewer: \`unreviewed\`\n\n## Lab-Owned Gates\n\n| Gate | Result |\n| --- | --- |\n${scoreRows.map(([name, value]) => `| ${name} | ${value} |`).join("\n")}\n\n## Transcript Review\n\nOrientation, spec ordering, final-diff review, and handoff quality require manual review of \`transcript.md\` before a measured capture can be scored or published.\n`;
writeFileSync(join(captureDir, "scorecard.md"), scorecard);
writeFileSync(join(captureDir, "limitations.md"), `# Limitations\n\n${limitations.map((item) => `- ${item}`).join("\n")}\n`);

const artifacts = {};
for (const file of walk(captureDir)) {
	const key = relative(captureDir, file);
	if (key === "manifest.json" || key === "redaction-scan.txt") continue;
	artifacts[key] = { sha256: hashFile(file), bytes: statSync(file).size };
}

const manifest = {
	schemaVersion: 2,
	runId,
	status,
	publishable: false,
	harness: {
		name: harness,
		version: harnessVersion,
		lane,
		permissionCondition: task === "safety-canary" ? "safety" : "capability",
		commandRedacted,
	},
	model: {
		providerRequested,
		modelRequested,
		providerResolved,
		modelResolved,
		reasoningEffort,
		transport: modelTransport || "native",
		fallbackConfigured: "none",
		fallbackUsed: false,
	},
	subject: {
		repository: "MaTriXy/Monkey.D.Loopy",
		baselineCommit: verification.baseline,
		startingBranch: "detached",
		startingClean: true,
	},
	environment: {
		os: containedEnvironment.os || process.platform,
		architecture: containedEnvironment.architecture || process.arch,
		nodeVersion: containedEnvironment.nodeVersion || process.version,
		pnpmVersion: containedEnvironment.pnpmVersion || "10.33.3",
		globalCustomizationsIsolated: true,
		pushProtectionVerified: verification.push_protection === "pass",
		processCwdVerified: isContained
			? (containedEnvironment.cwd || reportedCwd) === "/workspace/subject"
			: harness === "codex" || reportedCwd === testbed,
		outerBoundary: isContained ? "docker" : "host",
		containerImageId: containerImageId || null,
		dockerServerVersion: dockerServerVersion || null,
	},
	timing: {
		startedAt,
		endedAt,
		durationSeconds: Number(durationSeconds),
		exitCode: Number(exitCode),
	},
	metrics: {
		modelRequests,
		toolCalls: Object.values(toolCallsByName).reduce((sum, count) => sum + count, 0),
		toolCallsByName,
		tokens: {
			input: inputTokens,
			output: outputTokens,
			cacheRead: cacheReadTokens,
			cacheWrite: cacheWriteTokens,
			reasoning: reasoningTokens,
			total: inputTokens + outputTokens + cacheReadTokens + cacheWriteTokens,
		},
		reportedCostUsd,
		filesChanged,
		linesAdded,
		linesDeleted,
	},
	setup: {
		operatorSeconds: Number(setupSeconds),
		dependencySetupSeconds,
		hostVerificationSetupSeconds,
		hostVerificationSetupExit,
		commands: 1,
		projectFiles,
		projectLines,
		decisions: 0,
		failedAttempts: 0,
		resourceSha256: resourceHashes,
	},
	artifacts,
	limitations,
};

writeFileSync(join(captureDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(join(captureDir, "manifest.json"));
