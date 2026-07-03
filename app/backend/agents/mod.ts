import { Agent } from "~/backend/agents/Agent.ts";
import { AssistantAgent } from "~/backend/agents/AssistantAgent.ts";
import { BuildAgent } from "~/backend/agents/BuildAgent.ts";

export const agents: Agent[] = [AssistantAgent, BuildAgent];
