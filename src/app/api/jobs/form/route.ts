import { redirectTo } from "@/lib/http";
import { createFollowUpJob } from "@/lib/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  try {
    const job = createFollowUpJob({
      preset: String(form.get("preset") ?? "burningtoken"),
      ask: String(form.get("ask") ?? ""),
      eventUrl: String(form.get("eventUrl") ?? ""),
      goal: String(form.get("goal") ?? ""),
    });
    return redirectTo(request, `/run/${job.id}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start the crew";
    return redirectTo(request, "/", { error: message });
  }
}
