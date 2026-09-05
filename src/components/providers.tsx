import { sponsorStatus } from "@/lib/env";

export function Providers() {
  const status = sponsorStatus();
  return (
    <p className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] tracking-wide text-[#f3eee6]/40">
      <span>{status.linkup ? "Live research" : "Using public pages"}</span>
      <span>
        {status.llm ? "Drafting notes" : "Drafting from what we found"}
      </span>
    </p>
  );
}
