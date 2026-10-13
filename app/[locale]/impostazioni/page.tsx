import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, locales, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const instant = false;

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);
  const rows = [
    [messages.settings.account, messages.settings.editProfile],
    [messages.settings.account, messages.settings.notifications],
    [messages.settings.account, messages.settings.privacy],
    [messages.settings.collections, messages.settings.manage],
    [messages.settings.collections, messages.settings.import],
  ] as const;

  return (
    <div className="grid gap-5">
      <h1 className="text-2xl font-extrabold text-ink">{messages.settings.title}</h1>
      <section className="overflow-hidden rounded-[28px] bg-white">
        {rows.map(([group, label], index) => (
          <div key={label} className="border-b border-[#eef2f8] px-4 py-3 last:border-b-0">
            {index === 0 || rows[index - 1][0] !== group ? (
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">{group}</p>
            ) : null}
            <p className="font-semibold text-ink">{label}</p>
            <p className="text-sm text-muted">{messages.common.authRequired}</p>
          </div>
        ))}
      </section>
      <section className="rounded-[28px] bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">{messages.settings.app}</p>
        <h2 className="mt-2 font-bold text-ink">{messages.settings.appearance}</h2>
        <p className="mt-1 text-sm leading-6 text-muted">{messages.settings.appearanceBody}</p>
        <h2 className="mt-4 font-bold text-ink">{messages.settings.language}</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {locales.map((item) => (
            <Link
              key={item}
              href={localePath(item as Locale, "/impostazioni")}
              className={`flex h-12 items-center justify-center rounded-2xl font-bold ${
                item === locale ? "bg-primary text-white" : "bg-canvas text-ink"
              }`}
              hrefLang={item}
            >
              {item === "it" ? "Italiano" : "English"}
            </Link>
          ))}
        </div>
      </section>
      <section id="supporto" className="rounded-[28px] bg-white p-4">
        <h2 className="font-bold text-ink">{messages.settings.support}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{messages.settings.supportBody}</p>
      </section>
    </div>
  );
}
