import { completeJson, llmAvailable, llmProvider } from "./llm";
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
  let llmScore: number | null = null;

  if (llmAvailable() && templateItems.length > 0) {
    const rewritten = await rewriteWithLlm(goal, research, templateItems);
    if (rewritten) {
      items = rewritten.items;
      llmScore = rewritten.score;
      draftMode = "llm";
    }
  }

  const fetchedCount = research.sources.filter((s) => s.fetched).length;
  const overall =
    llmScore ?? scorePack(items, fetchedCount, research.usedLinkup);

  return {
    eventTitle: research.eventTitle,
    summary: summaryFor(goal, items, research, draftMode),
    sources: research.sources,
    shortlist: items,
    overallConfidence: overall,
    draftMode,
    researchMode: research.usedLinkup
      ? "linkup"
      : items.length
        ? "pages"
        : "empty",
  };
}

function itemFromHit(
  hit: ResearchBundle["hits"][number],
  goal: string,
  index: number,
  research: ResearchBundle,
): ShortlistItem {
  return {
    id: `item-${index + 1}-${slug(hit.name)}`,
    name: hit.name,
    kind: hit.kind,
    role: hit.role,
    why: hit.why,
    source: hit.source,
    sourceUrl: hit.sourceUrl,
    note: templateNote(hit.name, hit.role, goal, research.eventTitle),
    confidence: scoreItem(hit, research),
    approved: false,
  };
}

function templateNote(
  name: string,
  role: string,
  goal: string,
  eventTitle: string,
): { subject: string; body: string } {
  const subject = `Coffee after ${shortTitle(eventTitle)}? — ${name}`;
  const body = [
    `Hi ${name} team —`,
    "",
    `I was at ${shortTitle(eventTitle)} this weekend (Frontier Tower + the online week). You showed up as ${role.toLowerCase()}, so you’re on a short list for: ${goal}.`,
    "",
    "Would you have 20 minutes for a coffee chat — a thank-you, and whether a small next step is even useful? No is a fine answer.",
    "",
    "If this should go to someone else, point me there.",
    "",
    "Thanks,",
  ].join("\n");
  return { subject, body };
}

async function rewriteWithLlm(
  goal: string,
  research: ResearchBundle,
  items: ShortlistItem[],
): Promise<{ items: ShortlistItem[]; score: number | null } | null> {
  const prompt = [
    `Goal: ${goal}`,
    `Event: ${research.eventTitle}`,
    `Draft via: ${llmProvider() ?? "llm"}`,
    "Entities from live research (do not add names):",
    JSON.stringify(
      items.map((i) => ({
        id: i.id,
        name: i.name,
        role: i.role,
        why: i.why,
        evidence: research.hits.find((h) => h.name === i.name)?.evidence ?? "",
      })),
    ),
    "Return JSON: { score: number 0-100, notes: [{ id, subject, body, confidence }] }",
    "Coffee-chat tone, 80-130 words, thank-you first, no invented people.",
    "score = how well the shortlist is grounded in the provided evidence.",
  ].join("\n");

  const raw = await completeJson(prompt);
  if (!raw) return null;
  const parsed = parsePack(raw);
  if (!parsed) return null;

  const next = items.map((item) => {
    const note = parsed.notes.find((n) => n.id === item.id);
    if (!note?.subject || !note?.body) return item;
    return {
      ...item,
      confidence: clampScore(note.confidence ?? item.confidence),
      note: { subject: note.subject, body: note.body },
    };
  });

  return {
    items: next,
    score: parsed.score == null ? null : clampScore(parsed.score),
  };
}

function parsePack(raw: string): {
  score?: number;
  notes: { id: string; subject: string; body: string; confidence?: number }[];
} | null {
  const json = raw.replace(/^```json\s*/i, "").replace(/```$/i, "");
  try {
    const data = JSON.parse(json) as {
      score?: number;
      notes?: { id: string; subject: string; body: string; confidence?: number }[];
    };
    if (!data.notes?.length) return null;
    return { score: data.score, notes: data.notes };
  } catch {
    return null;
  }
}

function scoreItem(
  hit: ResearchBundle["hits"][number],
  research: ResearchBundle,
): number {
  let score = 56;
  if (hit.evidence) score += 12;
  if (research.usedLinkup) score += 10;
  if (research.sources.some((s) => s.fetched)) score += 8;
  if (/host|venue|sponsor/i.test(hit.role)) score += 6;
  return clampScore(score);
}

function scorePack(
  items: ShortlistItem[],
  fetchedCount: number,
  usedLinkup: boolean,
): number {
  if (items.length === 0) return 24;
  const avg =
    items.reduce((sum, item) => sum + item.confidence, 0) / items.length;
  let score = Math.round(avg);
  score += Math.min(8, fetchedCount * 2);
  if (usedLinkup) score += 6;
  return clampScore(score);
}

function summaryFor(
  goal: string,
  items: ShortlistItem[],
  research: ResearchBundle,
  draftMode: JobResult["draftMode"],
): string {
  const names = items.map((i) => i.name).join(", ") || "nobody grounded yet";
  const via = research.usedLinkup
    ? "live research and public pages"
    : "public event pages";
  const drafts =
    draftMode === "llm"
      ? "Notes drafted from what we found."
      : "Drafting from what we found.";
  return `Shortlist for “${goal}”: ${names}. Grounded in ${via}. ${drafts}`;
}

function shortTitle(title: string): string {
  return title.replace(/\s*·\s*Luma$/i, "").trim() || "Burning Token";
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.max(20, Math.min(96, Math.round(value)));
}
