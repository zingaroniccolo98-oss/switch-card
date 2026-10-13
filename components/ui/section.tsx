export function EmptyState({
  title,
  body,
}: {
  title: string;
  body?: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-[#d5deee] bg-white px-4 py-8 text-center">
      <p className="font-semibold text-ink">{title}</p>
      {body ? <p className="mt-2 text-sm leading-6 text-muted">{body}</p> : null}
    </div>
  );
}

export function SectionHeader({
  title,
  href,
  action,
  tone = "dark",
}: {
  title: string;
  href?: string;
  action?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className={`text-lg font-bold ${tone === "light" ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {href && action ? (
        <a href={href} className="text-sm font-semibold text-primary">
          {action}
        </a>
      ) : null}
    </div>
  );
}
