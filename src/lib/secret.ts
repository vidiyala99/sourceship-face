import { existsSync, readFileSync } from "node:fs";

/** Env first, then optional file. Never log the value. */
export function readSecret(
  envNames: string[],
  defaultFile?: string,
  fileEnv?: string,
): string | undefined {
  for (const name of envNames) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  const file = (fileEnv && process.env[fileEnv]?.trim()) || defaultFile;
  if (!file) return undefined;
  try {
    if (!existsSync(file)) return undefined;
    return readFileSync(file, "utf8").trim() || undefined;
  } catch {
    return undefined;
  }
}
