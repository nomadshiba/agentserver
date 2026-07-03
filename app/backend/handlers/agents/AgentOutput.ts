import { Codec, Str, StructCodec, UnionCodec, Void } from "@nomadshiba/codec";

export type Agent = Codec.InferOutput<typeof AgentOutput>;
export const AgentOutput = new StructCodec({
    name: Str,
    description: Str,
    kind: new UnionCodec({
        primary: Void,
        subagent: Void,
        all: Void,
    }),
});
