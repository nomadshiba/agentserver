import { StructCodec } from "@nomadshiba/codec";
import { UUID } from "~/libs/codecs/UUID.ts";

export const ChatCreateResult = new StructCodec({
    id: UUID,
});
