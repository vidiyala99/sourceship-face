import type { ReactNode } from "react";
import Link from "next/link";
import { Providers } from "@/components/providers";

export function Shell({
  children,
  eyebrow,
}: {
  children: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="min-h-dvh bg-[#0f0e0c] text-[#f3eee6]">
      <header className="border-b border-white/8">
        <div className="mx-auto flex min-h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:h-16 sm:px-6 sm:py-0">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e8a36a] font-serif text-base text-[#1a120c] sm:h-8 sm:w-8 sm:text-lg">
                S
              </span>
              <span className="text-xs font-medium tracking-[0.16em] uppercase sm:text-sm sm:tracking-[0.18em]">
                SourceShip
              </span>
            </Link>
            <Link
              href="/app"
              className="text-xs tracking-[0.14em] text-[#f3eee6]/55 uppercase hover:text-[#e8a36a]"
            >
              Desk
            </Link>
          </div>
          <div className="hidden min-w-0 text-right sm:block">
            <p className="truncate text-xs tracking-wide text-[#f3eee6]/50">
              {eyebrow ?? "Your crew is on it"}
            </p>
            <Providers />
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}
