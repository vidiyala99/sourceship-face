import type { Job } from "@/lib/types";

export function Outcome({ job }: { job: Job }) {
  const result = job.result;
  if (!result) return null;
  const pending = result.shortlist.filter((item) => !item.approved).length;
  const approved = result.shortlist.length - pending;

  return (
    <section className="mt-10 overflow-hidden rounded-[1.6rem] bg-[#f4efe6] text-[#1c1712]">
      <div className="flex flex-col gap-5 border-b border-[#1c1712]/10 px-6 py-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-[#a85b2b] uppercase">
            Outcome
          </p>
          <h2 className="font-serif mt-1 text-3xl tracking-tight">
            Who to thank this week
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#5c544a]">
            {result.summary}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white px-4 py-2 text-center shadow-sm">
            <p className="text-[10px] tracking-[0.16em] text-[#8a8176] uppercase">
              Confidence
            </p>
            <p className="font-serif text-3xl">{result.overallConfidence}</p>
          </div>
          <form action="/api/jobs/form/approve" method="post">
            <input type="hidden" name="jobId" value={job.id} />
            <input type="hidden" name="all" value="1" />
            <button
              type="submit"
              disabled={pending === 0}
              className="h-12 rounded-full bg-[#1c1712] px-5 text-sm font-medium text-[#f4efe6] disabled:opacity-40"
            >
              Approve remaining ({pending})
            </button>
          </form>
        </div>
      </div>
      <p className="px-6 pt-4 text-xs text-[#8a8176]">
          {approved}/{result.shortlist.length} approved · {result.researchMode === "linkup" ? "LinkUp research" : result.researchMode === "pages" ? "live pages" : "no live hits"} · {result.draftMode === "llm" ? "LLM notes" : "template notes"} · nothing is emailed
      </p>
      <div className="grid gap-4 p-6 md:grid-cols-2">
        {result.shortlist.map((item) => (
          <article
            key={item.id}
            className={`rounded-2xl border p-4 ${
              item.approved
                ? "border-[#2f6b46]/30 bg-[#e8f5ec]"
                : "border-[#1c1712]/10 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-xs text-[#8a8176]">
                  {item.role} · {item.why}
                </p>
              </div>
              <span className="rounded-full bg-[#1c1712]/5 px-2 py-0.5 text-[11px]">
                {item.approved ? "Approved" : `c${item.confidence}`}
              </span>
            </div>
            <div className="mt-3 rounded-xl bg-[#f4efe6] p-3">
              <p className="text-xs font-medium">{item.note.subject}</p>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-6 text-[#3c352e]">
                {item.note.body}
              </pre>
            </div>
            <form action="/api/jobs/form/approve" method="post" className="mt-3 text-right">
              <input type="hidden" name="jobId" value={job.id} />
              <input type="hidden" name="itemId" value={item.id} />
              <button
                type="submit"
                disabled={item.approved}
                className="h-8 rounded-full border border-[#1c1712]/15 px-3 text-xs font-medium disabled:opacity-40"
              >
                {item.approved ? "Approved" : "Approve"}
              </button>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}
