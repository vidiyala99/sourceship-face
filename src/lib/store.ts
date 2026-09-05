import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { ActivityEntry, Job } from "./types";

type Store = {
  jobs: Map<string, Job>;
  locks: Set<string>;
  loaded: boolean;
};

const STORE_PATH = process.env.JOB_STORE_PATH || "/tmp/sourceship-jobs.json";

const globalForStore = globalThis as typeof globalThis & {
  __sourceship?: Store;
};

function getStore(): Store {
  if (!globalForStore.__sourceship) {
    globalForStore.__sourceship = {
      jobs: new Map(),
      locks: new Set(),
      loaded: false,
    };
    hydrate(globalForStore.__sourceship);
  }
  return globalForStore.__sourceship;
}

function hydrate(store: Store): void {
  if (store.loaded) return;
  store.loaded = true;
  try {
    if (!existsSync(STORE_PATH)) return;
    const jobs = JSON.parse(readFileSync(STORE_PATH, "utf8")) as Job[];
    for (const job of jobs) {
      job.retrying = false;
      store.jobs.set(job.id, job);
    }
  } catch {
    // Demo store — ignore corrupt files.
  }
}

function persist(store: Store): void {
  try {
    writeFileSync(STORE_PATH, JSON.stringify([...store.jobs.values()]));
  } catch {
    // Best-effort only.
  }
}

export function listJobs(): Job[] {
  return [...getStore().jobs.values()].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  );
}

export function getJob(id: string): Job | undefined {
  return getStore().jobs.get(id);
}

export function saveJob(job: Job): Job {
  const store = getStore();
  store.jobs.set(job.id, job);
  persist(store);
  return job;
}

export function patchJob(
  id: string,
  patch: Partial<Job> & { activityMessage?: string },
): Job | undefined {
  const current = getJob(id);
  if (!current) return undefined;
  const next: Job = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  if (patch.activityMessage) {
    const entry: ActivityEntry = {
      at: next.updatedAt,
      message: patch.activityMessage,
    };
    next.activity = [...current.activity, entry].slice(-12);
    next.statusNote = patch.activityMessage;
  }
  return saveJob(next);
}

export function tryLock(id: string): boolean {
  const { locks } = getStore();
  if (locks.has(id)) return false;
  locks.add(id);
  return true;
}

export function unlock(id: string): void {
  getStore().locks.delete(id);
}

export function isLocked(id: string): boolean {
  return getStore().locks.has(id);
}

export function cloneJob(job: Job): Job {
  return structuredClone(job);
}
