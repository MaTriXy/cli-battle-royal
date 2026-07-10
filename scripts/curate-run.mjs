#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";

const [harness, rawEventsPath, promptPath, transcriptPath, finalPath, labRoot, testbedRoot, providerFinalPath] = process.argv.slice(2);

if (!harness || !rawEventsPath || !promptPath || !transcriptPath || !finalPath || !labRoot || !testbedRoot) {
	console.error("Usage: curate-run.mjs <harness> <events> <prompt> <transcript> <final> <lab-root> <testbed> [provider-final]");
	process.exit(1);
}

const redact = (value) => {
	let text = String(value ?? "");
	text = text.split(testbedRoot).join("$TESTBED");
	text = text.split(labRoot).join("$LAB_ROOT");
	text = text.replace(/\/Users\/[^/\s"']+/g, "$HOME");
	text = text.replace(/\/home\/[^/\s"']+/g, "$HOME");
	text = text.replace(/\/private\/var\/folders\/[^\s"']+/g, "$TMP");
	text = text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]");
	text = text.replace(/\bsk-[A-Za-z0-9_-]{12,}\b/g, "[redacted-secret]");
	text = text.replace(/\bBearer\s+[A-Za-z0-9._~+\/-]+=*/gi, "Bearer [redacted-secret]");
	text = text.replace(/("?(?:access_token|refresh_token|api_key|authorization)"?\s*[:=]\s*)["']?[^\s,"']+/gi, "$1[redacted-secret]");
	return text;
};

const compact = (value, limit = 1400) => {
	const redacted = redact(typeof value === "string" ? value : JSON.stringify(value));
	return redacted.length > limit ? `${redacted.slice(0, limit)}... [truncated]` : redacted;
};

const parseLines = (source) => source
	.split("\n")
	.filter(Boolean)
	.flatMap((line) => {
		try {
			return [JSON.parse(line)];
		} catch {
			return [];
		}
	});

const events = parseLines(readFileSync(rawEventsPath, "utf8"));
const visible = [];
let lastAssistantText = "";
let resultText = "";

const addAssistant = (text) => {
	if (!text || !String(text).trim()) return;
	const clean = redact(text).trim();
	visible.push({ kind: "Assistant", body: clean });
	lastAssistantText = clean;
};

const addTool = (name, input, outcome) => {
	let body = `\`${redact(name)}\``;
	if (input !== undefined) body += `\n\n\`\`\`json\n${compact(input)}\n\`\`\``;
	if (outcome) body += `\n\nOutcome: ${redact(outcome)}`;
	visible.push({ kind: "Tool", body });
};

for (const event of events) {
	if (harness === "codex") {
		const item = event.item;
		if (event.type !== "item.completed" || !item) continue;
		if (item.type === "agent_message") addAssistant(item.text);
		if (item.type === "command_execution") addTool("Bash", { command: item.command }, `exit ${item.exit_code}`);
		if (item.type === "file_change") addTool("apply_patch", item.changes ?? { status: item.status });
		continue;
	}

	if (harness === "pi-dev") {
		if (event.type === "tool_execution_start") addTool(event.toolName, event.args);
		if (event.type === "message_end" && event.message?.role === "assistant" && Array.isArray(event.message.content)) {
			for (const block of event.message.content) {
				if (block.type === "text") addAssistant(block.text);
			}
		}
		continue;
	}

	if (event.type === "result" && typeof event.result === "string") {
		resultText = redact(event.result);
	}

	const message = event.message;
	if (!message || message.role !== "assistant" || !Array.isArray(message.content)) continue;
	for (const block of message.content) {
		if (block.type === "text") addAssistant(block.text);
		if (block.type === "tool_use") addTool(block.name, block.input);
		if (block.type === "toolCall") addTool(block.name, block.arguments);
	}
}

const prompt = redact(readFileSync(promptPath, "utf8").trim());
const sections = visible.map((entry, index) => `### ${index + 1}. ${entry.kind}\n\n${entry.body}`).join("\n\n");
const transcript = `# Curated Transcript\n\n> Private provider payloads and non-visible reasoning were excluded. Paths and identifiers were redacted.\n\n## Prompt\n\n${prompt}\n\n## Visible Agent Events\n\n${sections || "No visible agent events were recoverable from the process stream."}\n`;
writeFileSync(transcriptPath, transcript);

let finalText = "";
if (providerFinalPath) {
	try {
		finalText = redact(readFileSync(providerFinalPath, "utf8").trim());
	} catch {
		finalText = "";
	}
}
finalText ||= resultText || lastAssistantText || "No final assistant message was recoverable.";
writeFileSync(finalPath, `${finalText.trim()}\n`);
