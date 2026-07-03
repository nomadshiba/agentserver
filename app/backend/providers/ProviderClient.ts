export type ProviderModel = { name: string; id: string; created: number };

export type ProviderTool = {
    name: string;
    description?: string;
    parameters: Record<string, unknown>; // JSON Schema object
};

export type ProviderChatInput = {
    model: string;
    messages: ProviderChatMessage[];
    temperature?: number;
    max_tokens?: number;
    tools?: ProviderTool[];
    tool_choice?: "none" | "auto" | "required" | { type: "function"; function: { name: string } };
};

export class ProviderClient {
    public readonly base: string;
    public readonly key: string;

    private constructor(base: string, key: string) {
        this.base = base;
        this.key = key;
    }

    static create(options: { base: string; key: string }): ProviderClient {
        const base = options.base.replace(/\/+$/, "");
        return new ProviderClient(base, options.key);
    }

    async chat(input: ProviderChatInput): Promise<ProviderAssistantMessage> {
        const body = {
            model: input.model,
            messages: input.messages,
            temperature: input.temperature,
            max_tokens: input.max_tokens,
            stream: false,
            tools: input.tools?.map((t): ProviderToolDefinition => ({
                type: "function",
                function: {
                    name: t.name,
                    description: t.description,
                    parameters: t.parameters,
                },
            })),
            tool_choice: input.tool_choice,
        };

        const response = await fetch(`${this.base}/chat/completions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.key}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`OAI chat completions error ${response.status}: ${text}`);
        }

        const output = await response.json() as ProviderChatResponse<"assistant">;

        return output.choices[0].message;
    }

    async models(): Promise<ProviderModel[]> {
        const res = await fetch(`${this.base}/models`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${this.key}` },
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`OAI list models error ${res.status}: ${text}`);
        }

        const json = await res.json() as { data: { id: string; object: string; created: number; owned_by: string }[] };
        return json.data.map((model) => ({ id: model.id, name: model.id, created: model.created * 1000 }));
    }
}

export type ProviderToolCall = {
    id: string;
    type: "function";
    function: {
        name: string;
        arguments: string;
    };
};

export type ProviderToolDefinition = {
    type: "function";
    function: {
        name: string;
        description?: string;
        parameters: Record<string, unknown>;
    };
};

export type ProviderSystemMessage = { role: "system"; content: string };
export type ProviderUserMessage = { role: "user"; content: string };
export type ProviderAssistantMessage = {
    role: "assistant";
    content?: string | null;
    refusal?: string | null;
    tool_calls?: ProviderToolCall[];
};
export type ProviderToolMessage = { role: "tool"; content: string; tool_call_id: string };

export type ProviderChatMessage =
    | ProviderSystemMessage
    | ProviderUserMessage
    | ProviderAssistantMessage
    | ProviderToolMessage;

type ProviderChatChoice<TRole extends ProviderChatMessage["role"] = ProviderChatMessage["role"]> = {
    index: number;
    message: ProviderChatMessage & { role: TRole };
    finish_reason: string | null;
};

type ProviderChatResponse<TRole extends ProviderChatMessage["role"] = ProviderChatMessage["role"]> = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: [ProviderChatChoice<TRole>, ...ProviderChatChoice<TRole>[]];
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
};
