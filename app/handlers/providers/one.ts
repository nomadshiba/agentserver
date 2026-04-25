import { jsonObjectFrom } from "@kysely/kysely/helpers/sqlite";
import { Codec } from "@nomadshiba/codec";
import { db } from "~/database/client.ts";
import { ProviderOutput } from "~/handlers/providers/ProviderOutput.ts";
import { router } from "~/router.ts";

router.registerHandler("GET /v1/providers/:providerId", async ({ params }) => {
    const row = await db.selectFrom("provider")
        .where("provider.id", "=", params.pathname.providerId)
        .selectAll("provider")
        .select((eb) => [
            jsonObjectFrom(
                eb.selectFrom("provider_connection_kind_oai")
                    .whereRef("provider_connection_kind_oai.id", "=", "provider.id")
                    .selectAll("provider_connection_kind_oai"),
            ).$notNull().as("Connection"),
        ])
        .executeTakeFirst();

    if (!row) {
        return { status: "NotFound" };
    }

    let connection: Codec.InferInput<typeof ProviderOutput>["connection"] | undefined;
    if (row.connection_kind === "oai") {
        connection = {
            kind: "oai",
            value: {
                base: row.Connection.base,
                key: row.Connection.key,
            },
        };
    } else {
        return {
            status: "NotImplemented",
            message: `Connection kind not implemented: ${row.connection_kind}`,
        };
    }

    return {
        status: "OK",
        data: {
            id: row.id,
            name: row.name,
            connection,
            created: row.created,
            updated: row.updated,
        },
    };
});
