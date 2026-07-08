import { Codec, EnumCodec } from "@nomadshiba/codec";
import { ChatAssistantMessageStream } from "~/backend/handlers/chats/messages/ChatAssistantMessageStream.ts";
import { ChatMessageOutput } from "~/backend/handlers/chats/messages/ChatMessageOutput.ts";

export type ChatStreamOutput = Codec.InferOutput<typeof ChatStreamOutput>;
export const ChatStreamOutput = new EnumCodec({
    message: ChatMessageOutput,
    stream: ChatAssistantMessageStream,
});
