import { notFound } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { isLocale, locales } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(isLocale(locale) ? locale : "it");
  return {
    title: messages.meta.title,
    description: messages.meta.description,
  };
}

export const instant = false;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <AppShell locale={locale} messages={getMessages(locale)}>
      {children}
    </AppShell>
  );
}
