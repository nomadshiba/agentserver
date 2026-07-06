import { Codec } from "@nomadshiba/codec";
import { db } from "~/backend/database/client.ts";
import { router } from "~/router.ts";
import { ChatOutput } from "~/backend/handlers/chats/ChatOutput.ts";

router.registerHandler("GET /v1/chats/:chatId", async ({ params }) => {
    const id = params.pathname.chatId;

    const row = await db.selectFrom("chat")
        .where("chat.id", "=", id)
        .selectAll("chat")
        .executeTakeFirst();

    if (!row) {
        return { status: "NotFound" };
    }

    const chat: Codec.InferInput<typeof ChatOutput> = {
        id: row.id,
        name: row.name,
        root_tool_call_id: row.root_tool_call_id ?? undefined,
        agent: row.agent,
        model: row.model && row.provider_id ? { name: row.model, providerId: row.provider_id } : undefined,
        created: row.created,
        updated: row.updated,
    };

    return {
        status: "OK",
        data: chat,
    };
});
