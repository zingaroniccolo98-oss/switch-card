import { notFound } from "next/navigation";
import { EmptyState } from "@/components/ui/section";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const instant = false;

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-extrabold text-ink">{messages.profile.title}</h1>
      <section className="rounded-[28px] bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-navy text-xl font-bold text-white">
            S
          </div>
          <div>
            <p className="text-lg font-extrabold text-ink">{messages.guest}</p>
            <p className="text-sm text-muted">{messages.brand}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">{messages.profile.guestBody}</p>
      </section>
      <EmptyState title={messages.profile.empty} body={messages.common.authRequired} />
    </div>
  );
}
