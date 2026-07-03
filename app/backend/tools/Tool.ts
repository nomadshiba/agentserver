import { LoadedMessage } from "~/backend/agents/run.ts";
import { ProviderToolCall, ProviderToolDefinition, ProviderToolMessage } from "~/backend/providers/ProviderClient.ts";

export abstract class Tool {
    public abstract definition(): ProviderToolDefinition;
    public abstract execute(history: LoadedMessage[], call: ProviderToolCall): Promise<ProviderToolMessage> | ProviderToolMessage;
}