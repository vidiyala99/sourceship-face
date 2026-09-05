import { CREW_SCRIPT, FIXTURE_PACK } from "./fixture";
import { getJob, isLocked, listJobs, patchJob, tryLock, unlock } from "./store";
import type { CrewMessage, Job } from "./types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let workerStarted = false;

export function startWorker(): void {
  if (workerStarted) return;
  workerStarted = true;
  setInterval(() => {
    for (const job of listJobs()) {
      if (needsWork(job) && !isLocked(job.id)) void runJob(job.id);
    }
  }, 1200);
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

    const already = job.crew?.length ?? 0;
    for (const step of CREW_SCRIPT.slice(already)) {
      const current = getJob(jobId);
      if (!current || current.failed) return;
      const message: CrewMessage = {
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        agent: step.agent,
        text: step.text,
      };
      patchJob(jobId, {
        stage: step.stage,
        retrying: false,
        crew: [...(current.crew ?? []), message],
        activityMessage: step.text,
        result: step.stage === "ready" ? FIXTURE_PACK : current.result,
      });
      await sleep(step.delay);
    }
  } finally {
    unlock(jobId);
  }
}
