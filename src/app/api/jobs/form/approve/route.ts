import { redirectTo } from "@/lib/http";
import { approveItems } from "@/lib/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const jobId = String(form.get("jobId") ?? "");
  const itemId = String(form.get("itemId") ?? "");
  const all = String(form.get("all") ?? "") === "1";
  const fallbackCount = Number(form.get("count") ?? 0);
  const job = approveItems(jobId, all || !itemId ? "all" : [itemId]);
  const approved =
    job?.result?.shortlist.filter((item) => item.approved).length ??
    fallbackCount;

  if (all || !job) {
    return redirectTo(request, "/app", {
      approved: String(approved || fallbackCount || 1),
      job: job?.id || jobId,
    });
  }

  return redirectTo(request, `/run/${job.id}`);
}
