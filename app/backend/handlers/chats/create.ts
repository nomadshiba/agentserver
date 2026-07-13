import { ChatClient } from "~/backend/chats/ChatClient.ts";
import { RouteHandlerResult } from "~/libs/routing/Router.ts";
import { router } from "~/router.ts";
import { RoutesSchema } from "~/routes.ts";
import { agentsByName } from "~/backend/agents/mod.ts";

router.registerHandler("POST /v1/chats", async ({ data }) => {
    const agent = agentsByName.get(data.agent);
    if (!agent) {
        throw new Error(`agent with name ${data.agent} can't be found`);
    }
    const chat = await ChatClient.create({
        name: data.name,
        model: data.model,
        agent,
    });
    return {
        status: "OK",
        data: { id: chat.id },
    } satisfies RouteHandlerResult<RoutesSchema, "POST /v1/chats">;
});
