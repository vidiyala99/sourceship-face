import type { ReactNode } from "react";
import Link from "next/link";

export function Landing({ error }: { error?: string | null }) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#0b0a09] text-[#f3eee6]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-20%] h-64 w-64 rounded-full bg-[#c45c26]/20 blur-[100px] sm:right-[-10%] sm:h-[28rem] sm:w-[28rem] sm:blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-20%] h-56 w-56 rounded-full bg-[#3d5c4f]/25 blur-[100px] sm:left-[-10%] sm:h-[26rem] sm:w-[26rem] sm:blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#f3eee6_0.6px,transparent_0.6px)] [background-size:18px_18px]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2.5">
          <Mark />
          <span className="text-xs font-medium tracking-[0.16em] uppercase sm:text-sm sm:tracking-[0.18em]">
            SourceShip
          </span>
        </div>
        <p className="hidden text-xs tracking-wide text-[#f3eee6]/50 md:block">
          An assistant crew for the work after the room
        </p>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 px-4 pb-10 pt-2 sm:gap-10 sm:px-6 sm:pt-6 lg:min-h-[calc(100dvh-5rem)] lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:pb-16 lg:pt-4">
        <section className="max-w-xl">
          <p className="text-[11px] font-medium tracking-[0.2em] text-[#e8a36a] uppercase">
            Hand it off. Stay on the hard problem.
          </p>
          <h1 className="font-serif mt-3 text-[2.35rem] leading-[1.05] tracking-tight text-[#f7f1e8] sm:mt-4 sm:text-6xl lg:text-7xl">
            You have an
            <br />
            assistant now.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-6 text-[#d9d0c3] sm:mt-5 sm:text-lg sm:leading-7">
            Tell them what matters. They look things up, gather what is real,
            talk it through, and bring back an outcome.
          </p>

          <Link
            href="/app"
            className="group mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#e8a36a] px-6 text-[15px] font-medium text-[#1a120c] transition hover:bg-[#f0b67a] sm:mt-8 sm:w-auto sm:px-8 sm:text-base"
          >
            Meet your assistant
            <span className="ml-2 text-[#1a120c]/60 transition group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
          <p className="mt-3 text-sm text-[#f3eee6]/40">
            Assign a job. Walk away. They leave a pack.
          </p>
        </section>

        <section className="relative min-w-0">
          <div className="rounded-[1.4rem] border border-white/10 bg-[#141210]/70 p-4 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-md sm:rounded-[2rem] sm:p-5">
            <p className="mb-3 text-[11px] tracking-[0.2em] text-[#e8a36a] uppercase">
              The crew
            </p>
            <div className="space-y-2.5">
              <Bubble who="Mira" role="Coordinates" tone="mira">
                You asked for follow-ups from the weekend. I’ll have Reed look,
                Tess write, and I’ll bring you the pack.
              </Bubble>
              <Bubble who="Reed" role="Looks it up" tone="reed">
                Hosts and sponsors only — NERDCONF, Nebius, Render, LinkUp.
                Nothing invented.
              </Bubble>
              <Bubble who="Tess" role="Drafts" tone="tess">
                Coffee-chat notes ready for you to approve.
              </Bubble>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Mark() {
  return (
    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e8a36a] font-serif text-base text-[#1a120c] sm:h-8 sm:w-8 sm:text-lg">
      S
    </span>
  );
}

function Bubble({
  who,
  role,
  tone,
  children,
}: {
  who: string;
  role: string;
  tone: "mira" | "reed" | "tess";
  children: ReactNode;
}) {
  const ring =
    tone === "mira"
      ? "bg-[#2a3340] text-[#d7e2f0]"
      : tone === "reed"
        ? "bg-[#2d3b34] text-[#d5e8dc]"
        : "bg-[#3b2a24] text-[#f0d8cc]";
  return (
    <div className="rounded-xl bg-white/4 px-3 py-2.5 ring-1 ring-white/8 sm:rounded-2xl sm:px-4 sm:py-3">
      <div className="mb-1 flex items-center gap-2">
        <span
          className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-medium sm:h-7 sm:w-7 sm:text-xs ${ring}`}
        >
          {who[0]}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#f3eee6]">{who}</p>
          <p className="text-[11px] text-[#f3eee6]/45">{role}</p>
        </div>
      </div>
      <p className="text-[13px] leading-5 text-[#ddd4c6] sm:text-sm sm:leading-6">
        {children}
      </p>
    </div>
  );
}
