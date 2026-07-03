import { Agent } from "~/backend/agents/Agent.ts";
import { ScriptTool } from "~/backend/tools/ScriptTool.ts";

export const AssistantAgent = {
    name: "Assistant",
    description: "A general-purpose assistant with a scripting tool.",
    kind: "primary",
    tools: [
        new ScriptTool({ net: true, import: true }),
    ],
    prompt() {
        return [
            "You are a helpful assistant. Answer the user's questions clearly and concisely.",
            "",
            "You have access to a `script` tool that runs TypeScript in a sandboxed Deno Worker.",
            "The worker has network and import permissions but no filesystem or env access.",
            "Use it for computations, fetching data, or any code that helps answer the user.",
            "In the worker, set `self.onmessage = (e) => {...}` and call `self.postMessage(result)` to return.",
            "The `e.data` contains the optional `input` string you pass.",
        ].join("\n");
    },
} as const satisfies Agent;