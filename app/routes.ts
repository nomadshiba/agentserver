import { ArrayCodec, Void } from "@nomadshiba/codec";
import { AgentOutput } from "~/backend/handlers/agents/AgentOutput.ts";
import { ChatCreateInput } from "~/backend/handlers/chats/ChatCreateInput.ts";
import { ChatCreateResult } from "~/backend/handlers/chats/ChatCreateResult.ts";
import { ChatOutput } from "~/backend/handlers/chats/ChatOutput.ts";
import { ChatUpdateInput } from "~/backend/handlers/chats/ChatUpdateInput.ts";
import { ChatMessageOutput } from "~/backend/handlers/chats/messages/ChatMessageOutput.ts";
import { MessageContentUser } from "~/backend/handlers/chats/messages/MessageContent.ts";
import { ModelOutput } from "~/backend/handlers/models/ModelOutput.ts";
import { ProviderInput } from "~/backend/handlers/providers/ProviderInput.ts";
import { ProviderOutput } from "~/backend/handlers/providers/ProviderOutput.ts";
import { Schema } from "~/libs/routing/Router.ts";

export type RoutesSchema = typeof RoutesSchema;
export const RoutesSchema = {
    "GET /v1/models?provider=:provider": { input: Void, output: new ArrayCodec(ModelOutput) },
    "GET /v1/models": { input: Void, output: new ArrayCodec(ModelOutput) },

    "GET /v1/agents": { input: Void, output: new ArrayCodec(AgentOutput) },

    "POST /v1/providers": { input: ProviderInput, output: Void },
    "GET /v1/providers": { input: Void, output: new ArrayCodec(ProviderOutput) },
    "PATCH /v1/providers/:providerId": { input: ProviderInput.partial(), output: Void },
    "DELETE /v1/providers/:providerId": { input: Void, output: Void },

    "POST /v1/chats": { input: ChatCreateInput, output: ChatCreateResult },
    "GET /v1/chats": { input: Void, output: new ArrayCodec(ChatOutput) },
    "GET /v1/chats/:chatId": { input: Void, output: ChatOutput },
    "PATCH /v1/chats/:chatId": { input: ChatUpdateInput, output: Void },
    "DELETE /v1/chats/:chatId": { input: Void, output: Void },

    "POST /v1/chats/:chatId/messages": { input: MessageContentUser, output: Void },
    "GET /v1/chats/:chatId/messages": { input: Void, output: new ArrayCodec(ChatMessageOutput) },
    "DELETE /v1/chats/:chatId/messages/:messageId": { input: Void, output: Void },
} as const satisfies Schema;
