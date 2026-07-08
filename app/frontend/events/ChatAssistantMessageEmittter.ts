import { ChatAssistantMessageStream } from "~/backend/handlers/chats/messages/ChatAssistantMessageStream.ts";
import { EmitterTopic } from "~/libs/events/EmitterTopic.ts";

export const ChatAssistantMessageEmittter = new EmitterTopic<ChatAssistantMessageStream>();
