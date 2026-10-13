import { notFound } from "next/navigation";
import { EmptyState } from "@/components/ui/section";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const instant = false;

export default async function TradesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);
  const sections = [
    messages.trade.sent,
    messages.trade.received,
    messages.trade.active,
    messages.trade.completed,
    messages.trade.cancelled,
  ];

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-extrabold text-ink">{messages.trade.title}</h1>
      {sections.map((title) => (
        <section key={title} className="grid gap-2">
          <h2 className="font-bold text-ink">{title}</h2>
          <EmptyState title={messages.trade.empty} body={messages.common.authRequired} />
        </section>
      ))}
    </div>
  );
}
