import { notFound } from "next/navigation";
import { ListingRow } from "@/components/collectibles/listing-row";
import { EmptyState } from "@/components/ui/section";
import { getProfile } from "@/lib/data/marketplace";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const instant = false;

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ locale: string; username: string }>;
}) {
  const { locale, username } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);
  const profile = await getProfile(decodeURIComponent(username));
  if (!profile.ok) {
    return <EmptyState title={messages.common.unavailable} />;
  }
  if (!profile.data) {
    notFound();
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-extrabold text-ink">{messages.profile.publicTitle}</h1>
      <section className="rounded-[28px] bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#dbe7ff] text-xl font-extrabold text-primary">
            {profile.data.displayName.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-extrabold text-ink">{profile.data.displayName}</p>
            <p className="text-sm text-muted">@{profile.data.username}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-canvas p-2">
            <p className="text-lg font-extrabold text-ink">{profile.data.listings.length}</p>
            <p className="text-[11px] font-semibold text-muted">{messages.profile.catalog}</p>
          </div>
          <div className="rounded-2xl bg-canvas p-2">
            <p className="text-lg font-extrabold text-ink">0</p>
            <p className="text-[11px] font-semibold text-muted">{messages.profile.trades}</p>
          </div>
          <div className="rounded-2xl bg-canvas p-2">
            <p className="text-lg font-extrabold text-ink">—</p>
            <p className="text-[11px] font-semibold text-muted">{messages.profile.distance}</p>
          </div>
        </div>
        {profile.data.bio ? <p className="mt-4 text-sm text-ink">{profile.data.bio}</p> : null}
      </section>
      <section className="grid gap-3">
        <h2 className="font-bold text-ink">{messages.profile.catalog}</h2>
        {profile.data.listings.length === 0 ? (
          <EmptyState title={messages.profile.empty} />
        ) : (
          profile.data.listings.map((listing) => (
            <ListingRow key={listing.id} locale={locale} messages={messages} listing={listing} />
          ))
        )}
      </section>
      <section className="grid gap-2">
        <h2 className="font-bold text-ink">{messages.profile.reviews}</h2>
        <EmptyState title={messages.profile.noReviews} />
      </section>
    </div>
  );
}
