import { Codec } from "@nomadshiba/codec";
import { ChatMessageOutput } from "~/backend/handlers/chats/messages/ChatMessageOutput.ts";
import { ChatStreamOutput } from "~/backend/handlers/chats/messages/ChatStreamOutput.ts";
import { RouterClient } from "~/libs/routing/RouterClient.ts";
import { RoutesSchema } from "~/routes.ts";

export type MessageOutput = Codec.InferOutput<typeof ChatMessageOutput>;
export type ToolCallOutput = (MessageOutput["content"] & { kind: "assistant" })["value"]["tool_calls"][number];
export type ChatStreamEvent = Codec.InferOutput<typeof ChatStreamOutput>;

export const api = RouterClient.create<RoutesSchema>({
    baseUrl: new URL("/", location.origin),
    schema: RoutesSchema,
    fetch: fetch.bind(window),
});
