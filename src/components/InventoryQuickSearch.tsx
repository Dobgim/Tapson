"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button, ButtonLink } from "./ui/Button";
import { Reveal } from "./motion/Reveal";
import { categories } from "@/data/categories";
import { makes, years } from "@/data/products";
import { formatPrice } from "@/lib/finance";

const priceSteps = [5000, 10000, 15000, 25000, 40000, 100000];

const selectClass =
  "h-12 w-full appearance-none rounded-xl border border-ink-200 bg-white px-4 pr-9 text-sm text-ink-900 " +
  "transition-colors focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/12";

const chevron = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2355606f' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.85rem center",
  backgroundSize: "1rem",
};

/**
 * Homepage entry point into the inventory. Composes a querystring and hands off
 * to /inventory, where the full filter UI takes over.
 */
export function InventoryQuickSearch() {
  const router = useRouter();
  const [values, setValues] = useState({
    category: "",
    make: "",
    year: "",
    maxPrice: "",
    condition: "",
  });

  const set = (key: keyof typeof values) => (value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
      if (value) params.set(key, value);
    }
    router.push(`/inventory${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section className="relative z-10 bg-white" aria-labelledby="quick-search-heading">
      <div className="shell -mt-10 pb-16 sm:-mt-14 lg:pb-20">
        <Reveal>
          <form
            onSubmit={submit}
            className="rounded-2xl border border-ink-200 bg-white p-5 shadow-lift-lg sm:p-7"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2
                id="quick-search-heading"
                className="flex items-center gap-2 font-display text-base font-extrabold uppercase tracking-tight text-ink-900"
              >
                <SlidersHorizontal className="h-4 w-4 text-accent-500" aria-hidden="true" />
                Search inventory
              </h2>
              <ButtonLink href="/inventory" variant="ghost" size="sm" className="px-0">
                Browse everything
              </ButtonLink>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <div className="lg:col-span-1">
                <label htmlFor="qs-category" className="sr-only">
                  Category
                </label>
                <select
                  id="qs-category"
                  value={values.category}
                  onChange={(e) => set("category")(e.target.value)}
                  className={selectClass}
                  style={chevron}
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-1">
                <label htmlFor="qs-make" className="sr-only">
                  Make
                </label>
                <select
                  id="qs-make"
                  value={values.make}
                  onChange={(e) => set("make")(e.target.value)}
                  className={selectClass}
                  style={chevron}
                >
                  <option value="">All makes</option>
                  {makes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-1">
                <label htmlFor="qs-year" className="sr-only">
                  Year
                </label>
                <select
                  id="qs-year"
                  value={values.year}
                  onChange={(e) => set("year")(e.target.value)}
                  className={selectClass}
                  style={chevron}
                >
                  <option value="">Any year</option>
                  {years.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-1">
                <label htmlFor="qs-condition" className="sr-only">
                  Condition
                </label>
                <select
                  id="qs-condition"
                  value={values.condition}
                  onChange={(e) => set("condition")(e.target.value)}
                  className={selectClass}
                  style={chevron}
                >
                  <option value="">New & used</option>
                  <option value="New">New only</option>
                  <option value="Pre-Owned">Pre-owned only</option>
                </select>
              </div>

              <div className="lg:col-span-1">
                <label htmlFor="qs-price" className="sr-only">
                  Maximum price
                </label>
                <select
                  id="qs-price"
                  value={values.maxPrice}
                  onChange={(e) => set("maxPrice")(e.target.value)}
                  className={selectClass}
                  style={chevron}
                >
                  <option value="">Any price</option>
                  {priceSteps.map((p) => (
                    <option key={p} value={String(p)}>
                      Under {formatPrice(p)}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" size="lg" className="h-12 w-full lg:col-span-1">
                <Search className="h-4 w-4" aria-hidden="true" />
                Search
              </Button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
