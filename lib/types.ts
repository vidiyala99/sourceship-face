export type JobStatus =
  | "queued"
  | "researching"
  | "drafting"
  | "ready"
  | "failed"
  | "retrying";

export type EventInfo = {
  url: string;
  title: string;
  when: string;
  host: string;
  venue: string;
};

export type Person = {
  person_id: string;
  name: string;
  role: string;
  org: string;
  context: string;
  links: string[];
};

export type ShortlistItem = {
  person_id: string;
  name: string;
  role: string;
  why: string;
  note: string;
  score: number;
};

export type Pack = {
  shortlist: ShortlistItem[];
  summary: string;
  metrics: {
    avg_score: number;
    n_people: number;
    latency_ms: number;
    grounded_pct: number;
  };
};

export type Job = {
  job_id: string;
  event_url: string;
  goal: string;
  status: JobStatus;
  step?: string | null;
  attempts?: number;
  retry_of_step?: string | null;
  error?: string | null;
  event: EventInfo | null;
  people: Person[] | null;
  pack: Pack | null;
};

export type CreateJobResponse = {
  job_id: string;
};
