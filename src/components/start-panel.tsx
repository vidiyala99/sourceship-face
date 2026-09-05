"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { BURNING_TOKEN, BURNING_TOKEN_STARTER } from "@/lib/preset";

export function StartPanel({ error }: { error?: string | null }) {
  const goalRef = useRef<HTMLTextAreaElement>(null);

  function fillStarter() {
    const field = goalRef.current;
    if (!field) return;
    field.value = BURNING_TOKEN.ask;
    field.focus();
    field.setSelectionRange(field.value.length, field.value.length);
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <p className="text-[11px] font-medium tracking-[0.2em] text-[#e8a36a] uppercase">
        Your desk
      </p>
      <h1 className="font-serif mt-2 text-[2.15rem] leading-[1.08] tracking-tight sm:text-5xl">
        Assign it. Walk away.
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-6 text-[#cfc6b8] sm:text-base sm:leading-7">
        Tell the crew what to handle. They look it up, draft, and leave a pack.
      </p>

      <form action="/api/jobs/form" method="post" className="mt-7 sm:mt-8">
        <label htmlFor="desk-goal" className="block">
          <span className="sr-only">What should your crew handle?</span>
          <textarea
            id="desk-goal"
            ref={goalRef}
            name="goal"
            required
            rows={3}
            maxLength={280}
            autoComplete="off"
            placeholder="What should your crew handle?"
            className="min-h-[6.5rem] w-full resize-none rounded-2xl border border-white/10 bg-[#171512] px-4 py-3.5 text-base leading-6 text-[#f3eee6] outline-none placeholder:text-[#f3eee6]/35 focus:border-[#e8a36a]/55"
          />
        </label>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] tracking-wide text-[#f3eee6]/35">
            Starter
          </span>
          <button
            type="button"
            onClick={fillStarter}
            className="inline-flex h-8 items-center rounded-full border border-[#e8a36a]/35 bg-[#e8a36a]/8 px-3 text-xs text-[#e8a36a] hover:border-[#e8a36a]/60 hover:bg-[#e8a36a]/14"
          >
            {BURNING_TOKEN_STARTER}
          </button>
        </div>

        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}

        <AssignButton />
      </form>
    </div>
  );
}

function AssignButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#e8a36a] px-6 text-sm font-medium text-[#1a120c] hover:bg-[#f0b67a] disabled:opacity-70 sm:mt-6 sm:w-auto sm:px-8 sm:text-base"
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#1a120c]" />
          Assigning…
        </span>
      ) : (
        "Assign to the crew"
      )}
    </button>
  );
}
