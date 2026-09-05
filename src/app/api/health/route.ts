import { NextResponse } from "next/server";
import { sponsorStatus } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sponsors = sponsorStatus();
  return NextResponse.json({
    ok: true,
    worker: "in-process",
    ...sponsors,
  });
}
