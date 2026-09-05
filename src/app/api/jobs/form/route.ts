import { redirectHome } from "@/lib/http";
import { createFollowUpJob } from "@/lib/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const eventUrl = String(form.get("eventUrl") ?? "");
  const goal = String(form.get("goal") ?? "");

  try {
    const job = createFollowUpJob({ eventUrl, goal });
    return redirectHome(request, { job: job.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not assign job";
    return redirectHome(request, { error: message });
  }
}
