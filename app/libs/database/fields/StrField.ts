import { Field } from "~/libs/database/Schema.ts";

export type StringField = Field<string>;
export function StringField(): StringField {
    return {
        columns(name) {
            return [{ name, type: "text" }];
        },
        toRow(name, value) {
            return { [name]: value };
        },
        fromRow(name, row) {
            return String(row[name]);
        },
    };
}
