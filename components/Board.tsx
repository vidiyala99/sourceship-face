"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ResultPack } from "@/components/ResultPack";
import { StageStepper } from "@/components/StageStepper";
import {
  API_BASE_URL,
  DEFAULT_EVENT_URL,
  DEFAULT_GOAL,
  DEMO_MODE,
} from "@/lib/config";
import { createDemoJob, runDemoJob } from "@/lib/demo";
import { createJob, pollJob } from "@/lib/engine";
import type { Job } from "@/lib/types";

export function Board() {
  const [eventUrl, setEventUrl] = useState(DEFAULT_EVENT_URL);
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [job, setJob] = useState<Job | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      stopRef.current?.();
    };
  }, []);

  async function onAssign(event: FormEvent) {
    event.preventDefault();
    const url = eventUrl.trim();
    const nextGoal = goal.trim();
    if (!url || !nextGoal) {
      setError("Paste an event URL and a short goal.");
      return;
    }

    stopRef.current?.();
    setError(null);
    setBusy(true);

    if (DEMO_MODE) {
      const demo = createDemoJob(url, nextGoal);
      setJob(demo);
      stopRef.current = runDemoJob(demo, (next) => {
        setJob(next);
        if (next.status === "ready" || next.status === "failed") {
          setBusy(false);
        }
      });
      return;
    }

    try {
      const created = await createJob(url, nextGoal);
      const placeholder: Job = {
        job_id: created.job_id,
        event_url: url,
        goal: nextGoal,
        status: "queued",
        event: null,
        people: null,
        pack: null,
      };
      setJob(placeholder);
      stopRef.current = pollJob(
        created.job_id,
        (next) => {
          setJob(next);
          if (next.status === "ready" || next.status === "failed") {
            setBusy(false);
          }
        },
        (message) => {
          setError(message);
          setBusy(false);
        },
      );
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Could not assign job.");
    }
  }

  const inFlight =
    job &&
    job.status !== "ready" &&
    job.status !== "failed";

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <div className="brand">SourceShip</div>
          <div className="tag">Assign work. Walk away. Come back to done.</div>
        </div>
        <span className="chip">{DEMO_MODE ? "Demo mode" : `Live · ${API_BASE_URL}`}</span>
      </header>

      <h1 className="job-type">Follow up this event</h1>
      <p className="lede">
        One job on the board. Paste a public event URL and a short goal, assign it,
        and leave. When you come back, approve the pack — nothing is sent.
      </p>

      <form className="card" onSubmit={onAssign}>
        <h2>Assign to teammate</h2>
        <label htmlFor="event_url">Event URL</label>
        <input
          id="event_url"
          name="event_url"
          type="url"
          value={eventUrl}
          onChange={(e) => setEventUrl(e.target.value)}
          placeholder={DEFAULT_EVENT_URL}
          required
        />
        <label htmlFor="goal">Goal</label>
        <input
          id="goal"
          name="goal"
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder={DEFAULT_GOAL}
          required
        />
        <div className="actions">
          <button className="btn" type="submit" disabled={busy}>
            Assign
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>

      {job && (
        <section className="card" aria-live="polite">
          <h2>Job · Follow up this event</h2>
          <p className="meta">
            {job.event_url}
            <br />
            Goal: {job.goal}
          </p>
          <StageStepper status={job.status} />
          {inFlight && (
            <div className="walkaway">
              Assigned. Walk away — a done pack will be here when you get back.
            </div>
          )}
          {job.status === "retrying" && (
            <div className="retry-banner">
              Retrying research · attempts={job.attempts ?? 2}
              {job.error ? ` · ${job.error}` : ""}
            </div>
          )}
          {job.status === "failed" && (
            <div className="fail-banner">{job.error || "Job failed."}</div>
          )}
          {job.status === "ready" && (
            <p className="meta" style={{ color: "#166534", fontWeight: 650 }}>
              Ready. Assign → leave → done.
            </p>
          )}
        </section>
      )}

      {job?.status === "ready" && <ResultPack job={job} />}
    </main>
  );
}
