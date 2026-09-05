import { buildResultPack } from "./drafts";
import { researchEvent } from "./research";
import { getJob, isLocked, listJobs, patchJob, tryLock, unlock } from "./store";
import type { Job } from "./types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let workerStarted = false;

export function startWorker(): void {
  if (workerStarted) return;
  workerStarted = true;
  setInterval(() => {
    for (const job of listJobs()) {
      if (needsWork(job) && !isLocked(job.id)) {
        void runJob(job.id);
      }
    }
  }, 1500);
}

export function enqueue(jobId: string): void {
  void runJob(jobId);
}

export function kickStaleJobs(): void {
  for (const job of listJobs()) {
    if (needsWork(job) && !isLocked(job.id)) {
      void runJob(job.id);
    }
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

    if (job.stage === "queued") {
      await sleep(700);
      patchJob(jobId, {
        stage: "researching",
        retrying: false,
        activityMessage: `Opening ${hostname(job.eventUrl)} and related public pages.`,
      });
    }

    const current = getJob(jobId);
    if (!current || current.failed) return;

    let research;
    try {
      research = await researchEvent(current.eventUrl);
    } catch {
      const retried = await retryOnce(jobId, "researching", "Research fetch failed once.");
      if (!retried) return;
      try {
        research = await researchEvent(current.eventUrl);
      } catch (again) {
        fail(jobId, again);
        return;
      }
    }

    const hitNames = research.hits.map((h) => h.name).join(", ") || "no named partners yet";
    patchJob(jobId, {
      stage: "drafting",
      retrying: false,
      activityMessage: research.usedFixture
        ? `Page HTML was thin. Grounded shortlist in verified event entities: ${hitNames}.`
        : `Found ${research.hits.length} grounded entities: ${hitNames}.`,
    });

    await sleep(600);

    try {
      const pack = await buildResultPack(current.goal, research);
      patchJob(jobId, {
        stage: "ready",
        retrying: false,
        result: pack,
        activityMessage: `Done pack ready — ${pack.shortlist.length} follow-ups, confidence ${pack.overallConfidence}.`,
      });
    } catch {
      const retried = await retryOnce(jobId, "drafting", "Drafting failed once. Writing template notes.");
      if (!retried) return;
      try {
        const pack = await buildResultPack(current.goal, research);
        patchJob(jobId, {
          stage: "ready",
          retrying: false,
          result: pack,
          activityMessage: `Done pack ready after retry — ${pack.shortlist.length} follow-ups.`,
        });
      } catch (again) {
        fail(jobId, again);
      }
    }
  } finally {
    unlock(jobId);
  }
}

async function retryOnce(
  jobId: string,
  stage: Job["stage"],
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
    activityMessage: `${message} Retrying…`,
  });
  await sleep(900);
  return true;
}

function fail(jobId: string, error: unknown): void {
  const message = error instanceof Error ? error.message : "Job failed";
  patchJob(jobId, {
    failed: true,
    retrying: false,
    error: message,
    activityMessage: `Stopped: ${message}`,
  });
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
