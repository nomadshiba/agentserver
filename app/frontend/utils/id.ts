import { Str } from "@nomadshiba/codec";
import { sha1 } from "@noble/hashes/legacy.js";
import { encodeHex } from "@std/encoding";

export function toDOMFriendlyId(id: string) {
    return encodeHex(sha1(Str.encode(id)).slice(-4));
}
