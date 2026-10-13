import Link from "next/link";
import { CardFace } from "@/components/collectibles/card-face";
import type { PublicListing } from "@/lib/data/marketplace";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";

export function ListingRow({
  locale,
  messages,
  listing,
}: {
  locale: Locale;
  messages: Messages;
  listing: PublicListing;
}) {
  return (
    <article className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-sm">
      <Link href={localePath(locale, `/carte/${listing.collectibleId}`)}>
        <CardFace
          name={listing.name}
          number={listing.number}
          imageUrl={listing.imageUrl}
          className="h-16 w-12"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={localePath(locale, `/utenti/${listing.username}`)}
            className="truncate font-bold text-ink"
          >
            {listing.username}
          </Link>
          <span className="shrink-0 rounded-full bg-[#e8f8ef] px-2 py-1 text-[11px] font-bold text-success">
            {messages.search.available}
          </span>
        </div>
        <p className="truncate text-sm text-muted">
          {listing.name} · #{listing.number}
        </p>
        <p className="truncate text-xs text-muted">{listing.collectionTitle}</p>
        <span className="mt-1 flex gap-3">
          <Link
            href={localePath(locale, `/utenti/${listing.username}`)}
            className="text-sm font-semibold text-primary"
          >
            {messages.search.viewProfile}
          </Link>
          <Link
            href={localePath(locale, `/scambi/nuovo?listing=${listing.id}`)}
            className="text-sm font-semibold text-primary"
          >
            {messages.trade.proposal}
          </Link>
        </span>
      </div>
    </article>
  );
}
