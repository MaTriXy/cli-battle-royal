import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";

import {
	JsonCredentialStore,
	anthropicRequestToPiContext,
	createGatewayServer,
	mapStopReason,
	resolveReasoningEffort,
} from "./server.mjs";

const model = {
	id: "gpt-5.6-sol",
	name: "GPT-5.6 Sol",
	api: "openai-codex-responses",
	provider: "openai-codex",
	maxTokens: 128000,
};

const usage = {
	input: 100,
	output: 12,
	cacheRead: 40,
	cacheWrite: 0,
	totalTokens: 152,
	cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
};

const finalMessage = {
	role: "assistant",
	api: model.api,
	provider: model.provider,
	model: model.id,
	responseModel: model.id,
	content: [
		{ type: "text", text: "Checking." },
		{ type: "toolCall", id: "tool_1", name: "Read", arguments: { file_path: "README.md" } },
	],
	usage,
	stopReason: "toolUse",
	timestamp: Date.now(),
};

const fakeEvents = async function* () {
	const textPartial = { ...finalMessage, content: [{ type: "text", text: "" }] };
	yield { type: "start", partial: textPartial };
	yield { type: "text_start", contentIndex: 0, partial: textPartial };
	yield { type: "text_delta", contentIndex: 0, delta: "Checking.", partial: textPartial };
	yield { type: "text_end", contentIndex: 0, content: "Checking.", partial: textPartial };
	const toolPartial = { ...finalMessage };
	yield { type: "toolcall_start", contentIndex: 1, partial: toolPartial };
	yield { type: "toolcall_delta", contentIndex: 1, delta: '{"file_path":"README.md"}', partial: toolPartial };
	yield { type: "toolcall_end", contentIndex: 1, toolCall: finalMessage.content[1], partial: toolPartial };
	yield { type: "done", reason: "toolUse", message: finalMessage };
};

test("converts Anthropic messages, tools, and tool results to Pi context", () => {
	const context = anthropicRequestToPiContext({
		system: [{ type: "text", text: "System one" }, { type: "text", text: "System two" }],
		tools: [{ name: "Read", description: "Read a file", input_schema: { type: "object", properties: { file_path: { type: "string" } } } }],
		messages: [
			{ role: "user", content: [{ type: "text", text: "Inspect the repo" }] },
			{ role: "assistant", content: [{ type: "tool_use", id: "tool_1", name: "Read", input: { file_path: "README.md" } }] },
			{ role: "user", content: [{ type: "tool_result", tool_use_id: "tool_1", content: "contents" }] },
		],
	}, model);

	assert.equal(context.systemPrompt, "System one\n\nSystem two");
	assert.deepEqual(context.messages.map((message) => message.role), ["user", "assistant", "toolResult"]);
	assert.equal(context.messages[2].toolName, "Read");
	assert.equal(context.messages[2].content[0].text, "contents");
	assert.equal(context.tools[0].name, "Read");
});

test("maps controlled effort and stop reasons", () => {
	assert.equal(resolveReasoningEffort({ output_config: { effort: "xhigh" } }, "high"), "xhigh");
	assert.equal(resolveReasoningEffort({ thinking: { type: "disabled" } }, "high"), "none");
	assert.equal(resolveReasoningEffort({}, "invalid"), "high");
	assert.equal(mapStopReason("toolUse"), "tool_use");
	assert.equal(mapStopReason("length"), "max_tokens");
	assert.equal(mapStopReason("stop"), "end_turn");
});

test("serves an authenticated Anthropic-compatible SSE tool response", async (t) => {
	const models = {
		stream: () => fakeEvents(),
		complete: async () => finalMessage,
	};
	const server = createGatewayServer({ models, model, token: "test-token" });
	server.listen(0, "127.0.0.1");
	await once(server, "listening");
	t.after(() => server.close());
	const { port } = server.address();

	const unauthorized = await fetch(`http://127.0.0.1:${port}/v1/messages`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ messages: [] }),
	});
	assert.equal(unauthorized.status, 401);

	const response = await fetch(`http://127.0.0.1:${port}/v1/messages?beta=true`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			authorization: "Bearer test-token",
			"anthropic-version": "2023-06-01",
		},
		body: JSON.stringify({
			model: "anything",
			stream: true,
			max_tokens: 100,
			messages: [{ role: "user", content: "test" }],
		}),
	});
	assert.equal(response.status, 200);
	assert.match(response.headers.get("content-type"), /text\/event-stream/);
	const body = await response.text();
	assert.match(body, /event: message_start/);
	assert.match(body, /"type":"tool_use","id":"tool_1","name":"Read"/);
	assert.ok(body.includes('"partial_json":"{\\"file_path\\":\\"README.md\\"}"'));
	assert.match(body, /"stop_reason":"tool_use"/);
	assert.match(body, /event: message_stop/);
});

test("credential store preserves and updates provider-scoped OAuth records", async () => {
	const directory = await import("node:fs/promises").then(({ mkdtemp }) => mkdtemp("/tmp/claude-openai-gateway-test-"));
	const path = `${directory}/auth.json`;
	const store = new JsonCredentialStore(path);
	assert.equal(await store.read("openai-codex"), undefined);
	await store.modify("openai-codex", async () => ({ type: "oauth", access: "a", refresh: "r", expires: 1 }));
	assert.equal((await store.read("openai-codex")).access, "a");
	await store.delete("openai-codex");
	assert.equal(await store.read("openai-codex"), undefined);
});
