import { db } from "~/backend/database/client.ts";
import { getCachedModels } from "~/backend/providers/modelsCache.ts";
import { router } from "~/router.ts";

router.registerHandler("GET /v1/models", () => handleModels());
router.registerHandler("GET /v1/models?provider=:provider", ({ params }) => handleModels(params.search.provider));

async function handleModels(providerId?: string) {
    const providers = await db.selectFrom("provider")
        .$if(Boolean(providerId), (qb) => qb.where("provider.id", "=", providerId!))
        .selectAll("provider")
        .execute();

    const models = [];
    for (const row of providers) {
        const providerModels = await getCachedModels(row.id, row.base, row.key);
        for (const m of providerModels) {
            models.push({
                id: m.id,
                name: m.name,
                created: m.created,
                providerId: row.id,
            });
        }
    }

    return { status: "OK", data: models } as const;
}
