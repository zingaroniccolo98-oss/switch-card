"use client";

import {
  ArrowLeftRight,
  Bell,
  Home,
  Menu,
  Search,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";

export function AppShell({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const homePath = localePath(locale);
  const isHome = pathname === homePath;
  const items = [
    { href: homePath, label: messages.nav.home, icon: Home },
    { href: localePath(locale, "/cerca"), label: messages.nav.search, icon: Search },
    { href: localePath(locale, "/pocket"), label: messages.nav.pocket, icon: WalletCards },
    { href: localePath(locale, "/scambi"), label: messages.nav.trades, icon: ArrowLeftRight },
    { href: localePath(locale, "/profilo"), label: messages.nav.profile, icon: UserRound },
  ];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={isHome ? "min-h-dvh bg-navy text-white" : "min-h-dvh bg-[#e7edf7]"}>
      <a
        href="#contenuto"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-3 focus:py-2 focus:text-ink"
      >
        {messages.common.skip}
      </a>
      <div className="relative mx-auto min-h-dvh w-full max-w-[430px] overflow-hidden bg-inherit shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <header
          className={`flex h-16 items-center justify-between px-4 ${
            isHome ? "text-white" : "bg-white text-ink"
          }`}
        >
          {isHome ? (
            <Link href={homePath} className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#7c5cff] to-[#1769ff] text-lg font-black">
                S
              </span>
              <span className="text-sm font-extrabold tracking-[0.14em]">
                SWITCH CARD
              </span>
            </Link>
          ) : (
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full active:bg-black/5"
              aria-label={messages.common.back}
              onClick={() => history.back()}
            >
              <span aria-hidden className="text-xl">
                ←
              </span>
            </button>
          )}
          <div className="flex items-center gap-1">
            <Link
              href={localePath(locale, "/impostazioni")}
              className="grid h-11 w-11 place-items-center rounded-full"
              aria-label={messages.settings.notifications}
            >
              <Bell size={20} />
            </Link>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </header>
        <main id="contenuto" className="px-4 pb-40">
          {children}
        </main>
        <nav
          className={`fixed bottom-0 left-1/2 z-20 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-5 border-t px-1 pb-[env(safe-area-inset-bottom)] ${
            isHome
              ? "border-white/10 bg-[#071426] text-white/70"
              : "border-black/5 bg-white text-[#8b97ab]"
          }`}
        >
          {items.map((item) => {
            const active =
              item.href === homePath
                ? pathname === homePath
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${
                  active ? "text-primary" : ""
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {open ? (
          <div className="fixed inset-0 z-30 bg-black/50" onClick={() => setOpen(false)}>
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="mr-auto flex h-full w-[min(100%,320px)] flex-col bg-[#10233d] p-5 text-white"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{messages.guest}</p>
                  <p className="text-sm text-white/60">{messages.brand}</p>
                </div>
                <button
                  type="button"
                  className="grid h-11 w-11 place-items-center rounded-full"
                  aria-label={messages.menu.close}
                  onClick={() => setOpen(false)}
                >
                  <X />
                </button>
              </div>
              <div className="grid gap-1">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex min-h-12 items-center rounded-2xl px-3 text-base font-semibold active:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={localePath(locale, "/impostazioni")}
                  className="flex min-h-12 items-center rounded-2xl px-3 text-base font-semibold"
                  onClick={() => setOpen(false)}
                >
                  {messages.menu.settings}
                </Link>
                <Link
                  href={localePath(locale, "/impostazioni#supporto")}
                  className="flex min-h-12 items-center rounded-2xl px-3 text-base font-semibold"
                  onClick={() => setOpen(false)}
                >
                  {messages.menu.support}
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
