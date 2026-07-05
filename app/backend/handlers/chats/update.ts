import { Updateable } from "@kysely/kysely";
import { db } from "~/backend/database/client.ts";
import { Chat } from "~/backend/database/generated/types.ts";
import { RouteHandlerResult } from "~/libs/routing/Router.ts";
import { router } from "~/router.ts";
import { RoutesSchema } from "~/routes.ts";

router.registerHandler("PATCH /v1/chats/:chatId", async ({ params, data }) => {
    const id = params.pathname.chatId;
    const now = Date.now();

    return await db.transaction().execute(async (tx): Promise<RouteHandlerResult<RoutesSchema, "PATCH /v1/chats/:chatId">> => {
        const values: Updateable<Chat> = { updated: now };

        if (data.name) {
            values.name = data.name;
        }

        if (data.agent) {
            values.agent = data.agent;
        }

        if (data.model) {
            values.model = data.model.name;
            values.provider_id = data.model.providerId;
        }

        const result = await tx.updateTable("chat")
            .set(values)
            .where("chat.id", "=", id)
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
