import { Tool } from "~/backend/tools/Tool.ts";

export type AgentKind = "primary" | "subagent" | "all";

export type Agent = {
    name: string;
    description: string;
    kind: AgentKind;
    tools: Tool[];
    prompt: string;
};
