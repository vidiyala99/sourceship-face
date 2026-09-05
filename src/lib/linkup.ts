export async function searchLinkup(query: string): Promise<string | null> {
  const key = process.env.LINKUP_API_KEY;
  if (!key) return null;

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
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      answer?: string;
      sources?: { name?: string; snippet?: string; url?: string }[];
    };
    const bits = [
      data.answer ?? "",
      ...(data.sources ?? []).map(
        (s) => `${s.name ?? ""} ${s.snippet ?? ""} ${s.url ?? ""}`,
      ),
    ];
    const text = bits.join("\n").trim();
    return text || null;
  } catch {
    return null;
  }
}
