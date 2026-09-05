export const PIPELINE_STAGES = [
  "queued",
  "researching",
  "drafting",
  "ready",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export type EntityKind = "org" | "person" | "venue";

export type JobType = "follow_up_event";

export type CrewAgent = "mira" | "reed" | "tess";

export type SourceRef = {
  title: string;
  url: string;
  fetched: boolean;
};

export type FollowUpNote = {
  subject: string;
  body: string;
};

export type ShortlistItem = {
  id: string;
  name: string;
  kind: EntityKind;
  role: string;
  why: string;
  source: string;
  sourceUrl?: string;
  note: FollowUpNote;
  confidence: number;
  approved: boolean;
};

export type JobResult = {
  eventTitle: string;
  summary: string;
  sources: SourceRef[];
  shortlist: ShortlistItem[];
  overallConfidence: number;
  draftMode: "llm" | "template";
};

export type ActivityEntry = {
  at: string;
  message: string;
};

export type CrewMessage = {
  id: string;
  at: string;
  agent: CrewAgent;
  text: string;
};

export type Job = {
  id: string;
  type: JobType;
  title: string;
  ask: string;
  eventUrl: string;
  goal: string;
  stage: PipelineStage;
  retrying: boolean;
  failed: boolean;
  statusNote: string;
  createdAt: string;
  updatedAt: string;
  retryCount: number;
  activity: ActivityEntry[];
  crew: CrewMessage[];
  result?: JobResult;
  error?: string;
};

export type PublicJob = Job;

export type ResearchHit = {
  name: string;
  kind: EntityKind;
  role: string;
  why: string;
  source: string;
  sourceUrl?: string;
  evidence: string;
};

export type ResearchBundle = {
  eventTitle: string;
  sources: SourceRef[];
  pageText: string;
  hits: ResearchHit[];
  usedFixture: boolean;
};
