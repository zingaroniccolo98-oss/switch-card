import Link from "next/link";
import { notFound } from "next/navigation";
import { CardFace } from "@/components/collectibles/card-face";
import { EmptyState } from "@/components/ui/section";
import { getCollection } from "@/lib/data/catalog";
import { one } from "@/lib/http/params";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const instant = false;

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale: localeParam, slug }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  if (!isLocale(localeParam)) {
    notFound();
  }

  const messages = getMessages(localeParam);
  const result = await getCollection(slug);
  if (!result.ok) {
    return <EmptyState title={messages.common.unavailable} />;
  }
  if (!result.data) {
    notFound();
  }

  const view = one(query.view) === "checklist" ? "checklist" : "grid";
  const stato = one(query.stato) ?? "all";
  const q = one(query.q)?.toLowerCase();
  const cards = result.data.collectibles.filter((card) => {
    if (!q) {
      return true;
    }
    return card.number.toLowerCase().includes(q) || card.name.toLowerCase().includes(q);
  });
  const personal = stato !== "all";
  const base = localePath(localeParam, `/collezioni/${slug}`);
  const filters = [
    ["all", messages.collection.all],
    ["owned", messages.collection.owned],
    ["missing", messages.collection.missing],
    ["duplicates", messages.collection.duplicates],
    ["stuck", messages.collection.stuck],
  ] as const;

  return (
    <div className="grid gap-4">
      <section className="overflow-hidden rounded-[28px] bg-white p-4 text-ink shadow-sm">
        <div className="grid grid-cols-[96px_1fr] gap-3">
          <div className="grid h-28 place-items-center rounded-2xl bg-gradient-to-br from-[#123a86] to-[#071426] p-2 text-center text-xs font-bold text-white">
            {result.data.collection.title}
          </div>
          <div>
            <h1 className="text-xl font-extrabold leading-tight">
              {result.data.collection.title}
            </h1>
            <p className="mt-2 text-sm font-semibold text-muted">
              {messages.collection.progress}: 0 / {result.data.collection.collectibleCount}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e7edf7]">
              <div className="h-full w-0 bg-primary" />
            </div>
          </div>
        </div>
      </section>
      <div className="flex gap-2">
        <Link
          href={`${base}?view=grid`}
          className={`flex h-11 flex-1 items-center justify-center rounded-2xl text-sm font-bold ${view === "grid" ? "bg-primary text-white" : "bg-white text-ink"}`}
        >
          {messages.collection.grid}
        </Link>
        <Link
          href={`${base}?view=checklist`}
          className={`flex h-11 flex-1 items-center justify-center rounded-2xl text-sm font-bold ${view === "checklist" ? "bg-primary text-white" : "bg-white text-ink"}`}
        >
          {messages.collection.checklist}
        </Link>
      </div>
      <form action={base} className="flex gap-2">
        <input type="hidden" name="view" value={view} />
        <input type="hidden" name="stato" value={stato} />
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder={messages.search.numberPlaceholder}
          className="h-12 flex-1 rounded-2xl bg-white px-4 text-ink"
        />
      </form>
      <div className="flex gap-2 overflow-x-auto">
        {filters.map(([value, label]) => (
          <Link
            key={value}
            href={`${base}?view=${view}&stato=${value}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
              stato === value ? "bg-navy text-white" : "bg-white text-ink"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
      {personal ? (
        <EmptyState title={messages.pocket.empty} body={messages.common.authRequired} />
      ) : cards.length === 0 ? (
        <EmptyState title={messages.collection.empty} />
      ) : view === "checklist" ? (
        <div className="grid grid-cols-5 gap-2">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={localePath(localeParam, `/carte/${card.id}`)}
              className="grid h-12 place-items-center rounded-xl bg-white text-xs font-bold text-ink shadow-sm"
            >
              {card.number}
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {cards.map((card) => (
            <Link key={card.id} href={localePath(localeParam, `/carte/${card.id}`)} className="grid justify-items-center gap-2">
              <CardFace name={card.name} number={card.number} imageUrl={card.imageUrl} className="h-32 w-full" />
              <span className="text-center text-xs font-semibold text-ink">{card.number}</span>
            </Link>
          ))}
        </div>
      )}
      {view === "checklist" ? (
        <ul className="grid grid-cols-2 gap-2 text-xs font-semibold text-ink">
          <li className="rounded-full bg-[#e8f8ef] px-3 py-2 text-success">{messages.collection.legendOwned}</li>
          <li className="rounded-full bg-[#ffe8ef] px-3 py-2 text-missing">{messages.collection.legendMissing}</li>
          <li className="rounded-full bg-[#fff4e5] px-3 py-2 text-warning">{messages.collection.legendDuplicate}</li>
          <li className="rounded-full bg-[#f1eaff] px-3 py-2 text-stuck">{messages.collection.legendStuck}</li>
        </ul>
      ) : null}
    </div>
  );
}
