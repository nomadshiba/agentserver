import { OptionalCodec, Str, StructCodec, UnionCodec } from "@nomadshiba/codec";
import { Url } from "~/libs/codecs/URL.ts";

const ConnectionInput = new UnionCodec({
    oai: new StructCodec({
        base: Url,
        key: Str,
    }),
});

export const ProviderInput = new StructCodec({
    name: Str,
    connection: ConnectionInput,
});

export const ProviderPartialInput = new StructCodec({
    name: new OptionalCodec(Str),
    connection: new OptionalCodec(ConnectionInput),
});
