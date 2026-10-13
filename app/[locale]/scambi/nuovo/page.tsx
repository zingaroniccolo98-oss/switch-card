import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthButton } from "@/components/account/auth-button";
import { CardFace } from "@/components/collectibles/card-face";
import { EmptyState } from "@/components/ui/section";
import { getCollectible } from "@/lib/data/catalog";
import { getListing } from "@/lib/data/marketplace";
import { one } from "@/lib/http/params";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const instant = false;

export default async function ProposalPage({
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

  const messages = getMessages(localeParam);
  const listingId = one(query.listing);
  const requestId = one(query.richiesta);
  const listing = listingId ? await getListing(listingId) : null;
  const requested = requestId ? await getCollectible(requestId) : null;

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-extrabold text-ink">{messages.trade.proposal}</h1>
      {!listingId ? <EmptyState title={messages.trade.missingListing} /> : null}
      {listing && !listing.ok ? <EmptyState title={messages.common.unavailable} /> : null}
      {listing?.ok && !listing.data ? <EmptyState title={messages.trade.missingListing} /> : null}
      {listing?.ok && listing.data ? (
        <section className="rounded-[28px] bg-white p-4">
          <h2 className="mb-3 font-bold text-ink">{messages.trade.offer}</h2>
          <div className="flex items-center gap-3">
            <CardFace
              name={listing.data.name}
              number={listing.data.number}
              imageUrl={listing.data.imageUrl}
              className="h-20 w-14"
            />
            <div>
              <p className="font-bold text-ink">{listing.data.name}</p>
              <p className="text-sm text-muted">#{listing.data.number} · {listing.data.username}</p>
            </div>
          </div>
        </section>
      ) : null}
      <section className="rounded-[28px] bg-white p-4">
        <h2 className="mb-3 font-bold text-ink">{messages.trade.request}</h2>
        {requested?.ok && requested.data ? (
          <div className="flex items-center gap-3">
            <CardFace
              name={requested.data.name}
              number={requested.data.number}
              imageUrl={requested.data.imageUrl}
              className="h-20 w-14"
            />
            <p className="font-bold text-ink">{requested.data.name}</p>
          </div>
        ) : (
          <p className="text-sm text-muted">{messages.trade.missingListing}</p>
        )}
      </section>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        {messages.trade.message}
        <textarea
          className="min-h-28 rounded-3xl bg-white p-4 text-base"
          placeholder={messages.trade.messagePlaceholder}
        />
      </label>
      <AuthButton label={messages.trade.send} notice={messages.common.authRequired} />
      <Link href={localePath(localeParam, "/scambi")} className="text-center text-sm font-semibold text-primary">
        {messages.trade.title}
      </Link>
    </div>
  );
}
