import { CREW, agentStatus } from "@/lib/crew";
import type { CrewAgent, Job } from "@/lib/types";

const AGENTS: CrewAgent[] = ["mira", "reed", "tess"];

export function CrewView({ job }: { job: Job }) {
  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="grid grid-cols-3 gap-2 sm:grid-cols-1 sm:space-y-3 sm:gap-0">
        {AGENTS.map((id) => {
          const agent = CREW[id];
          const status = agentStatus(id, job.stage, job.retrying, job.failed);
          return (
            <div
              key={id}
              className="rounded-xl border border-white/8 bg-[#171512] p-2.5 sm:rounded-2xl sm:p-4"
            >
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
                  <Avatar agent={id} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium sm:text-base">{agent.name}</p>
                    <p className="truncate text-[11px] text-[#f3eee6]/45 sm:text-xs">
                      {agent.role}
                    </p>
                  </div>
                  <span className="ml-auto sm:hidden">
                    <StatusPill status={status} />
                  </span>
                </div>
                <span className="hidden sm:inline-flex sm:ml-auto">
                  <StatusPill status={status} />
                </span>
              </div>
              <p className="mt-2 hidden text-sm leading-6 text-[#cfc6b8] sm:block">
                {agent.tone}
              </p>
            </div>
          );
        })}
      </aside>

      <section className="min-w-0 rounded-[1.25rem] border border-white/8 bg-[#141210] p-4 sm:rounded-[1.6rem] sm:p-5 md:p-6">
        <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5 sm:gap-4">
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.2em] text-[#e8a36a] uppercase">
              Live collaboration
            </p>
            <h2 className="font-serif mt-1 text-2xl tracking-tight sm:text-3xl">
              {job.stage === "ready" ? "They brought it back." : "They’re on it."}
            </h2>
          </div>
          <p className="shrink-0 text-xs text-[#f3eee6]/40 capitalize">{job.stage}</p>
        </div>

        <ol className="space-y-4">
          {(job.crew ?? []).map((message) => {
            const agent = CREW[message.agent];
            return (
              <li key={message.id} className="flex gap-3">
                <Avatar agent={message.agent} />
                <div className="min-w-0 flex-1 rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/6">
                  <div className="mb-1 flex items-baseline gap-2">
                    <span className="text-sm font-medium">{agent.name}</span>
                    <span className="text-[11px] text-[#f3eee6]/40">{agent.role}</span>
                  </div>
                  <p className="text-sm leading-6 text-[#ddd4c6]">{message.text}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {job.stage !== "ready" && !job.failed ? (
          <p className="mt-6 flex items-center gap-2 text-sm text-[#e8a36a]">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#e8a36a]" />
            {job.statusNote}
          </p>
        ) : null}
      </section>
    </div>
  );
}

function Avatar({ agent }: { agent: CrewAgent }) {
  const cls =
    agent === "mira"
      ? "bg-[#2a3340] text-[#d7e2f0]"
      : agent === "reed"
        ? "bg-[#2d3b34] text-[#d5e8dc]"
        : "bg-[#3b2a24] text-[#f0d8cc]";
  return (
    <span
      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-medium sm:h-9 sm:w-9 sm:text-sm ${cls}`}
    >
      {CREW[agent].initial}
    </span>
  );
}

function StatusPill({
  status,
}: {
  status: "waiting" | "working" | "done" | "retrying" | "stuck";
}) {
  const label = {
    waiting: "Waiting",
    working: "Working",
    done: "Done",
    retrying: "Retrying",
    stuck: "Stuck",
  }[status];
  const cls = {
    waiting: "text-[#f3eee6]/40",
    working: "text-[#e8a36a]",
    done: "text-[#9fd4b0]",
    retrying: "text-[#f0b67a]",
    stuck: "text-red-300",
  }[status];
  return <span className={`ml-auto text-[11px] tracking-wide uppercase ${cls}`}>{label}</span>;
}
