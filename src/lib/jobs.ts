import { enqueue } from "./processor";
import { cloneJob, getJob, listJobs, patchJob, saveJob } from "./store";
import type { Job, PublicJob } from "./types";

export function createFollowUpJob(input: {
  eventUrl: string;
  goal: string;
}): PublicJob {
  const eventUrl = normalizeUrl(input.eventUrl);
  const goal = input.goal.trim();
  if (!eventUrl) throw new Error("Paste a public event URL.");
  if (!goal) throw new Error("Add a short goal so Scout knows what to optimize for.");

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const job: Job = {
    id,
    type: "follow_up_event",
    title: `Follow up: ${shortHost(eventUrl)}`,
    eventUrl,
    goal,
    stage: "queued",
    retrying: false,
    failed: false,
    statusNote: "Queued on Scout's desk.",
    createdAt: now,
    updatedAt: now,
    retryCount: 0,
    activity: [{ at: now, message: "Queued on Scout's desk." }],
  };
  saveJob(job);
  enqueue(id);
  return cloneJob(job);
}

export function publicJobs(): PublicJob[] {
  return listJobs().map(cloneJob);
}

export function publicJob(id: string): PublicJob | undefined {
  const job = getJob(id);
  return job ? cloneJob(job) : undefined;
}

export function approveItems(
  id: string,
  itemIds: string[] | "all",
): PublicJob | undefined {
  const job = getJob(id);
  if (!job?.result) return undefined;
  const selected = new Set(itemIds === "all" ? job.result.shortlist.map((i) => i.id) : itemIds);
  const result = {
    ...job.result,
    shortlist: job.result.shortlist.map((item) =>
      selected.has(item.id) ? { ...item, approved: true } : item,
    ),
  };
  const approvedCount = result.shortlist.filter((i) => i.approved).length;
  return patchJob(id, {
    result,
    activityMessage: `Marked ${approvedCount}/${result.shortlist.length} notes approved (not sent).`,
  });
}

function normalizeUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

function shortHost(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname}${u.pathname}`.replace(/\/$/, "");
  } catch {
    return url;
  }
}
