"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { formatPrice } from "@/lib/finance";
import { EASE } from "./motion/Reveal";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const focus = setTimeout(() => inputRef.current?.focus(), 120);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      clearTimeout(focus);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) =>
        [p.title, p.make, p.model, p.category, p.condition, p.stockNumber]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 6);
  }, [query]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/inventory?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110]">
          <motion.button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-md"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search inventory"
            initial={{ opacity: 0, y: -24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.34, ease: EASE }}
            className="absolute inset-x-0 top-0 mx-auto w-full max-w-3xl px-4 pt-[12vh]"
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-lift-lg">
              <form onSubmit={submit} className="flex items-center gap-3 border-b border-ink-100 px-5">
                <Search className="h-5 w-5 shrink-0 text-ink-400" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by make, model or stock number..."
                  aria-label="Search inventory"
                  className="h-16 flex-1 bg-transparent text-base text-ink-900 outline-none placeholder:text-ink-400"
                />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-100"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>

              <div className="max-h-[52vh] overflow-y-auto p-3">
                {query.trim() === "" ? (
                  <div className="p-3">
                    <p className="eyebrow mb-3 text-ink-400">Browse categories</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/inventory?category=${c.slug}`}
                          onClick={onClose}
                          className="rounded-full border border-ink-200 px-3.5 py-1.5 text-sm text-ink-700 transition-colors hover:border-accent-500 hover:bg-accent-500 hover:text-white"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : results.length === 0 ? (
                  <p className="px-3 py-8 text-center text-sm text-ink-500">
                    No units matched “{query}”. Try a make like Yamaha, or{" "}
                    <Link href="/contact" onClick={onClose} className="font-semibold text-accent-500 underline-offset-4 hover:underline">
                      ask us to find it
                    </Link>
                    .
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {results.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/inventory/${p.slug}`}
                          onClick={onClose}
                          className="flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-ink-50"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-ink-900">{p.title}</span>
                            <span className="block text-xs text-ink-500">
                              {p.condition} · Stock {p.stockNumber}
                            </span>
                          </span>
                          <span className="shrink-0 font-display text-sm font-bold text-accent-500">
                            {formatPrice(p.price)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
