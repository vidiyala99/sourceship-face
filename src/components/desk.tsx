import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PIPELINE_STAGES, type Job, type PipelineStage } from "@/lib/types";

const DEFAULT_URL = "https://luma.com/burningtoken";
const DEFAULT_GOAL = "shortlist who to thank / partner with";

const fieldClass =
  "h-8 w-full min-w-0 rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-sm outline-none";
const areaClass =
  "min-h-16 w-full rounded-lg border border-stone-300 bg-white px-2.5 py-2 text-sm outline-none";
const btnClass =
  "inline-flex h-9 items-center justify-center rounded-lg bg-stone-900 px-3 text-sm font-medium text-stone-50 disabled:opacity-50";
const btnGhost =
  "inline-flex h-7 items-center justify-center rounded-md border border-stone-300 bg-white px-2.5 text-xs font-medium text-stone-900";

export function Desk({
  jobs,
  selectedId,
  error,
}: {
  jobs: Job[];
  selectedId: string | null;
  error: string | null;
}) {
  const selected = jobs.find((job) => job.id === selectedId) ?? jobs[0] ?? null;
  const pendingCount =
    selected?.result?.shortlist.filter((item) => !item.approved).length ?? 0;

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 px-4 py-6 md:px-6">
      <header className="flex flex-col gap-3 border-b border-stone-300/70 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-orange-800 uppercase">
            SourceShip · Burning Token desk
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
            Assign the follow-up. Walk away.
          </h1>
          <p className="mt-1 max-w-xl text-sm text-stone-600">
            Scout is the teammate on this desk. One job type: follow up this
            event. You get a shortlist, send-ready notes, and a confidence
            score — not a chat thread.
          </p>
        </div>
        <div className="rounded-lg border border-stone-300 bg-white/70 px-3 py-2 font-mono text-xs text-stone-600">
          {jobs.length === 0
            ? "Desk is empty"
            : `${jobs.filter((j) => j.stage === "ready").length} ready · ${jobs.filter((j) => j.stage !== "ready" && !j.failed).length} in flight`}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <Card className="bg-[#fffdf7] shadow-sm">
            <CardHeader>
              <CardTitle>New assignment</CardTitle>
              <CardDescription>
                Paste a public Luma/event URL. Scout researches, drafts, and
                leaves a pack.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action="/api/jobs/form" method="post" className="space-y-3">
                <label className="block space-y-1">
                  <span className="font-mono text-[11px] text-stone-500 uppercase">
                    Job type
                  </span>
                  <div className="rounded-md border border-stone-300 bg-stone-100 px-2.5 py-1.5 text-sm">
                    Follow up this event
                  </div>
                </label>
                <label className="block space-y-1">
                  <span className="font-mono text-[11px] text-stone-500 uppercase">
                    Event URL
                  </span>
                  <input
                    className={fieldClass}
                    name="eventUrl"
                    defaultValue={DEFAULT_URL}
                    placeholder="https://luma.com/burningtoken"
                    required
                  />
                </label>
                <label className="block space-y-1">
                  <span className="font-mono text-[11px] text-stone-500 uppercase">
                    Goal
                  </span>
                  <textarea
                    className={areaClass}
                    name="goal"
                    defaultValue={DEFAULT_GOAL}
                    rows={3}
                    required
                  />
                </label>
                {error ? <p className="text-sm text-red-700">{error}</p> : null}
                <button type="submit" className={`${btnClass} w-full`}>
                  Assign to Scout
                </button>
              </form>
            </CardContent>
          </Card>

          <div className="rounded-xl border border-dashed border-stone-400 bg-white/40 p-4 text-sm text-stone-600">
            <p className="font-medium text-stone-800">How Scout works</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>Queued — accepted, not chatting.</li>
              <li>Researching — public page HTML + known partners.</li>
              <li>Drafting — notes from those entities only.</li>
              <li>Ready — pack sits here until you approve.</li>
            </ol>
            <p className="mt-3 text-xs">Approve is UI-only. Nothing is emailed.</p>
          </div>
        </aside>

        <section className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {PIPELINE_STAGES.map((stage) => (
              <BoardColumn
                key={stage}
                stage={stage}
                jobs={jobs.filter((job) => job.stage === stage)}
                selectedId={selected?.id}
              />
            ))}
          </div>
          <ResultPack job={selected} pendingCount={pendingCount} />
        </section>
      </div>
    </div>
  );
}

function BoardColumn({
  stage,
  jobs,
  selectedId,
}: {
  stage: PipelineStage;
  jobs: Job[];
  selectedId?: string;
}) {
  return (
    <div className="min-h-48 rounded-xl border border-stone-300/80 bg-stone-200/40 p-2">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="font-mono text-[11px] tracking-wider text-stone-700 uppercase">
          {stage}
        </h2>
        <span className="font-mono text-[11px] text-stone-500">{jobs.length}</span>
      </div>
      <div className="space-y-2">
        {jobs.length === 0 ? (
          <p className="px-1 py-6 text-center text-xs text-stone-500">Empty</p>
        ) : (
          jobs.map((job) => (
            <a
              key={job.id}
              href={`/?job=${job.id}`}
              className={`block w-full rounded-lg border p-2.5 text-left ${
                selectedId === job.id
                  ? "border-stone-900 bg-white shadow-sm"
                  : "border-stone-300 bg-[#fffdf7]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-stone-900">{job.title}</p>
                {job.retrying ? (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] text-red-800">
                    Retrying
                  </span>
                ) : job.failed ? (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] text-red-800">
                    Failed
                  </span>
                ) : job.stage === "ready" ? (
                  <span className="rounded-full bg-stone-900 px-2 py-0.5 text-[11px] text-white">
                    Ready
                  </span>
                ) : null}
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-stone-600">
                {job.statusNote}
              </p>
            </a>
          ))
        )}
      </div>
    </div>
  );
}

function ResultPack({
  job,
  pendingCount,
}: {
  job: Job | null;
  pendingCount: number;
}) {
  if (!job) {
    return (
      <Card className="bg-[#fffdf7]">
        <CardHeader>
          <CardTitle>Done pack</CardTitle>
          <CardDescription>
            Assign a follow-up. When Scout finishes, the shortlist lands here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (job.failed) {
    return (
      <Card className="border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle>Scout stopped</CardTitle>
          <CardDescription>{job.error || job.statusNote}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (job.stage !== "ready" || !job.result) {
    return (
      <Card className="bg-[#fffdf7]">
        <CardHeader>
          <CardTitle>Scout is working</CardTitle>
          <CardDescription>
            {job.retrying ? "Retrying a failed step once…" : job.statusNote}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-1 font-mono text-xs text-stone-600">
            {job.activity.slice(-6).map((entry) => (
              <li key={entry.at}>
                {new Date(entry.at).toLocaleTimeString()} — {entry.message}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    );
  }

  const { result } = job;
  const approved = result.shortlist.filter((item) => item.approved).length;

  return (
    <Card className="bg-[#fffdf7]">
      <CardHeader className="border-b border-stone-200">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>Done pack · {result.eventTitle}</CardTitle>
            <CardDescription className="mt-1 max-w-2xl">
              {result.summary}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-center">
              <div className="font-mono text-[10px] tracking-wider text-stone-500 uppercase">
                Confidence
              </div>
              <div className="text-2xl font-semibold text-stone-900">
                {result.overallConfidence}
              </div>
            </div>
            <form action="/api/jobs/form/approve" method="post">
              <input type="hidden" name="jobId" value={job.id} />
              <input type="hidden" name="all" value="1" />
              <button type="submit" className={btnClass} disabled={pendingCount === 0}>
                Approve remaining ({pendingCount})
              </button>
            </form>
          </div>
        </div>
        <p className="mt-2 text-xs text-stone-500">
          {approved}/{result.shortlist.length} approved · drafts via{" "}
          {result.draftMode === "llm" ? "LLM" : "templates"} · no email is sent
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        {result.shortlist.length === 0 ? (
          <p className="text-sm text-stone-600">
            No grounded entities on that page. Try the seeded Luma URL.
          </p>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {result.shortlist.map((item) => (
              <article
                key={item.id}
                className={`rounded-lg border p-3 ${
                  item.approved
                    ? "border-emerald-700/40 bg-emerald-50"
                    : "border-stone-300 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-stone-900">{item.name}</h3>
                    <p className="text-xs text-stone-500">
                      {item.role} · {item.kind} · why: {item.why}
                    </p>
                  </div>
                  <span className="rounded-full border border-stone-300 px-2 py-0.5 text-[11px]">
                    {item.approved
                      ? "Approved"
                      : `${item.confidence}% confidence`}
                  </span>
                </div>
                <div className="mt-3 rounded-md bg-stone-50 p-2">
                  <p className="text-xs font-medium text-stone-800">
                    {item.note.subject}
                  </p>
                  <pre className="mt-1 whitespace-pre-wrap font-sans text-xs leading-5 text-stone-700">
                    {item.note.body}
                  </pre>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[11px] text-stone-500">
                    Source: {item.source}
                    {item.sourceUrl ? ` · ${item.sourceUrl}` : ""}
                  </p>
                  <form action="/api/jobs/form/approve" method="post">
                    <input type="hidden" name="jobId" value={job.id} />
                    <input type="hidden" name="itemId" value={item.id} />
                    <button
                      type="submit"
                      className={btnGhost}
                      disabled={item.approved}
                    >
                      {item.approved ? "Approved" : "Approve"}
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
