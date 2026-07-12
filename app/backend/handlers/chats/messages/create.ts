import { ChatClient } from "~/backend/chats/ChatClient.ts";
import { router } from "~/router.ts";

router.registerHandler("POST /v1/chats/:chatId/messages", async ({ params, data }) => {
    const chatId = params.pathname.chatId;
    const chat = await ChatClient.getOrLoad(chatId);
    await chat.queueUserMessage(data.content);
    void chat.startAgent();

    return { status: "OK", data: null } as const;
});
