import type { Product } from "@/data/products";

export type Filters = {
  q: string;
  category: string;
  make: string;
  year: string;
  condition: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  sort: SortKey;
};

export type SortKey = "featured" | "price-asc" | "price-desc" | "year-desc" | "make-asc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "year-desc", label: "Newest model year" },
  { value: "make-asc", label: "Make: A to Z" },
];

export function defaultFilters(maxPrice: number): Filters {
  return {
    q: "",
    category: "",
    make: "",
    year: "",
    condition: "",
    location: "",
    minPrice: 0,
    maxPrice,
    sort: "featured",
  };
}

/** Reads a filter set out of URL search params, falling back to defaults. */
export function filtersFromParams(
  params: Record<string, string | string[] | undefined>,
  maxPrice: number,
): Filters {
  const one = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value) ?? "";
  };
  const num = (key: string, fallback: number) => {
    const parsed = Number(one(key));
    return Number.isFinite(parsed) && one(key) !== "" ? parsed : fallback;
  };

  const sort = one("sort") as SortKey;
  return {
    q: one("q"),
    category: one("category"),
    make: one("make"),
    year: one("year"),
    condition: one("condition"),
    location: one("location"),
    minPrice: num("minPrice", 0),
    maxPrice: num("maxPrice", maxPrice),
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : "featured",
  };
}

export function filtersToParams(filters: Filters, maxPrice: number): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.make) params.set("make", filters.make);
  if (filters.year) params.set("year", filters.year);
  if (filters.condition) params.set("condition", filters.condition);
  if (filters.location) params.set("location", filters.location);
  if (filters.minPrice > 0) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice < maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  return params;
}

export function activeFilterCount(filters: Filters, maxPrice: number) {
  let n = 0;
  if (filters.q) n++;
  if (filters.category) n++;
  if (filters.make) n++;
  if (filters.year) n++;
  if (filters.condition) n++;
  if (filters.location) n++;
  if (filters.minPrice > 0 || filters.maxPrice < maxPrice) n++;
  return n;
}

export function applyFilters(products: Product[], filters: Filters): Product[] {
  const q = filters.q.trim().toLowerCase();

  const matched = products.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.make && p.make !== filters.make) return false;
    if (filters.year && p.year !== Number(filters.year)) return false;
    if (filters.condition && p.condition !== filters.condition) return false;
    if (filters.location && p.locationId !== filters.location) return false;
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
    if (q) {
      const haystack = [p.title, p.make, p.model, p.trim, p.category, p.stockNumber, p.color]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const sorted = [...matched];
  switch (filters.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "year-desc":
      sorted.sort((a, b) => b.year - a.year || a.price - b.price);
      break;
    case "make-asc":
      sorted.sort((a, b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model));
      break;
    default:
      // Featured, then discounted, then newest.
      sorted.sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          Number(b.savings > 0) - Number(a.savings > 0) ||
          b.year - a.year,
      );
  }
  return sorted;
}
