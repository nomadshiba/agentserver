import { db } from "~/backend/database/client.ts";
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
                base: data.base.href,
                key: data.key,
                created: now,
                updated: now,
            })
            .execute();

        return {
            status: "OK",
            data: null,
        };
    });
});
