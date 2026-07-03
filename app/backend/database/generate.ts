import * as codegen from "@maheshbansod/kysely-codegen";
import { join } from "@std/path";
import { dialect } from "./client.ts";
import { DATA_DIR } from "~/env.ts";

await import("./migrate.ts");

const outdir = new URL("./generated/", import.meta.url).pathname;
await Deno.remove(outdir, { recursive: true }).catch(() => {});

const cli = new codegen.Cli();
await cli.generate({
    url: join(DATA_DIR, "sqlite.db"),
    outFile: join(outdir, "types.ts"),
    customKyselyDialect: dialect as never,
    dialectName: "sqlite",
});
