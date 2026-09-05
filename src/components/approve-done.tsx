import Link from "next/link";

export function ApproveDone({
  count,
  jobId,
  tone = "dark",
  showPackLink = true,
}: {
  count: number;
  jobId?: string;
  tone?: "dark" | "light";
  showPackLink?: boolean;
}) {
  const dark = tone === "dark";
  const notes = count === 1 ? "1 note approved" : `${count} notes approved`;

  return (
    <section
      className={
        dark
          ? "mx-auto mb-10 max-w-2xl rounded-[1.6rem] border border-[#9fd4b0]/25 bg-[#162018] px-6 py-6"
          : "rounded-[1.4rem] border border-[#2f6b46]/25 bg-[#e8f5ec] px-5 py-5"
      }
    >
      <p
        className={
          dark
            ? "text-[11px] tracking-[0.22em] text-[#9fd4b0] uppercase"
            : "text-[11px] tracking-[0.22em] text-[#2f6b46] uppercase"
        }
      >
        Approved
      </p>
      <h2
        className={
          dark
            ? "font-serif mt-2 text-3xl tracking-tight"
            : "font-serif mt-1 text-2xl tracking-tight"
        }
      >
        {notes}
      </h2>
      <p
        className={
          dark
            ? "mt-2 text-sm leading-6 text-[#cfc6b8]"
            : "mt-2 text-sm leading-6 text-[#3d5346]"
        }
      >
        Nothing was sent. Approve stays on this desk — no email went out.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {showPackLink && jobId ? (
          <Link
            href={`/run/${jobId}`}
            className={
              dark
                ? "inline-flex h-11 items-center rounded-full bg-[#e8a36a] px-5 text-sm font-medium text-[#1a120c] hover:bg-[#f0b67a]"
                : "inline-flex h-10 items-center rounded-full bg-[#1c1712] px-4 text-sm font-medium text-[#f4efe6]"
            }
          >
            Back to the pack
          </Link>
        ) : null}
        <Link
          href="/app#recent"
          className={
            dark
              ? "inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-sm text-[#f3eee6]/80 hover:border-[#e8a36a]/50"
              : "inline-flex h-10 items-center rounded-full border border-[#1c1712]/15 px-4 text-sm text-[#1c1712]"
          }
        >
          Recent jobs
        </Link>
      </div>
    </section>
  );
}
