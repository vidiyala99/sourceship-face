import { completeJson, llmAvailable } from "./llm";
import type { JobResult, ResearchBundle, ShortlistItem } from "./types";

export async function buildResultPack(
  goal: string,
  research: ResearchBundle,
): Promise<JobResult> {
  const templateItems = research.hits.map((hit, index) =>
    itemFromHit(hit, goal, index, research),
  );

  let items = templateItems;
  let draftMode: JobResult["draftMode"] = "template";

  if (llmAvailable() && templateItems.length > 0) {
    const rewritten = await rewriteWithLlm(goal, research, templateItems);
    if (rewritten) {
      items = rewritten;
      draftMode = "llm";
    }
  }

  const fetchedCount = research.sources.filter((s) => s.fetched).length;
  const overall = scorePack(items, fetchedCount, research.usedFixture);

  return {
    eventTitle: research.eventTitle,
    summary: summaryFor(goal, items, research),
    sources: research.sources,
    shortlist: items,
    overallConfidence: overall,
    draftMode,
  };
}

function itemFromHit(
  hit: ResearchBundle["hits"][number],
  goal: string,
  index: number,
  research: ResearchBundle,
): ShortlistItem {
  const confidence = scoreItem(hit, research);
  return {
    id: `item-${index + 1}-${slug(hit.name)}`,
    name: hit.name,
    kind: hit.kind,
    role: hit.role,
    why: hit.why,
    source: hit.source,
    sourceUrl: hit.sourceUrl,
    note: templateNote(hit.name, hit.role, goal, research.eventTitle),
    confidence,
    approved: false,
  };
}

function templateNote(
  name: string,
  role: string,
  goal: string,
  eventTitle: string,
): { subject: string; body: string } {
  const subject = `Follow-up after ${shortTitle(eventTitle)} — ${name}`;
  const body = [
    `Hi ${name} team —`,
    "",
    `I just came through ${shortTitle(eventTitle)} (SF kickoff at Frontier Tower + the 7-day online build). You showed up as ${role.toLowerCase()}, so you are on a tight shortlist for: ${goal}.`,
    "",
    "This note is send-ready, not a pitch deck. Two concrete asks:",
    "1) A thank-you / debrief if you were in the room or sponsored the week.",
    "2) Whether a small partnership next step is even useful this month (credits, workshop, or intro) — no is a fine answer.",
    "",
    "If this should go to someone else on your side, point me there.",
    "",
    "Thanks,",
    "Scout (via SourceShip)",
  ].join("\n");
  return { subject, body };
}

async function rewriteWithLlm(
  goal: string,
  research: ResearchBundle,
  items: ShortlistItem[],
): Promise<ShortlistItem[] | null> {
  const prompt = [
    `Goal: ${goal}`,
    `Event: ${research.eventTitle}`,
    "Entities (do not add new names):",
    JSON.stringify(
      items.map((i) => ({
        id: i.id,
        name: i.name,
        role: i.role,
        why: i.why,
      })),
    ),
    "Return JSON: { notes: [{ id, subject, body }] } with one note per id.",
    "Each body: 90-140 words, send-ready, specific to that org, no invented people.",
  ].join("\n");

  const raw = await completeJson(prompt);
  if (!raw) return null;
  const parsed = parseNotes(raw);
  if (!parsed) return null;

  return items.map((item) => {
    const note = parsed.find((n) => n.id === item.id);
    if (!note?.subject || !note?.body) return item;
    return { ...item, note: { subject: note.subject, body: note.body } };
  });
}

function parseNotes(
  raw: string,
): { id: string; subject: string; body: string }[] | null {
  const json = raw.replace(/^```json\s*/i, "").replace(/```$/i, "");
  try {
    const data = JSON.parse(json) as {
      notes?: { id: string; subject: string; body: string }[];
    };
    return data.notes ?? null;
  } catch {
    return null;
  }
}

function scoreItem(
  hit: ResearchBundle["hits"][number],
  research: ResearchBundle,
): number {
  let score = 58;
  if (hit.evidence) score += 10;
  if (research.sources.some((s) => s.fetched)) score += 8;
  if (!research.usedFixture) score += 8;
  if (/host|venue|sponsor/i.test(hit.role)) score += 6;
  return Math.min(92, score);
}

function scorePack(
  items: ShortlistItem[],
  fetchedCount: number,
  usedFixture: boolean,
): number {
  if (items.length === 0) return 22;
  const avg = items.reduce((sum, item) => sum + item.confidence, 0) / items.length;
  let score = Math.round(avg);
  score += Math.min(8, fetchedCount * 3);
  if (usedFixture) score -= 8;
  return Math.max(35, Math.min(93, score));
}

function summaryFor(
  goal: string,
  items: ShortlistItem[],
  research: ResearchBundle,
): string {
  const names = items.map((i) => i.name).join(", ");
  const grounding = research.usedFixture
    ? "Live HTML was thin, so Scout grounded names in the verified public event pages (Luma + burningtoken.dev) — no invented people."
    : "Names are grounded in fetched public pages, not a random contact list.";
  return `Shortlist for “${goal}”: ${names || "nobody clear yet"}. ${grounding}`;
}

function shortTitle(title: string): string {
  return title.replace(/\s*·\s*Luma$/i, "").trim() || "Burning Token";
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
