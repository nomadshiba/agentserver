import { LoadedMessage } from "~/backend/agents/run.ts";
import { ProviderToolCall, ProviderToolDefinition, ProviderToolMessage } from "~/backend/providers/ProviderClient.ts";
import { Tool } from "~/backend/tools/Tool.ts";

export type ScriptToolPermissions = {
    net?: boolean | string[];
    read?: boolean | string[];
    write?: boolean | string[];
    env?: boolean;
    run?: boolean;
    ffi?: boolean;
    sys?: boolean;
    import?: boolean;
};

const WORKER_TIMEOUT = 30_000;

export class ScriptTool extends Tool {
    constructor(private readonly permissions: ScriptToolPermissions = {}) {
        super();
    }

    definition(): ProviderToolDefinition {
        return {
            type: "function",
            function: {
                name: "script",
                description:
                    "Run TypeScript code in a sandboxed Deno Worker. The code runs in a Worker with restricted permissions. Use `self.postMessage(result)` to return a value. The input `data` is available via `self.onmessage`. Returns the posted value as a string.",
                parameters: {
                    type: "object",
                    properties: {
                        code: {
                            type: "string",
                            description:
                                "TypeScript code to run in the worker. Use `self.onmessage = (e) => {...}` and call `self.postMessage(result)` to return.",
                        },
                        input: {
                            type: "string",
                            description: "Optional input data to pass to the worker via postMessage.",
                        },
                    },
                    required: ["code"],
                },
            },
        };
    }

    execute(_history: LoadedMessage[], call: ProviderToolCall): Promise<ProviderToolMessage> {
        return this.run(call);
    }

    override renderCall(_name: string, args: string): string {
        let code: string | undefined;
        try {
            code = (JSON.parse(args) as { code?: string }).code;
        } catch {
            code = undefined;
        }
        if (!code) return `script(${args})`;
        const firstLine = code.split("\n")[0].trim();
        const preview = code.length > 60 ? code.slice(0, 60) + "..." : code;
        return `script \`${firstLine.length > 30 ? preview.slice(0, 30) + "..." : preview}\``;
    }

    override renderResult(_name: string, _args: string, result: string): string {
        const preview = result.length > 200 ? result.slice(0, 200) + "..." : result;
        return `script -> ${preview}`;
    }

    async run(call: ProviderToolCall): Promise<ProviderToolMessage> {
        let args: { code?: string; input?: string };
        try {
            args = JSON.parse(call.function.arguments);
        } catch {
            return this.toolResult(call, "Error: invalid JSON arguments");
        }

        const code = args.code;
        if (!code) return this.toolResult(call, "Error: missing 'code' argument");

        const input = args.input ?? "";

        const workerUrl = "data:application/typescript," + encodeURIComponent(code);
        let worker: Worker;
        try {
            worker = new Worker(workerUrl, {
                type: "module",
                deno: {
                    permissions: {
                        net: this.permissions.net ?? false,
                        read: this.permissions.read ?? false,
                        write: this.permissions.write ?? false,
                        env: this.permissions.env ?? false,
                        run: this.permissions.run ?? false,
                        ffi: this.permissions.ffi ?? false,
                        sys: this.permissions.sys ?? false,
                        import: this.permissions.import ?? false,
                    },
                },
            } as WorkerOptions);
        } catch (error) {
            return this.toolResult(call, `Error creating worker: ${String(error)}`);
        }

        return await new Promise<ProviderToolMessage>((resolve) => {
            let settled = false;
            const finish = (msg: ProviderToolMessage) => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                worker.terminate();
                resolve(msg);
            };

            const timer = setTimeout(() => {
                finish(this.toolResult(call, "Error: worker timed out"));
            }, WORKER_TIMEOUT);

            worker.onmessage = (e: MessageEvent) => {
                finish(this.toolResult(call, this.stringify(e.data)));
            };
            worker.onerror = (e: ErrorEvent) => {
                e.preventDefault();
                finish(this.toolResult(call, `Error: ${e.message}`));
            };
            worker.onmessageerror = () => {
                finish(this.toolResult(call, "Error: message error in worker"));
            };
            worker.postMessage(input);
        });
    }

    private toolResult(call: ProviderToolCall, content: string): ProviderToolMessage {
        return { role: "tool", content, tool_call_id: call.id };
    }

    private stringify(value: unknown): string {
        if (typeof value === "string") return value;
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return String(value);
        }
    }
}
