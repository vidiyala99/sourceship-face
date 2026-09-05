"use client";

import { useMemo, useState } from "react";
import type { Job } from "@/lib/types";

export function ResultPack({ job }: { job: Job }) {
  const items = job.pack?.shortlist ?? [];
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  const selectedIds = useMemo(
    () => items.filter((item) => selected[item.person_id]).map((item) => item.person_id),
    [items, selected],
  );

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 4000);
  }

  function approve(ids: string[]) {
    if (ids.length === 0) {
      showToast("Select at least one person first.");
      return;
    }
    setApproved((prev) => {
      const next = { ...prev };
      for (const id of ids) next[id] = true;
      return next;
    });
    showToast(
      `Approved ${ids.length} ${ids.length === 1 ? "person" : "people"} — nothing was sent.`,
    );
  }

  function toggle(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (!job.pack || !job.event) return null;

  return (
    <section className="card" aria-label="Done pack">
      <div className="pack-head">
        <div>
          <h2>Done pack</h2>
          <p className="meta" style={{ marginBottom: 0 }}>
            {job.pack.summary}
          </p>
        </div>
        <div className="metrics">
          {job.pack.metrics.n_people} people · avg{" "}
          {job.pack.metrics.avg_score.toFixed(2)} · grounded{" "}
          {Math.round(job.pack.metrics.grounded_pct * 100)}%
        </div>
      </div>

      <h3>Event</h3>
      <dl className="event-grid">
        <div>
          <dt>Title</dt>
          <dd>{job.event.title}</dd>
        </div>
        <div>
          <dt>When</dt>
          <dd>{job.event.when}</dd>
        </div>
        <div>
          <dt>Host</dt>
          <dd>{job.event.host}</dd>
        </div>
        <div>
          <dt>Venue</dt>
          <dd>{job.event.venue}</dd>
        </div>
      </dl>

      {job.people && job.people.length > 0 && (
        <>
          <h3>Researched</h3>
          <div className="people">
            {job.people.map((person) => (
              <span key={person.person_id} className="person-chip" title={person.context}>
                {person.name} · {person.role}
              </span>
            ))}
          </div>
        </>
      )}

      <h3>Shortlist — who / why / note</h3>
      <div className="shortlist">
        {items.map((item) => {
          const isPicked = !!selected[item.person_id];
          const isApproved = !!approved[item.person_id];
          return (
            <label
              key={item.person_id}
              className={`person-card${isApproved ? " approved" : isPicked ? " picked" : ""}`}
            >
              <input
                type="checkbox"
                checked={isPicked}
                onChange={() => toggle(item.person_id)}
                aria-label={`Select ${item.name}`}
              />
              <div>
                <div className="who">{item.name}</div>
                <div className="role">{item.role}</div>
                <div className="field">
                  <b>Why</b>
                  {item.why}
                </div>
                <div className="field">
                  <b>Note</b>
                  {item.note}
                </div>
                {isApproved && (
                  <div className="field">
                    <b>Status</b>
                    Approved (not sent)
                  </div>
                )}
              </div>
              <div className="score">{item.score.toFixed(2)}</div>
            </label>
          );
        })}
      </div>

      <div className="actions">
        <button
          type="button"
          className="btn"
          onClick={() => approve(selectedIds)}
        >
          Approve selected
        </button>
        <button
          type="button"
          className="btn ok"
          onClick={() => approve(items.map((item) => item.person_id))}
        >
          Approve all
        </button>
      </div>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </section>
  );
}
