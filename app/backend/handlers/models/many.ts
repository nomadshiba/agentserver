import { db } from "~/backend/database/client.ts";
import { ProviderClient } from "~/backend/providers/ProviderClient.ts";
import { router } from "~/router.ts";

router.registerHandler("GET /v1/models", () => handleModels());
router.registerHandler("GET /v1/models?provider=:provider", ({ params }) => handleModels(params.search.provider));

async function handleModels(providerId?: string) {
    const providers = await db.selectFrom("provider")
        .$if(Boolean(providerId), (qb) => qb.where("provider.id", "=", providerId!))
        .select("provider.id")
        .execute();

    const models = await Promise.all(providers.map(async (provider) => {
        const client = await ProviderClient.open(provider.id);
        const models = await client?.models().catch((reason) => {
            console.error(reason);
            return [];
        }) ?? [];
        return models.map((model) => ({
            id: model.id,
            name: model.name,
            created: model.created,
            providerId: provider.id,
        }));
    })).then((result) => result.flat());

    return { status: "OK", data: models } as const;
}
