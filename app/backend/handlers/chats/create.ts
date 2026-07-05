import { ChatClient } from "~/backend/chats/ChatClient.ts";
import { RouteHandlerResult } from "~/libs/routing/Router.ts";
import { router } from "~/router.ts";
import { RoutesSchema } from "~/routes.ts";

router.registerHandler("POST /v1/chats", async ({ data }) => {
    const chat = await ChatClient.create(data.name);
    return {
        status: "OK",
        data: { id: chat.id },
    } satisfies RouteHandlerResult<RoutesSchema, "POST /v1/chats">;
});
