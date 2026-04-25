import { db } from "~/database/client.ts";
import { router } from "~/router.ts";
import { RouteHandlerResult } from "~/libs/Router.ts";
import { RoutesSchema } from "~/routes.ts";

router.registerHandler("PATCH /v1/providers/:providerId", async ({ params, data }) => {
    const id = params.pathname.providerId;
    const now = Date.now();

    return await db.transaction().execute(async (tx): Promise<RouteHandlerResult<RoutesSchema, "PATCH /v1/providers/:providerId">> => {
    });
});
