import { db } from "~/backend/database/client.ts";
import { RouteHandlerResult } from "~/libs/Router.ts";
import { router } from "~/router.ts";
import { RoutesSchema } from "~/routes.ts";

router.registerHandler("POST /v1/chats/:chatId/messages", async ({ params, data }) => {
    const chatId = params.pathname.chatId;
    const id = crypto.randomUUID();
    const now = Date.now();

    return await db.transaction().execute(async (tx): Promise<RouteHandlerResult<RoutesSchema, "POST /v1/chats/:chatId/messages">> => {
        await tx.insertInto("chat_message")
            .values({ id, chat_id: chatId, role: "user", created: now })
            .execute();

        await tx.insertInto("chat_message_role_user")
            .values({ id, content: data.content })
            .execute();

        return { status: "OK", data: null };
    });
});
