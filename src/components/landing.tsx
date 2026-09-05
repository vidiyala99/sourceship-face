import type { ReactNode } from "react";
import Link from "next/link";

export function Landing({ error }: { error?: string | null }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#0b0a09] text-[#f3eee6]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-[#c45c26]/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[26rem] w-[26rem] rounded-full bg-[#3d5c4f]/25 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.09] [background-image:radial-gradient(#f3eee6_0.6px,transparent_0.6px)] [background-size:18px_18px]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <Mark />
          <span className="text-sm font-medium tracking-[0.18em] uppercase">
            SourceShip
          </span>
        </div>
        <p className="hidden text-xs tracking-wide text-[#f3eee6]/55 sm:block">
          An assistant crew for the work after the room
        </p>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100dvh-5.5rem)] w-full max-w-6xl items-center gap-12 px-6 pb-16 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="max-w-xl">
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#e8a36a] uppercase">
            Hand it off. Stay on the hard problem.
          </p>
          <h1 className="font-serif mt-5 text-5xl leading-[1.05] tracking-tight text-[#f7f1e8] sm:text-6xl lg:text-7xl">
            You have an
            <br />
            assistant now.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-[#d9d0c3] sm:text-lg">
            Tell them what matters. They look things up, gather what is real,
            talk it through with each other, and bring back an outcome.
          </p>

          <Link
            href="/app"
            className="group mt-10 inline-flex h-14 items-center justify-center rounded-full bg-[#e8a36a] px-8 text-base font-medium text-[#1a120c] transition hover:bg-[#f0b67a]"
          >
            Meet your assistant
            <span className="ml-3 text-[#1a120c]/60 transition group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
          <p className="mt-4 text-sm text-[#f3eee6]/45">
            One tap. They already know this weekend is Burning Token.
          </p>
        </section>

        <section className="relative">
          <div className="rounded-[2rem] border border-white/10 bg-[#141210]/70 p-5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <p className="mb-4 text-[11px] tracking-[0.22em] text-[#e8a36a] uppercase">
              The crew
            </p>
            <div className="space-y-3">
              <Bubble who="Mira" role="Coordinates" tone="mira">
                You asked for follow-ups from the weekend. I’ll have Reed look,
                Tess write, and I’ll bring you the pack.
              </Bubble>
              <Bubble who="Reed" role="Looks it up" tone="reed">
                Hosts and sponsors only — NERDCONF, Nebius, Render, LinkUp.
                Nothing invented.
              </Bubble>
              <Bubble who="Tess" role="Drafts" tone="tess">
                Four coffee-chat notes. Thank-you first. You approve. We never
                send.
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
    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e8a36a] font-serif text-lg text-[#1a120c]">
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
    <div className="rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/8">
      <div className="mb-1.5 flex items-center gap-2">
        <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-medium ${ring}`}>
          {who[0]}
        </span>
        <div>
          <p className="text-sm font-medium text-[#f3eee6]">{who}</p>
          <p className="text-[11px] text-[#f3eee6]/45">{role}</p>
        </div>
      </div>
      <p className="text-sm leading-6 text-[#ddd4c6]">{children}</p>
    </div>
  );
}
