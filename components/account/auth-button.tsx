"use client";

import { useState } from "react";

export function AuthButton({
  label,
  notice,
  className,
}: {
  label: string;
  notice: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-2">
      <button
        type="button"
        className={
          className ??
          "flex h-12 w-full items-center justify-center rounded-2xl bg-primary text-base font-semibold text-white active:scale-[0.99] active:bg-primary-hover"
        }
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
      {open ? (
        <p role="status" className="rounded-2xl bg-[#e8f0ff] px-4 py-3 text-sm text-ink">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
