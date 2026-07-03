import { ChatMessage } from "~/backend/database/generated/types.ts";
import { ProviderToolCall, ProviderToolDefinition, ProviderToolMessage } from "~/backend/providers/ProviderClient.ts";

export abstract class Tool {
    public abstract definition(): ProviderToolDefinition;
    public abstract execute(history: ChatMessage[], call: ProviderToolCall): Promise<ProviderToolMessage> | ProviderToolMessage;
}
