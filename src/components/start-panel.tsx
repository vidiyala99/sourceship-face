export function StartPanel() {
  return (
    <div className="mx-auto max-w-2xl pt-10">
      <p className="text-[11px] tracking-[0.22em] text-[#e8a36a] uppercase">
        One thing on the desk
      </p>
      <h1 className="font-serif mt-3 text-4xl tracking-tight md:text-5xl">
        Follow up this weekend.
      </h1>
      <p className="mt-4 max-w-lg text-base leading-7 text-[#cfc6b8]">
        Burning Token just happened. Your crew already has the context — who
        hosted, who sponsored, who to thank. Tap once. Walk away.
      </p>
      <form action="/api/jobs/form" method="post" className="mt-8">
        <input type="hidden" name="preset" value="burningtoken" />
        <button
          type="submit"
          className="inline-flex h-14 items-center rounded-full bg-[#e8a36a] px-8 text-base font-medium text-[#1a120c] hover:bg-[#f0b67a]"
        >
          Follow up Burning Token
        </button>
      </form>
      <p className="mt-3 text-sm text-[#f3eee6]/40">
        Preloaded. No URL to paste.
      </p>
    </div>
  );
}
