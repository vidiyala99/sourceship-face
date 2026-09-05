import { redirectTo } from "@/lib/http";
import { createFollowUpJob } from "@/lib/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const preset = String(form.get("preset") ?? "").trim();
  const ask = String(form.get("ask") ?? "").trim();
  const eventUrl = String(form.get("eventUrl") ?? "").trim();
  const goal = String(form.get("goal") ?? "").trim();

  if (!goal && !ask && !preset && !eventUrl) {
    return redirectTo(request, "/app", {
      error: "Tell the crew what to handle",
    });
  }

  try {
    const job = createFollowUpJob({
      preset,
      ask,
      eventUrl,
      goal,
    });
    return redirectTo(request, `/run/${job.id}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start the crew";
    return redirectTo(request, "/app", { error: message });
  }
}
