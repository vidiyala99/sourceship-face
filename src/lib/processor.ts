import { buildResultPack } from "./drafts";
import { sponsorStatus } from "./env";
import { linkupConfigured } from "./linkup";
import { llmAvailable, llmProvider } from "./llm";
import { researchEvent } from "./research";
import { getJob, isLocked, listJobs, patchJob, tryLock, unlock } from "./store";
import type { CrewAgent, CrewMessage, Job } from "./types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let workerStarted = false;

export function startWorker(): void {
  if (workerStarted) return;
  workerStarted = true;
  setInterval(() => {
    for (const job of listJobs()) {
      if (needsWork(job) && !isLocked(job.id)) void runJob(job.id);
    }
  }, 1500);
}

export function enqueue(jobId: string): void {
  void runJob(jobId);
}

export function kickStaleJobs(): void {
  for (const job of listJobs()) {
    if (needsWork(job) && !isLocked(job.id)) void runJob(job.id);
  }
}

function needsWork(job: Job): boolean {
  return !job.failed && job.stage !== "ready";
}

async function runJob(jobId: string): Promise<void> {
  if (!tryLock(jobId)) return;
  try {
    const job = getJob(jobId);
    if (!job || job.failed || job.stage === "ready") return;
    const sponsors = sponsorStatus();

    if (job.stage === "queued") {
      await say(
        jobId,
        "mira",
        `Got it: ${job.ask}. Reed researches live sources. Tess drafts only from those names.`,
        { stage: "queued" },
      );
      await say(
        jobId,
        "mira",
        sponsors.linkup
          ? "LinkUp is on. Reed, use it — no invented people."
          : "LinkUp key is not set yet. Reed, use public pages only.",
        { stage: "researching" },
      );
    }

    const current = getJob(jobId);
    if (!current || current.failed) return;

    let research;
    try {
      await say(
        jobId,
        "reed",
        linkupConfigured()
          ? `Searching LinkUp and opening ${hostname(current.eventUrl)}.`
          : `Opening ${hostname(current.eventUrl)} and related public pages.`,
        { stage: "researching" },
      );
      research = await researchEvent(current.eventUrl);
    } catch {
      const retried = await retryOnce(
        jobId,
        "researching",
        "reed",
        "Research failed once. Retrying the live fetch.",
      );
      if (!retried) return;
      try {
        research = await researchEvent(current.eventUrl);
      } catch (again) {
        fail(jobId, again);
        return;
      }
    }

    const names =
      research.hits.map((h) => h.name).join(", ") || "no grounded names yet";
    await say(
      jobId,
      "reed",
      research.usedLinkup
        ? `LinkUp + pages landed on: ${names}.`
        : `Public pages landed on: ${names}.`,
      { stage: "researching" },
    );
    await say(
      jobId,
      "mira",
      research.hits.length
        ? "Tess, draft coffee-chat notes from that list only."
        : "Thin live results. Tess, don’t invent anyone — empty is honest.",
      { stage: "drafting" },
    );

    await say(
      jobId,
      "tess",
      llmAvailable()
        ? `Writing notes and a score via ${llmProvider()}.`
        : "No Nebius/OpenAI key yet. Writing notes from the live entities.",
      { stage: "drafting" },
    );

    try {
      const pack = await buildResultPack(current.goal, research);
      await say(
        jobId,
        "tess",
        `Pack is ${pack.shortlist.length} notes, confidence ${pack.overallConfidence}.`,
        { stage: "drafting" },
      );
      await say(
        jobId,
        "mira",
        "Outcome is on your desk. You approve — we don’t send.",
        { stage: "ready", result: pack },
      );
    } catch {
      const retried = await retryOnce(
        jobId,
        "drafting",
        "tess",
        "Drafting failed once. Retrying.",
      );
      if (!retried) return;
      try {
        const pack = await buildResultPack(current.goal, research);
        await say(jobId, "mira", "Pack ready after retry.", {
          stage: "ready",
          result: pack,
        });
      } catch (again) {
        fail(jobId, again);
      }
    }
  } finally {
    unlock(jobId);
  }
}

async function say(
  jobId: string,
  agent: CrewAgent,
  text: string,
  extra: Partial<Job> = {},
): Promise<void> {
  const job = getJob(jobId);
  if (!job) return;
  const message: CrewMessage = {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    agent,
    text,
  };
  patchJob(jobId, {
    ...extra,
    crew: [...(job.crew ?? []), message],
    activityMessage: text,
  });
  await sleep(500);
}

async function retryOnce(
  jobId: string,
  stage: Job["stage"],
  agent: CrewAgent,
  message: string,
): Promise<boolean> {
  const job = getJob(jobId);
  if (!job) return false;
  if (job.retryCount >= 1) {
    fail(jobId, new Error(message));
    return false;
  }
  patchJob(jobId, {
    stage,
    retrying: true,
    retryCount: job.retryCount + 1,
  });
  await say(jobId, agent, message, { stage, retrying: true });
  await sleep(800);
  return true;
}

function fail(jobId: string, error: unknown): void {
  const message = error instanceof Error ? error.message : "Job failed";
  void say(jobId, "mira", `Stopped: ${message}`, {
    failed: true,
    retrying: false,
    error: message,
  });
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
