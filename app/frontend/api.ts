import { Codec } from "@nomadshiba/codec";
import { ChatMessageOutput } from "~/backend/handlers/chats/messages/ChatMessageOutput.ts";
import { ChatStreamOutput } from "~/backend/handlers/chats/messages/ChatStreamOutput.ts";
import { RouterClient } from "~/libs/routing/RouterClient.ts";
import { RoutesSchema } from "~/routes.ts";

export type ChatMessage = Codec.InferOutput<typeof ChatMessageOutput>;
export type ChatAssistantMessage = ChatMessage & { content: { kind: "assistant" } };
export type ChatToolMessage = ChatMessage & { content: { kind: "tool" } };
export type ChatStream = Codec.InferOutput<typeof ChatStreamOutput>;
export type ChatAssistantMessageStream = (ChatStream & { kind: "stream" })["value"];

export const api = RouterClient.create<RoutesSchema>({
    baseUrl: new URL("/", location.origin),
    schema: RoutesSchema,
    fetch: fetch.bind(window),
});
