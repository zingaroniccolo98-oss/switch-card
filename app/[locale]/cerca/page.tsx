import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingRow } from "@/components/collectibles/listing-row";
import { SearchFilters } from "@/components/search/search-filters";
import { EmptyState } from "@/components/ui/section";
import { getGames, getPublishedCollections } from "@/lib/data/catalog";
import { getListings, pageSize } from "@/lib/data/marketplace";
import { one } from "@/lib/http/params";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const instant = false;

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale: localeParam }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam;
  const messages = getMessages(locale);
  const view = one(query.view);
  const filters = {
    q: one(query.q),
    game: one(query.game),
    collection: one(query.collection),
    number: one(query.number),
    category: one(query.kind),
    sort: one(query.sort) === "name" ? "name" as const : "recent" as const,
    page: Number(one(query.page) ?? "0") || 0,
  };
  const km = one(query.km);

  if (view !== "results") {
    const [games, collections] = await Promise.all([
      getGames(),
      getPublishedCollections(),
    ]);

    return (
      <div className="grid gap-4">
        <h1 className="text-2xl font-extrabold text-ink">{messages.search.title}</h1>
        {!games.ok || !collections.ok ? (
          <EmptyState title={messages.common.unavailable} />
        ) : (
          <SearchFilters
            locale={locale}
            messages={messages}
            games={games.data}
            collections={collections.data}
            initial={filters}
          />
        )}
      </div>
    );
  }

  const listings = km
    ? { ok: true as const, data: { items: [], total: 0 } }
    : await getListings(filters);

  const paramsFor = (page: number, sort: "recent" | "name" = filters.sort) => {
    const next = new URLSearchParams();
    next.set("view", "results");
    if (filters.q) next.set("q", filters.q);
    if (filters.game) next.set("game", filters.game);
    if (filters.collection) next.set("collection", filters.collection);
    if (filters.number) next.set("number", filters.number);
    if (filters.category) next.set("kind", filters.category);
    if (sort === "name") next.set("sort", "name");
    if (km) next.set("km", km);
    if (page > 0) next.set("page", String(page));
    return `${localePath(locale, "/cerca")}?${next.toString()}`;
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-ink">
          {messages.search.results} ({listings.ok ? listings.data.total : 0})
        </h1>
        <div className="flex gap-2 text-sm font-semibold">
          <Link className="text-primary" href={paramsFor(0, "recent")}>
            {messages.search.sortRecent}
          </Link>
          <Link className="text-primary" href={paramsFor(0, "name")}>
            {messages.search.sortName}
          </Link>
        </div>
      </div>
      <Link href={localePath(locale, "/cerca")} className="text-sm font-semibold text-primary">
        {messages.search.title}
      </Link>
      {km ? <EmptyState title={messages.common.distanceUnavailable} /> : null}
      {!listings.ok ? <EmptyState title={messages.common.unavailable} /> : null}
      {listings.ok && listings.data.items.length === 0 ? (
        <EmptyState title={messages.search.empty} />
      ) : null}
      <div className="grid gap-3">
        {listings.ok
          ? listings.data.items.map((listing) => (
              <ListingRow
                key={listing.id}
                locale={locale}
                messages={messages}
                listing={listing}
              />
            ))
          : null}
      </div>
      {listings.ok && listings.data.total > pageSize ? (
        <div className="flex justify-between text-sm font-semibold">
          {filters.page > 0 ? (
            <Link href={paramsFor(filters.page - 1)}>{messages.search.previous}</Link>
          ) : (
            <span />
          )}
          {(filters.page + 1) * pageSize < listings.data.total ? (
            <Link href={paramsFor(filters.page + 1)}>{messages.search.next}</Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
