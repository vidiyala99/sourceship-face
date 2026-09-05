import Link from "next/link";
import { Shell } from "@/components/shell";
import { StartPanel } from "@/components/start-panel";
import { publicJobs } from "@/lib/jobs";
import { kickStaleJobs } from "@/lib/processor";

export const dynamic = "force-dynamic";

export default async function AppHome({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  kickStaleJobs();
  const { error } = await searchParams;
  const jobs = publicJobs();
  const inFlight = jobs.some((job) => job.stage !== "ready" && !job.failed);

  return (
    <>
      {inFlight ? (
        <meta httpEquiv="refresh" content="3;url=/app" />
      ) : null}
      <Shell eyebrow="Ready when you are">
        <StartPanel error={error} />
        {jobs.length > 0 ? (
          <section className="mx-auto mt-10 w-full max-w-xl sm:mt-14">
            <p className="text-[11px] tracking-[0.2em] text-[#e8a36a] uppercase">
              Recent
            </p>
            <ul className="mt-3 space-y-2">
              {jobs.slice(0, 8).map((job) => (
                <li key={job.id}>
                  <Link
                    href={`/run/${job.id}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-[#171512] px-3.5 py-3 hover:border-[#e8a36a]/40 sm:px-4"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {job.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-[#f3eee6]/45">
                        {job.statusNote}
                      </span>
                    </span>
                    <span className="shrink-0 text-[11px] tracking-wide text-[#e8a36a] uppercase">
                      {job.failed ? "Stopped" : job.stage}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Shell>
    </>
  );
}
