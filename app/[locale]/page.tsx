import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { ListingRow } from "@/components/collectibles/listing-row";
import { EmptyState, SectionHeader } from "@/components/ui/section";
import { getPublishedCollections } from "@/lib/data/catalog";
import { getListings } from "@/lib/data/marketplace";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { notFound } from "next/navigation";

export const instant = false;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam;
  const messages = getMessages(locale);
  const [collections, listings] = await Promise.all([
    getPublishedCollections(),
    getListings({}),
  ]);
  const featured = collections.ok ? collections.data[0] : undefined;

  return (
    <div className="grid gap-6 text-white">
      <div>
        <h1 className="max-w-[16ch] text-[2rem] font-extrabold leading-tight tracking-tight">
          {messages.home.title}
        </h1>
        <p className="mt-3 max-w-[34ch] text-sm leading-6 text-white/70">
          {messages.home.subtitle}
        </p>
      </div>
      <form action={localePath(locale, "/cerca")}>
        <input type="hidden" name="view" value="results" />
        <input
          name="q"
          placeholder={messages.home.search}
          className="h-12 w-full rounded-2xl bg-white px-4 text-base text-ink outline-none placeholder:text-muted"
        />
      </form>
      <AdSlot enabled={false} label="Advertising" />
      {!collections.ok || !listings.ok ? (
        <EmptyState title={messages.common.unavailable} />
      ) : null}
      {featured ? (
        <section className="overflow-hidden rounded-[28px] bg-white text-ink shadow-lg">
          <div className="grid grid-cols-[112px_1fr] gap-3 p-3">
            <div className="grid h-28 place-items-center rounded-2xl bg-gradient-to-br from-[#123a86] to-[#071426] text-center text-xs font-bold text-white">
              {featured.title}
            </div>
            <div className="flex flex-col justify-between py-1">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {messages.home.featured}
                </p>
                <h2 className="text-lg font-extrabold leading-tight">{featured.title}</h2>
                <p className="text-sm text-muted">
                  {featured.collectibleCount} {messages.home.cards}
                </p>
              </div>
              <Link
                href={localePath(locale, `/collezioni/${featured.slug}`)}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-white"
              >
                {messages.home.discover}
              </Link>
            </div>
          </div>
        </section>
      ) : collections.ok ? (
        <EmptyState title={messages.common.emptyCatalog} />
      ) : null}
      <section>
        <SectionHeader
          title={messages.home.nearby}
          href={localePath(locale, "/cerca?view=results")}
          action={messages.common.seeAll}
          tone="light"
        />
        <p className="mb-3 text-xs text-white/60">{messages.common.distanceUnavailable}</p>
        {listings.ok && listings.data.items.length > 0 ? (
          <div className="grid gap-3">
            {listings.data.items.slice(0, 4).map((listing) => (
              <ListingRow key={listing.id} locale={locale} messages={messages} listing={listing} />
            ))}
          </div>
        ) : listings.ok ? (
          <EmptyState title={messages.search.empty} />
        ) : null}
      </section>
      <section>
        <SectionHeader
          title={messages.home.yours}
          href={localePath(locale, "/pocket")}
          action={messages.common.seeAll}
          tone="light"
        />
        <EmptyState title={messages.pocket.empty} />
      </section>
    </div>
  );
}
