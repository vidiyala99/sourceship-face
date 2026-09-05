import { redirect } from "next/navigation";
import { CrewView } from "@/components/crew-view";
import { Outcome } from "@/components/outcome";
import { Shell } from "@/components/shell";
import { publicJob } from "@/lib/jobs";
import { kickStaleJobs } from "@/lib/processor";

export const dynamic = "force-dynamic";

export default async function RunPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  kickStaleJobs();
  const { id } = await params;
  const job = publicJob(id);
  if (!job) redirect("/app");

  const inFlight = job.stage !== "ready" && !job.failed;
  const reloadUrl = `/run/${job.id}`;

  return (
    <>
      {inFlight ? (
        <>
          <meta httpEquiv="refresh" content={`2;url=${reloadUrl}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `setTimeout(function(){location.replace(${JSON.stringify(reloadUrl)})},1800)`,
            }}
          />
        </>
      ) : null}
      <Shell eyebrow={job.ask}>
        <CrewView job={job} />
        {job.result ? <Outcome job={job} /> : null}
      </Shell>
    </>
  );
}
