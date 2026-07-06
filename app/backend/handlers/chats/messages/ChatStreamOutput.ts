import { EnumCodec, ModelCodec, NullableCodec, Str, StructCodec, VarInt } from "@nomadshiba/codec";
import { ChatMessageOutput } from "~/backend/handlers/chats/messages/ChatMessageOutput.ts";

export const ChatStreamOutput = new EnumCodec({
    message: ChatMessageOutput,
    stream: new EnumCodec({
        text: Str,
        refusal: Str,
        tool_call: new ModelCodec({ index: VarInt, "id?": Str, "name?": Str, "arguments?": Str }),
        done: new StructCodec({ finish_reason: new NullableCodec(Str) }),
    }),
});
