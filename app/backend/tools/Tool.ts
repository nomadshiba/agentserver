import { LoadedMessage } from "~/backend/agents/run.ts";
import { ProviderToolCall, ProviderToolDefinition, ProviderToolMessage } from "~/backend/providers/ProviderClient.ts";

export abstract class Tool {
    public abstract definition(): ProviderToolDefinition;
    public abstract execute(history: LoadedMessage[], call: ProviderToolCall): Promise<ProviderToolMessage> | ProviderToolMessage;

    /** Render an in-progress/partial tool call as display text. Args may be incomplete JSON. */
    public renderCall(name: string, args: string): string {
        return `${name}(${args})`;
    }

    /** Render a completed tool result as display text. */
    public renderResult(name: string, args: string, result: string): string {
        return `${name}(${args}) -> ${result}`;
    }
}