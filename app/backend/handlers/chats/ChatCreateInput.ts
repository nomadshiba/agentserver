import { Str, StructCodec } from "@nomadshiba/codec";

export const ChatCreateInput = new StructCodec({
    name: Str,
});
