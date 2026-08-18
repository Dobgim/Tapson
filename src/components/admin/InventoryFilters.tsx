"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { categories } from "@/data/categories";

const control =
  "h-10 rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 transition-colors focus:border-accent-500 focus:outline-none";

/** Filters are URL state, so any view can be linked or bookmarked. */
export function InventoryFilters({
  q,
  category,
  condition,
}: {
  q: string;
  category: string;
  condition: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/admin/inventory?${next.toString()}`);
  }

  const dirty = Boolean(q || category || condition);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-0 flex-1 sm:max-w-xs">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
        />
        <input
          type="search"
          defaultValue={q}
          onChange={(e) => set("q", e.target.value)}
          placeholder="Search title, stock no. or colour"
          aria-label="Search inventory"
          className={`${control} w-full pl-9`}
        />
      </div>

      <select
        value={category}
        onChange={(e) => set("category", e.target.value)}
        aria-label="Filter by category"
        className={control}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={condition}
        onChange={(e) => set("condition", e.target.value)}
        aria-label="Filter by condition"
        className={control}
      >
        <option value="">Any condition</option>
        <option value="New">New</option>
        <option value="Pre-Owned">Pre-Owned</option>
      </select>

      {dirty && (
        <button
          type="button"
          onClick={() => router.replace("/admin/inventory")}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 font-display text-[0.625rem] font-bold uppercase tracking-[0.14em] text-ink-500 transition-colors hover:text-ink-900"
        >
          <X aria-hidden className="size-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}
