import { NextResponse } from "next/server";
import { publicJob } from "@/lib/jobs";
import { kickStaleJobs } from "@/lib/processor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  kickStaleJobs();
  const { id } = await context.params;
  const job = publicJob(id);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json({ job });
}
