import { NextResponse } from "next/server";
import { createFollowUpJob, publicJobs } from "@/lib/jobs";
import { kickStaleJobs } from "@/lib/processor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  kickStaleJobs();
  return NextResponse.json({ jobs: publicJobs() });
}

export async function POST(request: Request) {
  let body: { eventUrl?: string; goal?: string; ask?: string; preset?: string };
  try {
    body = (await request.json()) as {
      eventUrl?: string;
      goal?: string;
      ask?: string;
      preset?: string;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const job = createFollowUpJob({
      eventUrl: body.eventUrl ?? "",
      goal: body.goal ?? "",
      ask: body.ask ?? "",
      preset: body.preset ?? "",
    });
    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not assign job";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
