import "server-only";
import { parseEnv } from "./env";

/** Parsed environment. Importable from server code only. */
export const env = parseEnv(process.env);
