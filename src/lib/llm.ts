type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export function llmAvailable(): boolean {
  return Boolean(resolveConfig());
}

export async function completeJson(prompt: string): Promise<string | null> {
  const config = resolveConfig();
  if (!config) return null;

  try {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You write short, send-ready follow-up notes. Reply with JSON only. Never invent people who were not provided.",
          },
          { role: "user", content: prompt },
        ] satisfies ChatMessage[],
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

function resolveConfig(): {
  apiKey: string;
  baseUrl: string;
  model: string;
} | null {
  const openai = process.env.OPENAI_API_KEY;
  const nebius =
    process.env.NEBIUS_API_KEY ||
    process.env.NEBIUS_TOKEN ||
    process.env.NEBIUS_API_TOKEN;

  if (openai) {
    return {
      apiKey: openai,
      baseUrl: (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(
        /\/$/,
        "",
      ),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    };
  }

  if (nebius) {
    return {
      apiKey: nebius,
      baseUrl: (
        process.env.NEBIUS_BASE_URL || "https://api.studio.nebius.com/v1"
      ).replace(/\/$/, ""),
      model:
        process.env.NEBIUS_MODEL || "meta-llama/Meta-Llama-3.1-8B-Instruct-fast",
    };
  }

  return null;
}
