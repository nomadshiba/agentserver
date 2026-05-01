import { Kysely } from "@kysely/kysely";
import { ComponentGeneric } from "~/libs/database/Schema.ts";

export async function createCollection(db: Kysely<Record<string, unknown>>, collection: ComponentGeneric) {
    const tableName = `collection_${collection.name}`;
    let query = db.schema.createTable(tableName).ifNotExists();

    await query.execute();
}
