import type { CrewAgent, PipelineStage } from "./types";

export const CREW: Record<
  CrewAgent,
  { name: string; role: string; initial: string; tone: string }
> = {
  mira: {
    name: "Mira",
    role: "Coordinator",
    initial: "M",
    tone: "Takes the handoff, keeps Reed and Tess honest, brings you the pack.",
  },
  reed: {
    name: "Reed",
    role: "Research",
    initial: "R",
    tone: "Looks up the public pages and only keeps names that are actually there.",
  },
  tess: {
    name: "Tess",
    role: "Draft",
    initial: "T",
    tone: "Turns the shortlist into coffee-chat notes you can send.",
  },
};

export function agentStatus(
  agent: CrewAgent,
  stage: PipelineStage,
  retrying: boolean,
  failed: boolean,
): "waiting" | "working" | "done" | "retrying" | "stuck" {
  if (failed) return "stuck";
  if (stage === "ready") return "done";
  if (retrying && (agent === "reed" || agent === "tess")) return "retrying";
  if (agent === "mira") return "working";
  if (agent === "reed") return stage === "researching" ? "working" : "waiting";
  return stage === "drafting" ? "working" : "waiting";
}
