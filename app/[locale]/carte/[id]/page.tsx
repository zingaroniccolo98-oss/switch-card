import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthButton } from "@/components/account/auth-button";
import { CardFace } from "@/components/collectibles/card-face";
import { ListingRow } from "@/components/collectibles/listing-row";
import { EmptyState } from "@/components/ui/section";
import { getCollectible } from "@/lib/data/catalog";
import { getListings } from "@/lib/data/marketplace";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const instant = false;

export default async function CardPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }

  const messages = getMessages(localeParam);
  const card = await getCollectible(id);
  if (!card.ok) {
    return <EmptyState title={messages.common.unavailable} />;
  }
  if (!card.data) {
    notFound();
  }

  const offers = await getListings({ number: card.data.number, collection: card.data.collectionSlug });

  return (
    <div className="-mx-4 grid gap-4">
      <div className="grid place-items-center bg-gradient-to-b from-[#12325f] to-[#071426] px-4 py-8">
        <CardFace
          name={card.data.name}
          number={card.data.number}
          imageUrl={card.data.imageUrl}
          className="h-64 w-44"
        />
      </div>
      <div className="grid gap-4 px-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">{card.data.name}</h1>
          <p className="mt-1 text-muted">
            #{card.data.number}
            {card.data.variant ? ` · ${card.data.variant}` : ""} · {card.data.collectionTitle}
          </p>
        </div>
        <section className="rounded-[28px] bg-white p-4 shadow-sm">
          <h2 className="font-bold text-ink">{messages.card.collectionState}</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-[#e8f8ef] px-3 py-3">
              <p className="text-xs font-semibold text-success">{messages.card.owned}</p>
              <p className="text-2xl font-extrabold text-success">0</p>
            </div>
            <div className="rounded-2xl bg-[#fff4e5] px-3 py-3">
              <p className="text-xs font-semibold text-warning">{messages.card.duplicates}</p>
              <p className="text-2xl font-extrabold text-warning">0</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted">{messages.common.authRequired}</p>
        </section>
        <Link
          href={localePath(localeParam, `/collezioni/${card.data.collectionSlug}`)}
          className="flex h-12 items-center justify-center rounded-2xl bg-white font-bold text-ink"
        >
          {messages.card.viewPocket}
        </Link>
        <AuthButton label={messages.card.publish} notice={messages.common.authRequired} />
        <section className="grid gap-3">
          <h2 className="text-lg font-bold text-ink">{messages.card.offers}</h2>
          {offers.ok && offers.data.items.length > 0 ? (
            offers.data.items.map((listing) => (
              <ListingRow
                key={listing.id}
                locale={localeParam}
                messages={messages}
                listing={listing}
              />
            ))
          ) : (
            <EmptyState title={offers.ok ? messages.search.empty : messages.common.unavailable} />
          )}
        </section>
      </div>
    </div>
  );
}
