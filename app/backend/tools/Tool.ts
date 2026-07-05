import { ChatClient } from "~/backend/chats/ChatClient.ts";
import { ProviderToolCall, ProviderToolDefinition, ProviderToolMessage } from "~/backend/providers/ProviderClient.ts";

export abstract class Tool {
    public abstract definition(): ProviderToolDefinition;
    public abstract execute(chat: ChatClient, call: ProviderToolCall): Promise<ProviderToolMessage> | ProviderToolMessage;

    /** Render an in-progress/partial tool call as display text (markdown). Args may be incomplete JSON. */
    public renderCall(name: string, args: string): string {
        return `### ${name}\n\n\`\`\`\n${args}\n\`\`\``;
    }

    /** Render a completed tool result as display text (markdown). */
    public renderResult(name: string, _args: string, result: string): string {
        return `### ${name} result\n\n\`\`\`\n${result}\n\`\`\``;
    }
}
