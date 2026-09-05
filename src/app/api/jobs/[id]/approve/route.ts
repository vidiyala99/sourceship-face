import { NextResponse } from "next/server";
import { approveItems } from "@/lib/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  let body: { itemIds?: string[]; all?: boolean } = {};
  try {
    body = (await request.json()) as { itemIds?: string[]; all?: boolean };
  } catch {
    body = {};
  }

  const job = approveItems(id, body.all || !body.itemIds?.length ? "all" : body.itemIds);
  if (!job) {
    return NextResponse.json(
      { error: "Nothing to approve yet — wait for the Done pack." },
      { status: 400 },
    );
  }
  return NextResponse.json({ job });
}
