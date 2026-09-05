import { existsSync, readFileSync } from "node:fs";

export type LinkupResult = {
  text: string;
  sources: { title: string; url: string; snippet: string }[];
};

/** Env first (`LINKUP_API_KEY`), then optional file (`LINKUP_API_KEY_FILE` or /workspace/secrets/LINKUP_API_KEY). */
export function linkupKey(): string | undefined {
  const fromEnv = process.env.LINKUP_API_KEY?.trim();
  if (fromEnv) return fromEnv;
  const file =
    process.env.LINKUP_API_KEY_FILE?.trim() || "/workspace/secrets/LINKUP_API_KEY";
  try {
    if (!existsSync(file)) return undefined;
    return readFileSync(file, "utf8").trim() || undefined;
  } catch {
    return undefined;
  }
}

export function linkupConfigured(): boolean {
  return Boolean(linkupKey());
}

export async function searchLinkup(query: string): Promise<LinkupResult | null> {
  const key = linkupKey();
  if (!key) return null;

  const first = await linkupOnce(key, query);
  if (first) return first;
  await new Promise((r) => setTimeout(r, 600));
  return linkupOnce(key, query);
}

async function linkupOnce(
  key: string,
  query: string,
): Promise<LinkupResult | null> {
  try {
    const res = await fetch("https://api.linkup.so/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        depth: "standard",
        outputType: "sourcedAnswer",
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      answer?: string;
      sources?: { name?: string; title?: string; snippet?: string; url?: string }[];
    };
    const sources = (data.sources ?? []).map((s) => ({
      title: s.name || s.title || "LinkUp source",
      url: s.url || "https://api.linkup.so/v1/search",
      snippet: s.snippet || "",
    }));
    const text = [
      data.answer ?? "",
      ...sources.map((s) => `${s.title} ${s.snippet} ${s.url}`),
    ]
      .join("\n")
      .trim();
    if (!text) return null;
    return { text, sources };
  } catch {
    return null;
  }
}
