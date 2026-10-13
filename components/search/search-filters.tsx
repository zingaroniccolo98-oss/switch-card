"use client";

import { useState } from "react";
import type { GameOption, CollectionSummary } from "@/lib/data/catalog";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";

export function SearchFilters({
  locale,
  messages,
  games,
  collections,
  initial,
}: {
  locale: Locale;
  messages: Messages;
  games: GameOption[];
  collections: CollectionSummary[];
  initial: {
    q?: string;
    game?: string;
    collection?: string;
    number?: string;
    kind?: string;
  };
}) {
  const [km, setKm] = useState(50);
  const anywhere = km >= 50;

  return (
    <form action={localePath(locale, "/cerca")} className="grid gap-4">
      <input type="hidden" name="view" value="results" />
      <input type="hidden" name="km" value={anywhere ? "" : String(km)} />
      <label className="grid gap-2 text-sm font-semibold text-ink">
        <span className="sr-only">{messages.search.title}</span>
        <input
          name="q"
          defaultValue={initial.q ?? ""}
          placeholder={messages.search.placeholder}
          className="h-12 rounded-2xl border border-[#e6ebf5] bg-white px-4 text-base outline-none"
        />
      </label>
      <div className="flex gap-2 overflow-x-auto">
        {(
          [
            ["", messages.search.kinds.all],
            ["card", messages.search.kinds.cards],
            ["sticker", messages.search.kinds.stickers],
            ["collection", messages.search.kinds.collections],
          ] as const
        ).map(([value, label]) => (
          <label
            key={label}
            className="min-h-11 shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink has-[:checked]:bg-primary has-[:checked]:text-white"
          >
            <input
              className="sr-only"
              type="radio"
              name="kind"
              value={value}
              defaultChecked={(initial.kind ?? "") === value}
            />
            {label}
          </label>
        ))}
      </div>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        {messages.search.game}
        <select
          name="game"
          defaultValue={initial.game ?? ""}
          className="h-12 rounded-2xl border border-[#e6ebf5] bg-white px-3"
        >
          <option value="">{messages.search.kinds.all}</option>
          {games.map((game) => (
            <option key={game.slug} value={game.slug}>
              {game.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        <span className="sr-only">{messages.search.kinds.collections}</span>
        <select
          name="collection"
          defaultValue={initial.collection ?? ""}
          className="h-12 rounded-2xl border border-[#e6ebf5] bg-white px-3"
        >
          <option value="">{messages.search.kinds.collections}</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.slug}>
              {collection.title}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        {messages.search.number}
        <input
          name="number"
          defaultValue={initial.number ?? ""}
          placeholder={messages.search.numberPlaceholder}
          className="h-12 rounded-2xl border border-[#e6ebf5] bg-white px-4"
        />
      </label>
      <label className="grid gap-3 rounded-3xl bg-white p-4 text-sm font-semibold text-ink">
        <span className="flex items-center justify-between">
          {messages.search.distance}
          <span className="text-primary">
            {anywhere ? messages.common.anywhere : `${km} km`}
          </span>
        </span>
        <input
          type="range"
          min={1}
          max={50}
          value={km}
          onChange={(event) => setKm(Number(event.target.value))}
          aria-valuetext={anywhere ? messages.common.anywhere : `${km} km`}
        />
        <span className="text-xs font-medium text-muted">
          {messages.common.distanceUnavailable}
        </span>
      </label>
      <button
        type="submit"
        className="h-12 rounded-2xl bg-primary text-base font-semibold text-white active:bg-primary-hover"
      >
        {messages.search.apply}
      </button>
      <a
        href={localePath(locale, "/cerca")}
        className="text-center text-sm font-semibold text-muted"
      >
        {messages.search.reset}
      </a>
    </form>
  );
}
