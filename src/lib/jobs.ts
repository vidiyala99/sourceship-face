import { BURNING_TOKEN, resolveAssignment } from "./preset";
import { enqueue } from "./processor";
import { cloneJob, getJob, listJobs, patchJob, saveJob } from "./store";
import type { Job, PublicJob } from "./types";

export function createFollowUpJob(input: {
  preset?: string;
  ask?: string;
  eventUrl?: string;
  goal?: string;
}): PublicJob {
  const resolved = resolveAssignment(input);
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const job: Job = {
    id,
    type: "follow_up_event",
    title: resolved.title,
    ask: resolved.ask,
    eventUrl: resolved.eventUrl || BURNING_TOKEN.eventUrl,
    goal: resolved.goal,
    stage: "queued",
    retrying: false,
    failed: false,
    statusNote: "Mira took the handoff.",
    createdAt: now,
    updatedAt: now,
    retryCount: 0,
    activity: [{ at: now, message: "Mira took the handoff." }],
    crew: [],
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
  const selected = new Set(
    itemIds === "all" ? job.result.shortlist.map((i) => i.id) : itemIds,
  );
  const result = {
    ...job.result,
    shortlist: job.result.shortlist.map((item) =>
      selected.has(item.id) ? { ...item, approved: true } : item,
    ),
  };
  return patchJob(id, {
    result,
    activityMessage: `Approved ${result.shortlist.filter((i) => i.approved).length}/${result.shortlist.length} notes. Not sent.`,
  });
}
