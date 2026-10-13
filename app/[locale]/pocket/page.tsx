import { notFound } from "next/navigation";
import { EmptyState, SectionHeader } from "@/components/ui/section";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const instant = false;

export default async function PocketPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }

  const messages = getMessages(localeParam);
  const stats = [
    { label: messages.pocket.collections, value: 0, className: "bg-white text-ink" },
    { label: messages.pocket.duplicates, value: 0, className: "bg-[#e7f0ff] text-primary" },
    { label: messages.pocket.missing, value: 0, className: "bg-[#ffe8ef] text-missing" },
  ];

  return (
    <div className="grid gap-5">
      <h1 className="text-2xl font-extrabold text-ink">{messages.pocket.title}</h1>
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-3xl p-3 ${stat.className}`}>
            <p className="text-2xl font-extrabold">{stat.value}</p>
            <p className="text-xs font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>
      <section>
        <SectionHeader
          title={messages.pocket.yours}
          href={localePath(localeParam, "/cerca")}
          action={messages.common.seeAll}
        />
        <EmptyState title={messages.pocket.empty} body={messages.common.authRequired} />
      </section>
      <section>
        <SectionHeader title={messages.pocket.available} />
        <EmptyState title={messages.search.empty} />
      </section>
    </div>
  );
}
