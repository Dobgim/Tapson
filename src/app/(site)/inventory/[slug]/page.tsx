import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin, ShieldCheck, Tag } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/PageHero";
import { ImageGallery } from "@/components/ImageGallery";
import { ProductActions } from "@/components/ProductActions";
import { ProductCarousel } from "@/components/ProductCarousel";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { categoryName } from "@/data/categories";
import { productBySlug, products, relatedProducts } from "@/data/products";
import { locations, site } from "@/data/site";
import { DEFAULT_APR, DEFAULT_TERM_MONTHS, formatPrice } from "@/lib/finance";
import { formatUsage } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug.get(slug);
  if (!product) return { title: "Unit not found" };

  const title = `${product.title} — ${formatPrice(product.price)}`;
  const description = `${product.condition} ${product.title} in stock at Repossessed Rides. ${product.description.slice(0, 130)}...`;

  return {
    title,
    description,
    alternates: { canonical: `/inventory/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${title} | ${site.name}`,
      description,
      images: [{ url: product.images[0], width: 1600, height: 1200, alt: product.title }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug.get(slug);
  if (!product) notFound();

  const store = locations.find((l) => l.id === product.locationId);
  const usage = formatUsage(product.usage);
  const related = relatedProducts(product);

  const crumbs = [
    { label: "Inventory", href: "/inventory" },
    { label: categoryName(product.category), href: `/inventory?category=${product.category}` },
    { label: product.title },
  ];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    sku: product.stockNumber,
    description: product.description,
    image: product.images.map((i) => `${site.url}${i}`),
    brand: { "@type": "Brand", name: product.make },
    model: product.model,
    productionDate: String(product.year),
    color: product.color,
    itemCondition:
      product.condition === "New"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${site.url}/inventory/${product.slug}`,
      seller: { "@type": "Organization", name: site.name },
    },
  };

  return (
    <>
      <PageHero
        eyebrow={`${product.condition} · ${categoryName(product.category)}`}
        title={product.title}
        image={product.images[0]}
        crumbs={crumbs}
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <ImageGallery images={product.images} title={product.title} />

            <Reveal className="mt-12">
              <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink-900">
                About this unit
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-600">{product.description}</p>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink-900">
                Key features
              </h2>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-600">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-500/10">
                      <Check className="h-3 w-3 text-accent-500" aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink-900">
                Specifications
              </h2>
              <dl className="mt-5 overflow-hidden rounded-2xl border border-ink-200">
                {product.specifications.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`grid grid-cols-2 gap-4 px-5 py-3.5 text-sm ${
                      i % 2 === 0 ? "bg-ink-50" : "bg-white"
                    }`}
                  >
                    <dt className="font-medium text-ink-600">{spec.label}</dt>
                    <dd className="text-ink-900">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Buy box */}
          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-lift sm:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 font-display text-[0.625rem] font-bold uppercase tracking-[0.14em] text-white ${
                      product.condition === "New" ? "bg-accent-500" : "bg-ink-900"
                    }`}
                  >
                    {product.condition}
                  </span>
                  {product.savings > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 font-display text-[0.625rem] font-bold uppercase tracking-[0.14em] text-white">
                      <Tag className="h-3 w-3" aria-hidden="true" />
                      Save {formatPrice(product.savings)}
                    </span>
                  )}
                  <span className="rounded-full border border-ink-200 px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-wide text-ink-500">
                    Stock {product.stockNumber}
                  </span>
                </div>

                <div className="mt-5">
                  {product.msrp && (
                    <p className="text-sm text-ink-400 line-through">MSRP {formatPrice(product.msrp)}</p>
                  )}
                  <p className="font-display text-4xl font-extrabold tracking-tight text-ink-900">
                    {formatPrice(product.price)}
                  </p>
                  <p className="mt-1.5 text-sm text-ink-500">
                    or{" "}
                    <span className="font-display text-base font-bold text-accent-500">
                      ${product.monthlyPayment}/mo
                    </span>{" "}
                    — {DEFAULT_TERM_MONTHS} months at {DEFAULT_APR}% APR, 10% down, with approved
                    credit.
                  </p>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-ink-100 py-5 text-sm">
                  <div>
                    <dt className="text-xs text-ink-400">Year</dt>
                    <dd className="font-semibold text-ink-900">{product.year}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400">Make</dt>
                    <dd className="font-semibold text-ink-900">{product.make}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400">Colour</dt>
                    <dd className="font-semibold text-ink-900">{product.color}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400">{usage ? "Usage" : "Category"}</dt>
                    <dd className="font-semibold text-ink-900">
                      {usage ?? categoryName(product.category)}
                    </dd>
                  </div>
                </dl>

                {store && (
                  <div className="mt-5 flex items-start gap-3 rounded-xl bg-ink-50 p-4 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-ink-900">{store.name}</p>
                      <p className="text-xs text-ink-500">
                        {store.street}, {store.city}, {store.region} {store.postalCode}
                      </p>
                      <Link
                        href={`/locations#${store.id}`}
                        className="mt-1 inline-block text-xs font-semibold text-accent-500 underline-offset-4 hover:underline"
                      >
                        Hours & directions
                      </Link>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <ProductActions
                    slug={product.slug}
                    title={product.title}
                    stockNumber={product.stockNumber}
                    store={store}
                  />
                </div>

                <p className="mt-5 flex items-start gap-2 text-[0.6875rem] leading-relaxed text-ink-500">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                  Price excludes tax, title, registration and dealer fees. Availability confirmed at
                  the time of enquiry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink-50 py-20 lg:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="You might also like"
            title="Similar units in stock"
            action={{ label: "All inventory", href: "/inventory" }}
          />
          <div className="mt-10">
            <ProductCarousel products={related} />
          </div>
        </div>
      </section>

      <BreadcrumbSchema crumbs={crumbs} baseUrl={site.url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
}
