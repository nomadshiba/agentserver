import { runAgent } from "~/backend/agents/run.ts";
import { chatBus } from "~/backend/agents/chatBus.ts";
import { agents } from "~/backend/agents/mod.ts";
import { db } from "~/backend/database/client.ts";
import { ProviderClient } from "~/backend/providers/ProviderClient.ts";
import { router } from "~/router.ts";

router.registerHandler("POST /v1/chats/:chatId/messages", async ({ params, data }) => {
    const chatId = params.pathname.chatId;
    const id = crypto.randomUUID();
    const now = Date.now();

    await db.transaction().execute(async (tx) => {
        await tx.insertInto("chat_message")
            .values({ id, chat_id: chatId, role: "user", created: now })
            .execute();

        await tx.insertInto("chat_message_role_user")
            .values({ id, content: data.content })
            .execute();
    });

    chatBus.emit(chatId, { kind: "user_message", value: { id, content: data.content } });

    const settings = await db.selectFrom("settings")
        .where("settings.id", "=", 0)
        .selectAll("settings")
        .executeTakeFirst();

    const providerId = settings?.last_provider_id;
    const modelId = settings?.last_model_id;
    if (!providerId || !modelId) {
        return { status: "OK", data: null } as const;
    }

    const providerRow = await db.selectFrom("provider")
        .where("provider.id", "=", providerId)
        .selectAll("provider")
        .executeTakeFirst();
    if (!providerRow) {
        return { status: "OK", data: null } as const;
    }

    const agent = agents.find((a) => a.name === settings?.last_agent) ?? agents[0];
    const client = ProviderClient.create({ base: providerRow.base, key: providerRow.key });

    runAgent({ chatId, client, model: modelId, agent }).catch((error) => {
        console.error("agent run failed:", error);
        chatBus.emit(chatId, { kind: "error", value: { message: String(error) } });
    });

    return { status: "OK", data: null } as const;
});