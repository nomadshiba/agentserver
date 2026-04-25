import { db } from "~/database/client.ts";
import { router } from "~/router.ts";
import { RouteHandlerResult } from "~/libs/Router.ts";
import { RoutesSchema } from "~/routes.ts";

router.registerHandler("POST /v1/providers", async ({ data }) => {
    const id = crypto.randomUUID();
    const now = Date.now();

    return await db.transaction().execute(async (tx): Promise<RouteHandlerResult<RoutesSchema, "POST /v1/providers">> => {
        await tx.insertInto("provider")
            .values({
                id,
                name: data.name,
                connection_kind: data.connection.kind,
                created: now,
                updated: now,
            })
            .execute();

        if (data.connection.kind === "oai") {
            await tx.insertInto("provider_connection_kind_oai")
                .values({
                    id,
                    base: data.connection.value.base.href,
                    key: data.connection.value.key,
                })
                .execute();
        } else {
            return {
                status: "BadRequest",
                message: `Invalid connection kind: ${data.connection.kind satisfies never}`,
            };
        }

        return {
            status: "OK",
            data: {
                id,
                name: data.name,
                connection: data.connection,
                created: now,
                updated: now,
            },
        };
    });
});
