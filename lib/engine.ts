import { API_BASE_URL } from "./config";
import type { CreateJobResponse, Job } from "./types";

export async function createJob(
  eventUrl: string,
  goal: string,
): Promise<CreateJobResponse> {
  const res = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_url: eventUrl, goal }),
  });
  if (!res.ok) {
    throw new Error(`Engine POST /jobs failed (${res.status})`);
  }
  return (await res.json()) as CreateJobResponse;
}

export async function fetchJob(jobId: string): Promise<Job> {
  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
  if (!res.ok) {
    throw new Error(`Engine GET /jobs/${jobId} failed (${res.status})`);
  }
  return (await res.json()) as Job;
}

export function pollJob(
  jobId: string,
  onUpdate: (job: Job) => void,
  onError: (message: string) => void,
): () => void {
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const tick = async () => {
    if (cancelled) return;
    try {
      const job = await fetchJob(jobId);
      if (cancelled) return;
      onUpdate(job);
      if (job.status === "ready" || job.status === "failed") return;
    } catch (err) {
      if (cancelled) return;
      onError(err instanceof Error ? err.message : "Engine poll failed");
    }
    timer = setTimeout(tick, 1000);
  };

  void tick();

  return () => {
    cancelled = true;
    if (timer) clearTimeout(timer);
  };
}
