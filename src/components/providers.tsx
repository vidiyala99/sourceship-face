import { sponsorStatus } from "@/lib/env";

export function Providers() {
  const status = sponsorStatus();
  return (
    <p className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] tracking-wide text-[#f3eee6]/40">
      <span>{status.linkup ? "LinkUp live" : "LinkUp waiting for key"}</span>
      <span>
        {status.llm
          ? `${status.llmProvider === "nebius" ? "Nebius" : "OpenAI"} live`
          : "Nebius waiting for key"}
      </span>
    </p>
  );
}
