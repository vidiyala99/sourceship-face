import Link from "next/link";
import { ApproveDone } from "@/components/approve-done";
import { Shell } from "@/components/shell";
import { StartPanel } from "@/components/start-panel";
import { publicJob, publicJobs } from "@/lib/jobs";
import { kickStaleJobs } from "@/lib/processor";

export const dynamic = "force-dynamic";

export default async function AppHome({
  searchParams,
}: {
  searchParams: Promise<{ approved?: string; job?: string }>;
}) {
  kickStaleJobs();
  const { approved, job: jobId } = await searchParams;
  const approvedCount = Number(approved);
  const packJob = jobId ? publicJob(jobId) : undefined;
  const jobs = publicJobs();
  const inFlight = jobs.some((job) => job.stage !== "ready" && !job.failed);

  return (
    <>
      {inFlight && !(approvedCount > 0) ? (
        <meta httpEquiv="refresh" content="3;url=/app" />
      ) : null}
      <Shell eyebrow="Ready when you are">
        {approvedCount > 0 ? (
          <ApproveDone count={approvedCount} jobId={packJob?.id || jobId} />
        ) : null}
        <StartPanel />
        {jobs.length > 0 ? (
          <section id="recent" className="mx-auto mt-16 max-w-2xl">
            <p className="text-[11px] tracking-[0.22em] text-[#e8a36a] uppercase">
              Recent
            </p>
            <ul className="mt-3 space-y-2">
              {jobs.slice(0, 8).map((job) => (
                <li key={job.id}>
                  <Link
                    href={`/run/${job.id}`}
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#171512] px-4 py-3 hover:border-[#e8a36a]/40"
                  >
                    <span>
                      <span className="block text-sm font-medium">{job.title}</span>
                      <span className="block text-xs text-[#f3eee6]/45">
                        {job.statusNote}
                      </span>
                    </span>
                    <span className="text-[11px] tracking-wide text-[#e8a36a] uppercase">
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
