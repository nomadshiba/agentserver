const DYNAMIC_IMPORT_PREFIX = "import(";
const IMPORT_ALLOWED_REGEX = /^[\x21-\x7E]+$/;
const STATIC_ESM = /^\s*(?:import(?!\()|export)\b/;
globalThis.require = null as never; // FUCK YOU FOR RUINING DENO, FUCKING NODE.JS ADDICTS, INJECTING NODE.JS GARBAGE EVERYWHERE

export function assertSafeImports(code: string, allowedHosts: string[]): void {
    const allow = new Set(allowedHosts.map((h) => h.toLowerCase()));

    const lines = code.split("\n").map((line) => line.trim());
    for (const line of lines) {
        if (STATIC_ESM.test(line)) throw new DisallowedImportError(`static import not allowed: ${line}`);
    }

    let cursor = 0;
    while (cursor < code.length) {
        cursor = code.indexOf(DYNAMIC_IMPORT_PREFIX, cursor);
        if (cursor < 0) break;
        cursor += DYNAMIC_IMPORT_PREFIX.length;
        let importStr = code[cursor++];
        if (importStr !== '"' && importStr !== "'" && importStr !== "`") {
            throw new DisallowedImportError(`invalid import start: ${importStr}`);
        }
        for (; cursor < code.length; cursor++) {
            const char = code[cursor];
            importStr += char;
            if (char === '"' || char === "'" || char === "`") {
                const href = importStr.trim().slice(1, -1);
                const url = new URL(href);
                if (!allow.has(url.host)) throw new DisallowedImportError(`not allowed: ${url.host || url.href}`);
                break;
            }
            if (!IMPORT_ALLOWED_REGEX.test(char)) throw new DisallowedImportError(`invalid char inside import: ${char}`);
        }
    }
}

export class DisallowedImportError extends Error {
    static override name = "DisallowedImportError";
    constructor(specifier: string) {
        super(`Import not allowed: ${specifier}`);
        this.name = "DisallowedImportError";
    }
}
