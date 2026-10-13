export default function Loading() {
  return (
    <div className="grid gap-3" aria-busy="true">
      <div className="h-8 w-40 animate-pulse rounded-xl bg-white/70" />
      <div className="h-28 animate-pulse rounded-3xl bg-white/70" />
      <div className="h-28 animate-pulse rounded-3xl bg-white/70" />
    </div>
  );
}
