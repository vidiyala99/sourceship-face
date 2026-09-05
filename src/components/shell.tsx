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
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e8a36a] font-serif text-lg text-[#1a120c]">
                S
              </span>
              <span className="text-sm font-medium tracking-[0.18em] uppercase">
                SourceShip
              </span>
            </Link>
            <Link
              href="/app"
              className="text-xs tracking-[0.16em] text-[#f3eee6]/55 uppercase hover:text-[#e8a36a]"
            >
              Desk
            </Link>
          </div>
          <div className="text-right">
            <p className="text-xs tracking-wide text-[#f3eee6]/50">
              {eyebrow ?? "Your crew is on it"}
            </p>
            <Providers />
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
