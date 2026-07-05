import { ChatClient } from "~/backend/chats/ChatClient.ts";
import { router } from "~/router.ts";

await import("~/backend/database/migrate.ts");
await import("~/backend/handlers/agents/many.ts");
await import("~/backend/handlers/models/many.ts");
await import("~/backend/handlers/providers/create.ts");
await import("~/backend/handlers/providers/many.ts");
await import("~/backend/handlers/providers/update.ts");
await import("~/backend/handlers/providers/delete.ts");
await import("~/backend/handlers/chats/create.ts");
await import("~/backend/handlers/chats/many.ts");
await import("~/backend/handlers/chats/one.ts");
await import("~/backend/handlers/chats/update.ts");
await import("~/backend/handlers/chats/delete.ts");
await import("~/backend/handlers/chats/messages/create.ts");
await import("~/backend/handlers/chats/messages/many.ts");
await import("~/backend/handlers/chats/messages/one.ts");
await import("~/backend/handlers/chats/messages/delete.ts");

const PORT = Number(Deno.env.get("PORT") ?? 8000);
const FE_ROOT = new URL("./frontend/", import.meta.url);

const CHAT_STREAM_RE = /^\/v1\/chats\/([0-9a-f-]+)\/stream$/;

Deno.serve({
    port: PORT,
    onError: (error: unknown) => {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    },
}, (request) => {
    const url = new URL(request.url);

    const wsMatch = url.pathname.match(CHAT_STREAM_RE);
    if (wsMatch && request.headers.get("upgrade") === "websocket") {
        return handleChatStream(request, wsMatch[1]);
    }

    if (url.pathname.startsWith("/v1/")) {
        return router.resolveRequest(request);
    }
    return serveStatic(url, FE_ROOT);
});

async function handleChatStream(request: Request, chatId: string): Promise<Response> {
    const { socket, response } = Deno.upgradeWebSocket(request, { idleTimeout: 0 });
    const chat = await ChatClient.getOrLoad(chatId);
    socket.onopen = () => socket.onclose = chat.emitter.subscribe((event) => socket.send(JSON.stringify(event)));
    return response;
}

async function serveStatic(url: URL, root: URL): Promise<Response> {
    let pathname = url.pathname;
    if (pathname === "/" || pathname === "") pathname = "/index.html";
    if (pathname === "/app.js") pathname = "/dist/app.js";
    const filePath = new URL("." + pathname, root);
    if (!filePath.href.startsWith(root.href)) {
        return new Response("Forbidden", { status: 403 });
    }
    try {
        const file = await Deno.open(filePath, { read: true });
        const contentType = filePath.pathname.endsWith(".html")
            ? "text/html; charset=utf-8"
            : filePath.pathname.endsWith(".js")
            ? "application/javascript; charset=utf-8"
            : "application/octet-stream";
        return new Response(file.readable, { headers: { "Content-Type": contentType } });
    } catch {
        return new Response("Not Found", { status: 404 });
    }
}

console.log(`agentserver listening on http://localhost:${PORT}`);
