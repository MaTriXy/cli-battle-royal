#!/usr/bin/env node

import { createHash, randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { realpathSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { builtinModels } from "@earendil-works/pi-ai/providers/all";
import { configureHttpDispatcher } from "../dist/core/http-dispatcher.js";

const MAX_REQUEST_BYTES = 32 * 1024 * 1024;
const ALLOWED_EFFORTS = new Set(["none", "minimal", "low", "medium", "high", "xhigh", "max"]);

const emptyUsage = () => ({
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0,
	totalTokens: 0,
	cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
});

const contentArray = (content) => {
	if (typeof content === "string") return [{ type: "text", text: content }];
	return Array.isArray(content) ? content : [];
};

const toPiContent = (content) => {
	const result = [];
	for (const block of contentArray(content)) {
		if (block?.type === "text" && typeof block.text === "string") {
			result.push({ type: "text", text: block.text });
			continue;
		}
		if (block?.type === "image" && block.source?.type === "base64") {
			result.push({
				type: "image",
				data: String(block.source.data ?? ""),
				mimeType: String(block.source.media_type ?? "application/octet-stream"),
			});
			continue;
		}
		if (block?.type === "document" && block.source?.type === "text") {
			result.push({ type: "text", text: String(block.source.data ?? "") });
		}
	}
	return result;
};

const systemText = (system) => contentArray(system)
	.filter((block) => block?.type === "text" && typeof block.text === "string")
	.map((block) => block.text)
	.join("\n\n");

const assistantMessage = (blocks, model, timestamp) => {
	const content = [];
	for (const block of contentArray(blocks)) {
		if (block?.type === "text" && typeof block.text === "string") {
			content.push({ type: "text", text: block.text });
			continue;
		}
		if (block?.type === "tool_use" && typeof block.name === "string") {
			content.push({
				type: "toolCall",
				id: String(block.id ?? `tool_${randomUUID()}`),
				name: block.name,
				arguments: block.input && typeof block.input === "object" ? block.input : {},
			});
		}
	}
	if (content.length === 0) return null;
	return {
		role: "assistant",
		content,
		api: model.api,
		provider: model.provider,
		model: model.id,
		usage: emptyUsage(),
		stopReason: content.some((block) => block.type === "toolCall") ? "toolUse" : "stop",
		timestamp,
	};
};

export function anthropicRequestToPiContext(body, model) {
	const messages = [];
	const toolNames = new Map();
	let timestamp = Date.now() - Math.max(1, body.messages?.length ?? 1) * 10;

	const pushUser = (parts) => {
		if (parts.length === 0) return;
		messages.push({ role: "user", content: parts, timestamp: timestamp++ });
	};

	for (const message of Array.isArray(body.messages) ? body.messages : []) {
		if (message?.role === "assistant") {
			const converted = assistantMessage(message.content, model, timestamp++);
			if (!converted) continue;
			for (const block of converted.content) {
				if (block.type === "toolCall") toolNames.set(block.id, block.name);
			}
			messages.push(converted);
			continue;
		}

		if (message?.role !== "user") continue;
		const pendingUserParts = [];
		for (const block of contentArray(message.content)) {
			if (block?.type !== "tool_result") {
				pendingUserParts.push(...toPiContent([block]));
				continue;
			}

			pushUser(pendingUserParts.splice(0));
			const toolCallId = String(block.tool_use_id ?? "unknown_tool_call");
			const resultContent = toPiContent(block.content);
			messages.push({
				role: "toolResult",
				toolCallId,
				toolName: toolNames.get(toolCallId) ?? "unknown_tool",
				content: resultContent.length > 0 ? resultContent : [{ type: "text", text: "(no tool output)" }],
				isError: block.is_error === true,
				timestamp: timestamp++,
			});
		}
		pushUser(pendingUserParts);
	}

	const tools = (Array.isArray(body.tools) ? body.tools : [])
		.filter((tool) => tool && typeof tool.name === "string")
		.map((tool) => ({
			name: tool.name,
			description: typeof tool.description === "string" ? tool.description : "",
			parameters: tool.input_schema && typeof tool.input_schema === "object"
				? tool.input_schema
				: { type: "object", properties: {}, additionalProperties: true },
		}));

	return {
		systemPrompt: systemText(body.system),
		messages,
		...(tools.length > 0 ? { tools } : {}),
	};
}

export function resolveReasoningEffort(body, fallback = "high") {
	const requested = body?.output_config?.effort;
	if (typeof requested === "string" && ALLOWED_EFFORTS.has(requested)) return requested;
	if (body?.thinking?.type === "disabled") return "none";
	return ALLOWED_EFFORTS.has(fallback) ? fallback : "high";
}

export function mapStopReason(reason) {
	switch (reason) {
		case "toolUse": return "tool_use";
		case "length": return "max_tokens";
		default: return "end_turn";
	}
}

const anthropicUsage = (usage = emptyUsage()) => ({
	input_tokens: Number(usage.input ?? 0),
	cache_creation_input_tokens: Number(usage.cacheWrite ?? 0),
	cache_read_input_tokens: Number(usage.cacheRead ?? 0),
	output_tokens: Number(usage.output ?? 0),
});

const writeSse = (response, event, data) => {
	if (response.destroyed || response.writableEnded) return;
	response.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
};

const jsonResponse = (response, status, value) => {
	const body = `${JSON.stringify(value)}\n`;
	response.writeHead(status, {
		"content-type": "application/json",
		"content-length": Buffer.byteLength(body),
	});
	response.end(body);
};

const apiError = (response, status, type, message) => jsonResponse(response, status, {
	type: "error",
	error: { type, message },
});

const readJsonBody = async (request) => {
	const chunks = [];
	let size = 0;
	for await (const chunk of request) {
		size += chunk.length;
		if (size > MAX_REQUEST_BYTES) throw new Error("Request body exceeds the lab gateway limit");
		chunks.push(chunk);
	}
	return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

const isAuthorized = (request, token) => {
	if (!token) return false;
	return request.headers.authorization === `Bearer ${token}` || request.headers["x-api-key"] === token;
};

const messageEnvelope = (messageId, model, usage = emptyUsage()) => ({
	id: messageId,
	type: "message",
	role: "assistant",
	content: [],
	model,
	stop_reason: null,
	stop_sequence: null,
	usage: anthropicUsage(usage),
});

const ensureParent = async (path) => {
	if (path) await mkdir(dirname(path), { recursive: true });
};

const writeResolvedModel = async (path, model) => {
	if (!path || !model) return;
	await ensureParent(path);
	await writeFile(path, `${model}\n`, { mode: 0o600 });
};

const visibleBlocks = (message) => message.content.flatMap((block) => {
	if (block.type === "text") return [{ type: "text", text: block.text }];
	if (block.type === "toolCall") {
		return [{ type: "tool_use", id: block.id, name: block.name, input: block.arguments ?? {} }];
	}
	return [];
});

async function streamAnthropicResponse({ response, events, messageId, responseModel }) {
	response.writeHead(200, {
		"content-type": "text/event-stream",
		"cache-control": "no-cache",
		connection: "keep-alive",
	});
	writeSse(response, "message_start", {
		type: "message_start",
		message: messageEnvelope(messageId, responseModel),
	});

	const indexMap = new Map();
	const toolDeltaBytes = new Map();
	let nextIndex = 0;
	let visibleBlockCount = 0;
	let finalMessage = null;

	const blockIndex = (piIndex) => {
		if (!indexMap.has(piIndex)) indexMap.set(piIndex, nextIndex++);
		return indexMap.get(piIndex);
	};

	try {
		for await (const event of events) {
			switch (event.type) {
				case "text_start": {
					const index = blockIndex(event.contentIndex);
					visibleBlockCount += 1;
					writeSse(response, "content_block_start", {
						type: "content_block_start",
						index,
						content_block: { type: "text", text: "" },
					});
					break;
				}
				case "text_delta":
					writeSse(response, "content_block_delta", {
						type: "content_block_delta",
						index: blockIndex(event.contentIndex),
						delta: { type: "text_delta", text: event.delta },
					});
					break;
				case "text_end":
					writeSse(response, "content_block_stop", {
						type: "content_block_stop",
						index: blockIndex(event.contentIndex),
					});
					break;
				case "toolcall_start": {
					const toolCall = event.partial?.content?.[event.contentIndex];
					if (!toolCall || toolCall.type !== "toolCall") break;
					const index = blockIndex(event.contentIndex);
					visibleBlockCount += 1;
					toolDeltaBytes.set(event.contentIndex, 0);
					writeSse(response, "content_block_start", {
						type: "content_block_start",
						index,
						content_block: { type: "tool_use", id: toolCall.id, name: toolCall.name, input: {} },
					});
					break;
				}
				case "toolcall_delta":
					toolDeltaBytes.set(event.contentIndex, (toolDeltaBytes.get(event.contentIndex) ?? 0) + event.delta.length);
					writeSse(response, "content_block_delta", {
						type: "content_block_delta",
						index: blockIndex(event.contentIndex),
						delta: { type: "input_json_delta", partial_json: event.delta },
					});
					break;
				case "toolcall_end": {
					if ((toolDeltaBytes.get(event.contentIndex) ?? 0) === 0) {
						writeSse(response, "content_block_delta", {
							type: "content_block_delta",
							index: blockIndex(event.contentIndex),
							delta: { type: "input_json_delta", partial_json: JSON.stringify(event.toolCall.arguments ?? {}) },
						});
					}
					writeSse(response, "content_block_stop", {
						type: "content_block_stop",
						index: blockIndex(event.contentIndex),
					});
					break;
				}
				case "done":
					finalMessage = event.message;
					break;
				case "error":
					throw new Error(event.error?.errorMessage || "OpenAI Codex provider request failed");
				default:
					break;
			}
		}

		if (!finalMessage) throw new Error("OpenAI Codex provider stream ended without a final message");
		if (visibleBlockCount === 0) {
			writeSse(response, "content_block_start", {
				type: "content_block_start",
					index: 0,
					content_block: { type: "text", text: "" },
			});
			writeSse(response, "content_block_stop", { type: "content_block_stop", index: 0 });
		}

		writeSse(response, "message_delta", {
			type: "message_delta",
			delta: { stop_reason: mapStopReason(finalMessage.stopReason), stop_sequence: null },
			usage: anthropicUsage(finalMessage.usage),
		});
		writeSse(response, "message_stop", { type: "message_stop" });
		response.end();
		return finalMessage;
	} catch (error) {
		writeSse(response, "error", {
			type: "error",
			error: { type: "api_error", message: error instanceof Error ? error.message : String(error) },
		});
		response.end();
		throw error;
	}
}

const nonStreamingResponse = (message, messageId, responseModel) => ({
	id: messageId,
	type: "message",
	role: "assistant",
	content: visibleBlocks(message),
	model: responseModel,
	stop_reason: mapStopReason(message.stopReason),
	stop_sequence: null,
	usage: anthropicUsage(message.usage),
});

export class JsonCredentialStore {
	constructor(path) {
		this.path = path;
		this.queue = Promise.resolve();
	}

	async #load() {
		try {
			const parsed = JSON.parse(await readFile(this.path, "utf8"));
			return parsed && typeof parsed === "object" ? parsed : {};
		} catch (error) {
			if (error?.code === "ENOENT") return {};
			throw error;
		}
	}

	async read(providerId) {
		return (await this.#load())[providerId];
	}

	async modify(providerId, fn) {
		const operation = this.queue.then(async () => {
			const data = await this.#load();
			const next = await fn(data[providerId]);
			if (next === undefined) return data[providerId];
			data[providerId] = next;
			await ensureParent(this.path);
			const temp = `${this.path}.${process.pid}.${randomUUID()}.tmp`;
			await writeFile(temp, `${JSON.stringify(data, null, 2)}\n`, { mode: 0o600 });
			await rename(temp, this.path);
			return next;
		});
		this.queue = operation.catch(() => undefined);
		return operation;
	}

	async delete(providerId) {
		const operation = this.queue.then(async () => {
			const data = await this.#load();
			delete data[providerId];
			await ensureParent(this.path);
			const temp = `${this.path}.${process.pid}.${randomUUID()}.tmp`;
			await writeFile(temp, `${JSON.stringify(data, null, 2)}\n`, { mode: 0o600 });
			await rename(temp, this.path);
		});
		this.queue = operation.catch(() => undefined);
		return operation;
	}
}

export function createGatewayServer({
	models,
	model,
	token,
	fallbackEffort = "high",
	transport = "sse",
	sessionId = randomUUID(),
	tracePath = "",
	resolvedModelPath = "",
}) {
	let requestNumber = 0;
	const trace = async (event) => {
		if (!tracePath) return;
		await ensureParent(tracePath);
		await appendFile(tracePath, `${JSON.stringify({ timestamp: new Date().toISOString(), ...event })}\n`, { mode: 0o600 });
	};

	return createServer(async (request, response) => {
		const url = new URL(request.url ?? "/", "http://gateway.local");
		if (request.method === "HEAD" && url.pathname === "/") {
			response.writeHead(200);
			response.end();
			return;
		}
		if (request.method === "GET" && url.pathname === "/health") {
			jsonResponse(response, 200, { status: "ok", provider: model.provider, model: model.id });
			return;
		}
		if (request.method === "POST" && url.pathname === "/v1/messages/count_tokens") {
			apiError(response, 404, "not_found_error", "Token counting is intentionally delegated to Claude Code");
			return;
		}
		if (request.method !== "POST" || url.pathname !== "/v1/messages") {
			apiError(response, 404, "not_found_error", "Unknown lab gateway endpoint");
			return;
		}
		if (!isAuthorized(request, token)) {
			apiError(response, 401, "authentication_error", "Invalid lab gateway credential");
			return;
		}

		const currentRequest = ++requestNumber;
		const started = Date.now();
		let body;
		try {
			body = await readJsonBody(request);
		} catch (error) {
			apiError(response, 400, "invalid_request_error", error instanceof Error ? error.message : String(error));
			return;
		}

		const effort = resolveReasoningEffort(body, fallbackEffort);
		const context = anthropicRequestToPiContext(body, model);
		const messageId = `msg_${randomUUID().replaceAll("-", "")}`;
		const requestSessionId = createHash("sha256").update(sessionId).digest("hex");
		const maxTokens = Number.isFinite(body.max_tokens)
			? Math.max(1, Math.min(Number(body.max_tokens), model.maxTokens))
			: model.maxTokens;
		const options = {
			maxTokens,
			reasoningEffort: effort,
			reasoningSummary: "auto",
			transport,
			sessionId: requestSessionId,
		};

		await trace({
			type: "request_start",
			requestNumber: currentRequest,
			requestedModel: body.model ?? null,
			forcedProvider: model.provider,
			forcedModel: model.id,
			reasoningEffort: effort,
			upstreamTransport: transport,
			stream: body.stream === true,
			messageCount: context.messages.length,
			toolCount: context.tools?.length ?? 0,
			systemChars: context.systemPrompt?.length ?? 0,
		});

		try {
			let finalMessage;
			if (body.stream === true) {
				const events = models.stream(model, context, options);
				finalMessage = await streamAnthropicResponse({
					response,
					events,
					messageId,
					responseModel: model.id,
				});
			} else {
				finalMessage = await models.complete(model, context, options);
				if (finalMessage.stopReason === "error" || finalMessage.stopReason === "aborted") {
					throw new Error(finalMessage.errorMessage || "OpenAI Codex provider request failed");
				}
				jsonResponse(response, 200, nonStreamingResponse(finalMessage, messageId, model.id));
			}

			const resolvedModel = finalMessage.responseModel || finalMessage.model || model.id;
			await writeResolvedModel(resolvedModelPath, resolvedModel);
			await trace({
				type: "request_end",
				requestNumber: currentRequest,
				durationMs: Date.now() - started,
				resolvedProvider: finalMessage.provider,
				resolvedModel,
				stopReason: finalMessage.stopReason,
				usage: finalMessage.usage,
			});
		} catch (error) {
			await trace({
				type: "request_error",
				requestNumber: currentRequest,
				durationMs: Date.now() - started,
				errorType: error?.constructor?.name ?? "Error",
			});
			if (!response.headersSent) {
				apiError(response, 500, "api_error", error instanceof Error ? error.message : String(error));
			}
		}
	});
}

async function main() {
	const host = process.env.CLAUDE_OPENAI_GATEWAY_HOST ?? "127.0.0.1";
	const port = Number(process.env.CLAUDE_OPENAI_GATEWAY_PORT ?? "8788");
	const provider = process.env.CLAUDE_OPENAI_GATEWAY_PROVIDER ?? "openai-codex";
	const modelId = process.env.CLAUDE_OPENAI_GATEWAY_MODEL ?? "gpt-5.6-sol";
	const token = process.env.CLAUDE_OPENAI_GATEWAY_TOKEN ?? "";
	const authPath = process.env.CLAUDE_OPENAI_GATEWAY_AUTH_FILE ?? resolve(process.env.HOME ?? ".", ".pi/agent/auth.json");
	const tracePath = process.env.CLAUDE_OPENAI_GATEWAY_TRACE ?? "";
	const resolvedModelPath = process.env.CLAUDE_OPENAI_GATEWAY_RESOLVED_MODEL_FILE ?? "";
	const fallbackEffort = process.env.CLAUDE_OPENAI_GATEWAY_EFFORT ?? "high";
	const transport = process.env.CLAUDE_OPENAI_GATEWAY_TRANSPORT ?? "sse";

	if (!token) throw new Error("CLAUDE_OPENAI_GATEWAY_TOKEN is required");
	if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid gateway port");
	configureHttpDispatcher();

	const credentials = new JsonCredentialStore(authPath);
	const models = builtinModels({ credentials });
	const model = models.getModel(provider, modelId);
	if (!model) throw new Error(`Unknown Pi AI model: ${provider}/${modelId}`);
	const auth = await models.getAuth(model);
	if (!auth) throw new Error(`No OAuth credential configured for ${provider}`);

	const server = createGatewayServer({
		models,
		model,
		token,
		fallbackEffort,
		transport,
		tracePath,
		resolvedModelPath,
	});
	server.listen(port, host, () => {
		process.stdout.write(`${JSON.stringify({ status: "ready", host, port, provider, model: modelId, authSource: auth.source })}\n`);
	});

	const stop = () => server.close(() => process.exit(0));
	process.on("SIGINT", stop);
	process.on("SIGTERM", stop);
}

const isMain = process.argv[1]
	&& realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
if (isMain) {
	main().catch(async (error) => {
		process.stderr.write(`claude-openai-gateway: ${error instanceof Error ? error.stack : String(error)}\n`);
		await rm(process.env.CLAUDE_OPENAI_GATEWAY_READY_FILE ?? "", { force: true }).catch(() => undefined);
		process.exit(1);
	});
}
