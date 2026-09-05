import { Desk } from "@/components/desk";
import { publicJobs } from "@/lib/jobs";
import { kickStaleJobs } from "@/lib/processor";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ job?: string; error?: string }>;
}) {
  kickStaleJobs();
  const params = await searchParams;
  const jobs = publicJobs();
  const selected =
    jobs.find((job) => job.id === params.job) ?? jobs[0] ?? null;
  const inFlight = jobs.some((job) => job.stage !== "ready" && !job.failed);
  const reloadUrl = selected ? `/?job=${selected.id}` : "/";

  return (
    <>
      {inFlight ? (
        <>
          <meta httpEquiv="refresh" content={`2;url=${reloadUrl}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `setTimeout(function(){location.replace(${JSON.stringify(reloadUrl)})},2000)`,
            }}
          />
        </>
      ) : null}
      <Desk
        jobs={jobs}
        selectedId={selected?.id ?? null}
        error={params.error ?? null}
      />
    </>
  );
}
