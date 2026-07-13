import { router } from "~/router.ts";
import { ChatClient } from "~/backend/chats/ChatClient.ts";

router.registerHandler("POST /v1/chats/:chatId/abort", async ({ params }) => {
    const chat = await ChatClient.getOrLoad(params.pathname.chatId);
    chat.abortAgent();
    return { status: "OK", data: null } as const;
});
