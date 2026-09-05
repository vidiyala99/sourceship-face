import { BRAIN_PACK, SCOUT_EVENT, SCOUT_PEOPLE } from "./fixtures";
import type { Job } from "./types";

/** ~10.3s total: queued → researching → retrying flash → drafting → ready */
const STEPS: Array<{
  holdMs: number;
  patch: Partial<Job>;
}> = [
  {
    holdMs: 1500,
    patch: { status: "queued", step: "queued", attempts: 1, error: null },
  },
  {
    holdMs: 2500,
    patch: { status: "researching", step: "researching", attempts: 1, error: null },
  },
  {
    holdMs: 1800,
    patch: {
      status: "retrying",
      step: "researching",
      attempts: 2,
      retry_of_step: "researching",
      error: "research timeout (injected)",
    },
  },
  {
    holdMs: 2500,
    patch: {
      status: "drafting",
      step: "drafting",
      attempts: 2,
      retry_of_step: null,
      error: null,
    },
  },
  {
    holdMs: 2000,
    patch: {
      status: "ready",
      step: "ready",
      attempts: 2,
      retry_of_step: null,
      error: null,
      event: SCOUT_EVENT,
      people: SCOUT_PEOPLE,
      pack: BRAIN_PACK,
    },
  },
];

export function createDemoJob(eventUrl: string, goal: string): Job {
  return {
    job_id: `job_bt_${Date.now()}`,
    event_url: eventUrl,
    goal,
    status: "queued",
    step: "queued",
    attempts: 1,
    retry_of_step: null,
    error: null,
    event: null,
    people: null,
    pack: null,
  };
}

export function runDemoJob(
  job: Job,
  onUpdate: (next: Job) => void,
): () => void {
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let index = 0;
  let current = job;

  const tick = () => {
    if (cancelled || index >= STEPS.length) return;
    const step = STEPS[index];
    current = { ...current, ...step.patch };
    onUpdate(current);
    index += 1;
    if (index < STEPS.length) {
      timer = setTimeout(tick, step.holdMs);
    }
  };

  // Apply first stage immediately, then hold before advancing.
  current = { ...current, ...STEPS[0].patch };
  onUpdate(current);
  index = 1;
  timer = setTimeout(tick, STEPS[0].holdMs);

  return () => {
    cancelled = true;
    if (timer) clearTimeout(timer);
  };
}
