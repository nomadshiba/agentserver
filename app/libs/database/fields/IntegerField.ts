import { Field } from "~/libs/database/Schema.ts";

export type IntegerField = Field<bigint>;
export function IntegerField(): IntegerField {
    return {
        columns(name) {
            return [{ name, type: "integer" }];
        },
        toRow(name, value) {
            return { [name]: value };
        },
        fromRow(name, row) {
            const value = row[name];
            if (typeof value === "bigint") return value;
            if (typeof value === "string") return BigInt(value);
            if (typeof value === "number") return BigInt(value);
            throw new Error(`Unhandled value type: ${typeof value}`);
        },
    };
}
