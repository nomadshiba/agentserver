import { Codec } from "@nomadshiba/codec";
import { agents } from "~/backend/agents/mod.ts";
import { AgentOutput } from "~/backend/handlers/agents/AgentOutput.ts";
import { router } from "~/router.ts";

router.registerHandler("GET /v1/agents", () => {
    return {
        status: "OK",
        data: agents.map((agent): Codec.InferInput<typeof AgentOutput> => ({
            name: agent.name,
            description: agent.description,
            kind: {
                kind: agent.kind,
                value: null,
            },
        })),
    };
});
