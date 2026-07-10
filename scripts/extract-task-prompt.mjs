#!/usr/bin/env node

import { readFileSync } from "node:fs";

const [taskFile] = process.argv.slice(2);
if (!taskFile) {
	console.error("Usage: extract-task-prompt.mjs <task-markdown>");
	process.exit(1);
}

const source = readFileSync(taskFile, "utf8");
const match = source.match(/## Exact Prompt\s+```text\n([\s\S]*?)\n```/);
if (!match) {
	console.error(`No exact text prompt found in ${taskFile}`);
	process.exit(1);
}

process.stdout.write(`${match[1]}\n`);
