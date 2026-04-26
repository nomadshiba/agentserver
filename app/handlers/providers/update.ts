import { Updateable } from "@kysely/kysely";
import { db } from "~/database/client.ts";
import { Provider } from "~/database/generated/types.ts";
import { RouteHandlerResult } from "~/libs/Router.ts";
import { router } from "~/router.ts";
import { RoutesSchema } from "~/routes.ts";

router.registerHandler("PATCH /v1/providers/:providerId", async ({ params, data }) => {
    const id = params.pathname.providerId;
    const now = Date.now();

    return await db.transaction().execute(async (tx): Promise<RouteHandlerResult<RoutesSchema, "PATCH /v1/providers/:providerId">> => {
        const providerValues: Updateable<Provider> = { updated: now };

        if (data.name) {
            providerValues.name = data.name;
        }

        if (data.connection) {
            providerValues.connection_kind = data.connection.kind;

            if (data.connection.kind === "oai") {
                await tx.insertInto("provider_connection_kind_oai")
                    .values({
                        id,
                        base: data.connection.value.base.href,
                        key: data.connection.value.key,
                    })
                    .onConflict((oc) =>
                        oc.columns(["id"]).doUpdateSet((eb) => ({
                            base: eb.ref("excluded.base"),
                            key: eb.ref("excluded.key"),
                        }))
                    )
                    .executeTakeFirstOrThrow();
            } else {
                return {
                    status: "NotImplemented",
                    message: `Connection not implemented: ${data.connection.kind satisfies never}`,
                };
            }
        }

        const result = await tx.updateTable("provider")
            .set(providerValues)
            .executeTakeFirstOrThrow();

        if (!result.numUpdatedRows) {
            return { status: "NotFound" };
        }

        return {
            status: "OK",
            data: null,
        };
    });
});
