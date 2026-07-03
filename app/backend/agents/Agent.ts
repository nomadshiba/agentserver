import { ChatMessage } from "~/backend/database/generated/types.ts";
import { Tool } from "~/backend/tools/Tool.ts";

export type AgentKind = "primary" | "subagent" | "all";

export type Agent = {
    name: string;
    description: string;
    kind: AgentKind;
    tools: Tool[];
    prompt(history: ChatMessage[]): Promise<string> | string;
};
