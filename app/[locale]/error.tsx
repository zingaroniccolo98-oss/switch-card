"use client";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 text-ink">
      <p className="font-bold">Qualcosa è andato storto. / Something went wrong.</p>
      <button
        type="button"
        className="mt-4 h-12 w-full rounded-2xl bg-primary font-semibold text-white"
        onClick={reset}
      >
        Riprova / Retry
      </button>
    </div>
  );
}
