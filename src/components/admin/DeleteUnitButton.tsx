"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteProductAction } from "@/lib/admin/actions";

/** Two-step delete — destructive actions shouldn't fire on a single click. */
export function DeleteUnitButton({ id, title }: { id: string; title: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${title}`}
        className="rounded-md p-2 text-ink-400 transition-colors hover:bg-accent-500/10 hover:text-accent-500"
      >
        <Trash2 aria-hidden className="size-4" />
      </button>
    );
  }

  return (
    <span className="flex items-center gap-1">
      <form action={deleteProductAction}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="rounded-md bg-accent-500 px-2.5 py-1.5 font-display text-[0.625rem] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent-600"
        >
          Delete
        </button>
      </form>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-md px-2 py-1.5 font-display text-[0.625rem] font-bold uppercase tracking-[0.12em] text-ink-500 transition-colors hover:text-ink-900"
      >
        Cancel
      </button>
    </span>
  );
}
