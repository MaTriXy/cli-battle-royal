import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function specGate(pi: ExtensionAPI) {
	pi.on("tool_call", async (event) => {
		if (event.toolName !== "edit" && event.toolName !== "write") {
			return undefined;
		}

		const stateDir = join(process.cwd(), ".harness-lab");
		const marker = join(stateDir, "spec-approved");
		const eventLog = join(stateDir, "native-events.jsonl");
		mkdirSync(stateDir, { recursive: true });

		const allowed = existsSync(marker);
		appendFileSync(
			eventLog,
			`${JSON.stringify({
				at: new Date().toISOString(),
				event: "pre-edit",
				decision: allowed ? "allow" : "deny",
				...(allowed ? {} : { reason: "spec-marker-missing" }),
			})}\n`,
		);

		if (!allowed) {
			return {
				block: true,
				reason: "Publish the required short spec, then create .harness-lab/spec-approved before editing.",
			};
		}

		return undefined;
	});
}
