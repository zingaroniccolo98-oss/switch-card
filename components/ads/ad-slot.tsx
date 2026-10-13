export function AdSlot({
  enabled = false,
  label,
}: {
  enabled?: boolean;
  label: string;
}) {
  if (!enabled) {
    return null;
  }

  return (
    <aside
      aria-label={label}
      className="rounded-3xl border border-dashed border-[#c9d4e8] bg-white/70 px-4 py-6 text-center text-sm font-semibold text-muted"
    >
      {label}
    </aside>
  );
}
