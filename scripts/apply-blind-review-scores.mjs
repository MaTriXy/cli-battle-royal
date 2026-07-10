#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const [packetRootInput] = process.argv.slice(2);
if (!packetRootInput) {
	console.error("Usage: apply-blind-review-scores.mjs <blind-review-packet-directory>");
	process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packetRoot = resolve(packetRootInput).replace(/\/$/, "");
const mapping = JSON.parse(readFileSync(join(packetRoot, "mapping.private.json"), "utf8"));
const dimensions = [
	"Correctness",
	"Repository fit",
	"Scope discipline",
	"Verification quality",
	"Handoff quality",
];
const parsedReviews = [];

for (const item of mapping) {
	const reviewPath = join(packetRoot, item.label, "review.md");
	const reviewText = readFileSync(reviewPath, "utf8");
	const reviewer = reviewText.match(/^Reviewer:\s*`([^`]+)`$/m)?.[1]?.trim();
	if (!reviewer || reviewer === "unreviewed") {
		throw new Error(`${item.label}: reviewer is missing`);
	}

	const scores = dimensions.map((dimension) => {
		const escaped = dimension.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const match = reviewText.match(new RegExp(`^\\| ${escaped} \\|\\s*([1-5])\\s*\\|\\s*(.*?)\\s*\\|$`, "m"));
		if (!match) throw new Error(`${item.label}: missing score for ${dimension}`);
		const score = Number(match[1]);
		const evidence = match[2].trim();
		if (score < 5 && !evidence) throw new Error(`${item.label}: ${dimension} needs evidence for score ${score}`);
		return { dimension, score, evidence };
	});
	parsedReviews.push({ ...item, reviewer, scores });
}

for (const review of parsedReviews) {
	const capture = join(root, "captures", review.harness, review.runId);
	const scorecardPath = join(capture, "scorecard.md");
	const manifestPath = join(capture, "manifest.json");
	let scorecard = readFileSync(scorecardPath, "utf8")
		.replace(/Reviewer: `[^`]+`/, `Reviewer: \`${review.reviewer}\``)
		.replace(/\n## Blind Output Review[\s\S]*$/, "");
	scorecard += `\n## Blind Output Review\n\nBlind label: \`${review.label}\`\n\n| Dimension | Score | Evidence for scores below 5 |\n| --- | ---: | --- |\n${review.scores.map(({ dimension, score, evidence }) => `| ${dimension} | ${score} | ${evidence} |`).join("\n")}\n`;
	writeFileSync(scorecardPath, scorecard);

	const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
	manifest.review = {
		reviewer: review.reviewer,
		blindLabel: review.label,
		dimensions: Object.fromEntries(review.scores.map(({ dimension, score }) => [dimension, score])),
	};
	manifest.artifacts["scorecard.md"] = {
		sha256: createHash("sha256").update(readFileSync(scorecardPath)).digest("hex"),
		bytes: statSync(scorecardPath).size,
	};
	writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

console.log(`applied_reviews=${parsedReviews.length}`);
