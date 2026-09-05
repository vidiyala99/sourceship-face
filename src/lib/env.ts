export type SponsorStatus = {
  linkup: boolean;
  llm: boolean;
  llmProvider: "nebius" | "openai" | null;
  storePath: string;
};

export function sponsorStatus(): SponsorStatus {
  const llm = resolveLlm();
  return {
    linkup: Boolean(process.env.LINKUP_API_KEY),
    llm: Boolean(llm),
    llmProvider: llm?.provider ?? null,
    storePath: process.env.JOB_STORE_PATH || "/tmp/sourceship-jobs.json",
  };
}

export function resolveLlm(): {
  provider: "nebius" | "openai";
  apiKey: string;
  baseUrl: string;
  model: string;
} | null {
  const nebiusKey =
    process.env.NEBIUS_API_KEY ||
    process.env.NEBIUS_TOKEN ||
    process.env.NEBIUS_API_TOKEN;
  const openaiKey = process.env.OPENAI_API_KEY;
  const baseHint = (
    process.env.NEBIUS_BASE_URL ||
    process.env.OPENAI_BASE_URL ||
    ""
  ).toLowerCase();

  if (nebiusKey) {
    return {
      provider: "nebius",
      apiKey: nebiusKey,
      baseUrl: (
        process.env.NEBIUS_BASE_URL ||
        process.env.OPENAI_BASE_URL ||
        "https://api.studio.nebius.com/v1"
      ).replace(/\/$/, ""),
      model:
        process.env.NEBIUS_MODEL ||
        process.env.OPENAI_MODEL ||
        "meta-llama/Meta-Llama-3.1-8B-Instruct-fast",
    };
  }

  if (openaiKey && baseHint.includes("nebius")) {
    return {
      provider: "nebius",
      apiKey: openaiKey,
      baseUrl: (process.env.OPENAI_BASE_URL || "").replace(/\/$/, ""),
      model:
        process.env.NEBIUS_MODEL ||
        process.env.OPENAI_MODEL ||
        "meta-llama/Meta-Llama-3.1-8B-Instruct-fast",
    };
  }

  if (openaiKey) {
    return {
      provider: "openai",
      apiKey: openaiKey,
      baseUrl: (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(
        /\/$/,
        "",
      ),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    };
  }

  return null;
}
