import { Tool } from "~/backend/tools/Tool.ts";
import type { LoadedMessage } from "~/backend/agents/run.ts";

export type AgentKind = "primary" | "subagent" | "all";

export type Agent = {
    name: string;
    description: string;
    kind: AgentKind;
    tools: Tool[];
    prompt(history: LoadedMessage[]): Promise<string> | string;
};
