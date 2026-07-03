import { Str, StructCodec } from "@nomadshiba/codec";
import { Url } from "~/libs/codecs/URL.ts";

export const ProviderInput = new StructCodec({
    name: Str,
    base: Url,
    key: Str,
});
