"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "../ProductCard";
import { Button, ButtonLink } from "../ui/Button";
import { EASE } from "../motion/Reveal";
import { categories } from "@/data/categories";
import { makes, priceBounds, products, years } from "@/data/products";
import { locations } from "@/data/site";
import { formatPrice } from "@/lib/finance";
import { cn } from "@/lib/utils";
import {
  activeFilterCount,
  applyFilters,
  defaultFilters,
  filtersToParams,
  SORT_OPTIONS,
  type Filters,
  type SortKey,
} from "./filters";

const MAX = priceBounds.max;

export function InventoryBrowser({ initial }: { initial: Filters }) {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(initial);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visible, setVisible] = useState(9);

  const results = useMemo(() => applyFilters(products, filters), [filters]);
  const activeCount = activeFilterCount(filters, MAX);

  // Keep the URL shareable without pushing a history entry per keystroke.
  useEffect(() => {
    const params = filtersToParams(filters, MAX);
    const query = params.toString();
    router.replace(`/inventory${query ? `?${query}` : ""}`, { scroll: false });
  }, [filters, router]);

  useEffect(() => setVisible(9), [filters]);

  useEffect(() => {
    if (!drawerOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [drawerOpen]);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const reset = () => setFilters(defaultFilters(MAX));

  const panel = <FilterPanel filters={filters} set={set} reset={reset} activeCount={activeCount} />;

  return (
    <section className="bg-ink-50 py-12 lg:py-16">
      <div className="shell lg:grid lg:grid-cols-12 lg:gap-10">
        {/* Desktop rail */}
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-[calc(var(--header-h)+1.5rem)] max-h-[calc(100svh-var(--header-h)-3rem)] overflow-y-auto rounded-2xl border border-ink-200 bg-white p-6">
            {panel}
          </div>
        </aside>

        <div className="lg:col-span-9">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-600">
              <span className="font-display text-lg font-extrabold text-ink-900">{results.length}</span>{" "}
              {results.length === 1 ? "unit" : "units"} available
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                Filters
                {activeCount > 0 && (
                  <span className="ml-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent-500 px-1 text-[0.625rem] text-white">
                    {activeCount}
                  </span>
                )}
              </Button>

              <label htmlFor="sort" className="sr-only">
                Sort results
              </label>
              <select
                id="sort"
                value={filters.sort}
                onChange={(e) => set("sort", e.target.value as SortKey)}
                className="h-9 appearance-none rounded-full border border-ink-200 bg-white pl-4 pr-9 text-xs font-medium text-ink-800 transition-colors focus:border-accent-500 focus:outline-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2355606f' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "0.85rem",
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeCount > 0 && (
            <ActiveChips filters={filters} set={set} reset={reset} />
          )}

          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-12 text-center">
              <h2 className="font-display text-xl font-extrabold uppercase text-ink-900">
                Nothing matches those filters
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
                Loosen a filter, or tell us what you're after — we source units from other stores
                and from auction every week.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button onClick={reset}>Clear all filters</Button>
                <ButtonLink href="/contact" variant="outline">
                  Request a unit
                </ButtonLink>
              </div>
            </div>
          ) : (
            <>
              <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {results.slice(0, visible).map((product, i) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.4, ease: EASE, delay: Math.min(i, 6) * 0.03 }}
                    >
                      <ProductCard product={product} priority={i < 3} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {visible < results.length && (
                <div className="mt-10 text-center">
                  <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + 9)}>
                    Load {Math.min(9, results.length - visible)} more
                  </Button>
                  <p className="mt-3 text-xs text-ink-500">
                    Showing {visible} of {results.length}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.button
              type="button"
              aria-label="Close filters"
              onClick={() => setDrawerOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink-950/60 backdrop-blur-md"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filter inventory"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.44, ease: EASE }}
              className="absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-3xl bg-white"
            >
              <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
                <h2 className="font-display text-lg font-extrabold uppercase text-ink-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="grid h-9 w-9 place-items-center rounded-full text-ink-500 hover:bg-ink-100"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5">{panel}</div>
              <div className="border-t border-ink-100 p-4">
                <Button size="lg" className="w-full" onClick={() => setDrawerOpen(false)}>
                  Show {results.length} {results.length === 1 ? "unit" : "units"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------------ panel */

type SetFn = <K extends keyof Filters>(key: K, value: Filters[K]) => void;

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-ink-100 py-5 first:pt-0 last:border-0 last:pb-0">
      <p className="eyebrow mb-3 text-ink-400">{title}</p>
      {children}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300",
        active
          ? "border-accent-500 bg-accent-500 text-white"
          : "border-ink-200 text-ink-600 hover:border-ink-900 hover:text-ink-900",
      )}
    >
      {children}
    </button>
  );
}

function FilterPanel({
  filters,
  set,
  reset,
  activeCount,
}: {
  filters: Filters;
  set: SetFn;
  reset: () => void;
  activeCount: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <p className="font-display text-sm font-extrabold uppercase tracking-wide text-ink-900">
          Refine
        </p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="text-xs font-semibold text-accent-500 underline-offset-4 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <Group title="Keyword">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
          <label htmlFor="filter-q" className="sr-only">
            Search inventory
          </label>
          <input
            id="filter-q"
            value={filters.q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Make, model, stock #"
            className="h-11 w-full rounded-xl border border-ink-200 pl-10 pr-3 text-sm text-ink-900 transition-colors placeholder:text-ink-400 focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/12"
          />
        </div>
      </Group>

      <Group title="Condition">
        <div className="flex flex-wrap gap-2">
          <Pill active={filters.condition === ""} onClick={() => set("condition", "")}>
            All
          </Pill>
          <Pill active={filters.condition === "New"} onClick={() => set("condition", "New")}>
            New
          </Pill>
          <Pill active={filters.condition === "Pre-Owned"} onClick={() => set("condition", "Pre-Owned")}>
            Pre-owned
          </Pill>
        </div>
      </Group>

      <Group title="Category">
        <div className="flex flex-wrap gap-2">
          <Pill active={filters.category === ""} onClick={() => set("category", "")}>
            All
          </Pill>
          {categories.map((c) => (
            <Pill
              key={c.slug}
              active={filters.category === c.slug}
              onClick={() => set("category", filters.category === c.slug ? "" : c.slug)}
            >
              {c.name}
            </Pill>
          ))}
        </div>
      </Group>

      <Group title="Make">
        <div className="flex flex-wrap gap-2">
          <Pill active={filters.make === ""} onClick={() => set("make", "")}>
            All
          </Pill>
          {makes.map((m) => (
            <Pill key={m} active={filters.make === m} onClick={() => set("make", filters.make === m ? "" : m)}>
              {m}
            </Pill>
          ))}
        </div>
      </Group>

      <Group title="Model year">
        <div className="flex flex-wrap gap-2">
          <Pill active={filters.year === ""} onClick={() => set("year", "")}>
            Any
          </Pill>
          {years.map((y) => (
            <Pill
              key={y}
              active={filters.year === String(y)}
              onClick={() => set("year", filters.year === String(y) ? "" : String(y))}
            >
              {y}
            </Pill>
          ))}
        </div>
      </Group>

      <Group title="Store">
        <div className="flex flex-wrap gap-2">
          <Pill active={filters.location === ""} onClick={() => set("location", "")}>
            All stores
          </Pill>
          {locations.map((l) => (
            <Pill
              key={l.id}
              active={filters.location === l.id}
              onClick={() => set("location", filters.location === l.id ? "" : l.id)}
            >
              {l.city}
            </Pill>
          ))}
        </div>
      </Group>

      <Group title="Price">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-ink-500">Up to</span>
          <span className="font-display font-bold text-ink-900">{formatPrice(filters.maxPrice)}</span>
        </div>
        <label htmlFor="filter-price" className="sr-only">
          Maximum price
        </label>
        <input
          id="filter-price"
          type="range"
          min={2500}
          max={MAX}
          step={500}
          value={filters.maxPrice}
          onChange={(e) => set("maxPrice", Number(e.target.value))}
          className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full outline-offset-4
            [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:bg-accent-500 [&::-webkit-slider-thumb]:shadow-md
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-accent-500"
          style={{
            background: `linear-gradient(to right, var(--color-accent-500) ${
              ((filters.maxPrice - 2500) / (MAX - 2500)) * 100
            }%, var(--color-ink-200) ${((filters.maxPrice - 2500) / (MAX - 2500)) * 100}%)`,
          }}
        />
      </Group>

      <div className="pt-5">
        <p className="text-xs leading-relaxed text-ink-500">
          Not finding it?{" "}
          <Link href="/contact" className="font-semibold text-accent-500 underline-offset-4 hover:underline">
            Tell us what you want
          </Link>{" "}
          and we'll call when it lands.
        </p>
      </div>
    </div>
  );
}

function ActiveChips({
  filters,
  set,
  reset,
}: {
  filters: Filters;
  set: SetFn;
  reset: () => void;
}) {
  const chips: { label: string; clear: () => void }[] = [];
  if (filters.q) chips.push({ label: `“${filters.q}”`, clear: () => set("q", "") });
  if (filters.condition) chips.push({ label: filters.condition, clear: () => set("condition", "") });
  if (filters.category) {
    const name = categories.find((c) => c.slug === filters.category)?.name ?? filters.category;
    chips.push({ label: name, clear: () => set("category", "") });
  }
  if (filters.make) chips.push({ label: filters.make, clear: () => set("make", "") });
  if (filters.year) chips.push({ label: filters.year, clear: () => set("year", "") });
  if (filters.location) {
    const city = locations.find((l) => l.id === filters.location)?.city ?? filters.location;
    chips.push({ label: city, clear: () => set("location", "") });
  }
  if (filters.maxPrice < MAX) {
    chips.push({ label: `Under ${formatPrice(filters.maxPrice)}`, clear: () => set("maxPrice", MAX) });
  }

  return (
    <ul className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <li key={chip.label}>
          <button
            type="button"
            onClick={chip.clear}
            className="group/chip inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white py-1.5 pl-3.5 pr-2.5 text-xs font-medium text-ink-700 transition-colors hover:border-accent-500 hover:text-accent-500"
          >
            {chip.label}
            <X className="h-3 w-3" aria-hidden="true" />
            <span className="sr-only">Remove filter</span>
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={reset}
          className="px-2 text-xs font-semibold text-ink-500 underline-offset-4 transition-colors hover:text-accent-500 hover:underline"
        >
          Clear all
        </button>
      </li>
    </ul>
  );
}
