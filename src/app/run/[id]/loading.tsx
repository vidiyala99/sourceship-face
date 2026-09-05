export default function RunLoading() {
  return (
    <div className="min-h-dvh bg-[#0f0e0c] px-4 py-8 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl animate-pulse gap-4 lg:grid-cols-[260px_1fr]">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-1">
          <div className="h-16 rounded-xl bg-white/8 sm:h-28" />
          <div className="h-16 rounded-xl bg-white/8 sm:h-28" />
          <div className="h-16 rounded-xl bg-white/8 sm:h-28" />
        </div>
        <div className="h-64 rounded-[1.25rem] bg-white/8 sm:h-80" />
      </div>
    </div>
  );
}
