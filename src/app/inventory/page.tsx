import type { Metadata } from "next";
import { Suspense } from "react";
import { InventoryBrowser } from "@/components/inventory/InventoryBrowser";
import { filtersFromParams } from "@/components/inventory/filters";
import { BreadcrumbSchema, PageHero } from "@/components/PageHero";
import { categoryBySlug, type CategorySlug } from "@/data/categories";
import { priceBounds } from "@/data/products";
import { site } from "@/data/site";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const raw = params.category;
  const slug = (Array.isArray(raw) ? raw[0] : raw) as CategorySlug | undefined;
  const category = slug ? categoryBySlug.get(slug) : undefined;

  const title = category ? `${category.name} for sale in South Florida` : "Inventory";
  const description = category
    ? `${category.blurb} Browse ${category.name.toLowerCase()} in stock at Repossessed Rides across Miami, Key Largo and Pompano Beach.`
    : "Filter every new and pre-owned unit in stock across our three South Florida stores by make, model, price, condition and location.";

  return {
    title,
    description,
    alternates: { canonical: category ? `/inventory?category=${category.slug}` : "/inventory" },
    openGraph: { title: `${title} | ${site.name}`, description },
  };
}

export default async function InventoryPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const initial = filtersFromParams(params, priceBounds.max);
  const category = initial.category ? categoryBySlug.get(initial.category as CategorySlug) : undefined;

  const crumbs = [
    { label: "Inventory", href: category ? "/inventory" : undefined },
    ...(category ? [{ label: category.name }] : []),
  ];

  return (
    <>
      <PageHero
        eyebrow={category ? "Category" : "Browse the floor"}
        title={category ? category.name : "Every unit, one search"}
        body={
          category
            ? category.blurb
            : "New and pre-owned inventory across all three stores. Filter it down, save what you like, and we'll hold it for 24 hours."
        }
        image={category?.image ?? "/images/hero/hero-3.webp"}
        crumbs={crumbs}
      />

      {/* Filters live in a client boundary; searchParams already resolved above. */}
      <Suspense fallback={<div className="shell py-20 text-sm text-ink-500">Loading inventory…</div>}>
        <InventoryBrowser initial={initial} />
      </Suspense>

      <BreadcrumbSchema crumbs={crumbs} baseUrl={site.url} />
    </>
  );
}
