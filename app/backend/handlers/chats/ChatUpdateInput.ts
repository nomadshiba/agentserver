import { Str, StructCodec } from "@nomadshiba/codec";
import { UUID } from "~/libs/codecs/UUID.ts";

export const ChatUpdateInput = new StructCodec({
    name: Str,
    agent: Str,
    model: new StructCodec({
        name: Str,
        providerId: UUID,
    }),
}).partial();