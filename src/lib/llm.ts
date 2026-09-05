import { resolveLlm } from "./env";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export function llmAvailable(): boolean {
  return Boolean(resolveLlm());
}

export function llmProvider(): "nebius" | "openai" | null {
  return resolveLlm()?.provider ?? null;
}

export async function completeJson(prompt: string): Promise<string | null> {
  const first = await completeOnce(prompt);
  if (first) return first;
  await new Promise((r) => setTimeout(r, 700));
  return completeOnce(prompt);
}

async function completeOnce(prompt: string): Promise<string | null> {
  const config = resolveLlm();
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
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You write short coffee-chat follow-up notes and numeric scores. Reply with JSON only. Never invent people or orgs that were not provided.",
          },
          { role: "user", content: prompt },
        ] satisfies ChatMessage[],
      }),
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) {
      const snippet = (await res.text())
        .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180);
      console.error(
        `[llm] chat completions failed: ${res.status} ${snippet}`,
      );
      return null;
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}
