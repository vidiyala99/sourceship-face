import type { JobStatus } from "@/lib/types";

const STAGES: Array<{
  id: "queued" | "researching" | "retrying" | "drafting" | "ready";
  label: string;
}> = [
  { id: "queued", label: "Queued" },
  { id: "researching", label: "Researching" },
  { id: "retrying", label: "Retrying" },
  { id: "drafting", label: "Drafting" },
  { id: "ready", label: "Ready" },
];

const ORDER: Record<(typeof STAGES)[number]["id"], number> = {
  queued: 0,
  researching: 1,
  retrying: 2,
  drafting: 3,
  ready: 4,
};

function currentIndex(status: JobStatus): number {
  if (status === "failed") return -1;
  return ORDER[status];
}

export function StageStepper({ status }: { status: JobStatus }) {
  const current = currentIndex(status);

  return (
    <div className="stepper" aria-label="Job stages">
      {STAGES.map((stage) => {
        const idx = ORDER[stage.id];
        const isCurrent = idx === current;
        const isDone = current > idx || status === "ready";
        const classes = [
          "stage",
          stage.id === "retrying" ? "retry" : "",
          stage.id === "ready" ? "ready" : "",
          isCurrent ? "current" : "",
          isDone && !isCurrent ? "done" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={stage.id} className={classes} aria-current={isCurrent}>
            {stage.label}
          </div>
        );
      })}
    </div>
  );
}
