import { Field } from "~/libs/database/Schema.ts";
import { StructFieldGeneric, StructFieldInfer } from "~/libs/database/fields/StructField.ts";

export type ReferenceField<T extends StructFieldGeneric> = Field<{ get(): Promise<StructFieldInfer<T>> }> & { component: T };
export function ReferenceField<T extends StructFieldGeneric>(component: T): ReferenceField<T> {
    return {
        component,
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
