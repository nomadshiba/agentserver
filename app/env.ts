import { dirname, join } from "@std/path";
import { parseArgs } from "@std/cli";

export const DEV = !Deno.build.standalone;
export const ARGS = parseArgs(Deno.args, { boolean: ["background"] });
export const ROOT_DIR = Deno.build.standalone ? dirname(Deno.execPath()) : Deno.cwd();
export const DATA_DIR = join(ROOT_DIR, "data");
await Deno.mkdir(DATA_DIR, { recursive: true });
