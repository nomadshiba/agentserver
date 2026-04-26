import { db } from "~/database/client.ts";
import { router } from "~/router.ts";

router.registerHandler("DELETE /v1/providers/:providerId", async ({ params }) => {
    const id = params.pathname.providerId;

    const result = await db.deleteFrom("provider")
        .where("provider.id", "=", id)
        .executeTakeFirstOrThrow();

    if (!result.numDeletedRows) {
        return { status: "NotFound" };
    }

    return { status: "OK", data: null };
});
