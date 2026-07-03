export type ChatEvent =
    | { kind: "user_message"; value: { id: string; content: string } }
    | { kind: "assistant_start"; value: { id: string } }
    | { kind: "assistant_text"; value: { id: string; delta: string } }
    | { kind: "assistant_refusal"; value: { id: string; delta: string } }
    | { kind: "assistant_tool_call_delta"; value: { id: string; index: number; tool_call_id: string; name: string; arguments: string; display: string } }
    | { kind: "assistant_tool_call"; value: { id: string; tool_call_id: string; name: string; arguments: string } }
    | { kind: "assistant_done"; value: { id: string } }
    | { kind: "tool_start"; value: { tool_call_id: string; name: string; arguments: string; display: string } }
    | { kind: "tool_result"; value: { tool_call_id: string; content: string; display: string } }
    | { kind: "error"; value: { message: string } };

type Subscriber = (event: ChatEvent) => void;

class ChatBus {
    private subscribers = new Map<string, Set<Subscriber>>();

    subscribe(chatId: string, fn: Subscriber): () => void {
        let set = this.subscribers.get(chatId);
        if (!set) {
            set = new Set();
            this.subscribers.set(chatId, set);
        }
        set.add(fn);
        return () => {
            set!.delete(fn);
            if (set!.size === 0) this.subscribers.delete(chatId);
        };
    }

    emit(chatId: string, event: ChatEvent): void {
        const set = this.subscribers.get(chatId);
        if (!set) return;
        for (const fn of set) fn(event);
    }
}

export const chatBus = new ChatBus();