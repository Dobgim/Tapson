import type { Metadata } from "next";
import { BadgePercent, Clock, ShieldCheck } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { FinancingCta } from "@/components/FinancingCta";
import { SectionHeading } from "@/components/SectionHeading";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/Reveal";
import { ButtonLink, SlideArrow } from "@/components/ui/Button";
import { specialProducts } from "@/data/products";
import { site } from "@/data/site";
import { formatPrice } from "@/lib/finance";

export const metadata: Metadata = {
  title: "Manager's Specials",
  description:
    "Discounted new and pre-owned powersports units at RIVA Motorsports. Factory rebates stacked with dealer discounts across Miami, Key Largo and Pompano Beach.",
  alternates: { canonical: "/specials" },
};

const crumbs = [{ label: "Manager's Specials" }];

const guarantees = [
  { Icon: BadgePercent, title: "Freight & prep included", body: "The advertised number is the number you sign for — no surprise line items at delivery." },
  { Icon: Clock, title: "Held for 24 hours", body: "Ask us to hold a special and it's yours to think about until this time tomorrow." },
  { Icon: ShieldCheck, title: "Full factory warranty", body: "Discounted price, identical coverage. Nothing about the warranty changes." },
];

export default function SpecialsPage() {
  const units = specialProducts();
  const totalSaving = units.reduce((sum, u) => sum + u.savings, 0);

  return (
    <>
      <PageHero
        eyebrow="Limited time"
        title="Manager's specials"
        body="Units we want off the floor this month, priced accordingly. When the allocation is gone the price goes back."
        image="/images/hero/hero-1.webp"
        crumbs={crumbs}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#units" size="lg">
            See the {units.length} units
            <SlideArrow />
          </ButtonLink>
          <ButtonLink href="/financing#calculator" variant="light" size="lg">
            Work out a payment
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-b border-ink-200 bg-white py-8">
        <div className="shell grid gap-6 sm:grid-cols-3">
          {guarantees.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.07} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-50 text-accent-500">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-wide text-ink-900">{title}</p>
                <p className="mt-1 text-sm leading-snug text-ink-500">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="units" className="bg-ink-50 py-16 lg:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow={`${formatPrice(totalSaving)} in total savings`}
            title="On the floor right now"
            body="Every unit below is physically in stock at one of our three stores and available today."
            action={{ label: "Browse all inventory", href: "/inventory" }}
          />

          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" step={0.06}>
            {units.map((product, i) => (
              <StaggerItem key={product.id} className="h-full">
                <ProductCard product={product} priority={i < 3} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <FinancingCta />
      <BreadcrumbSchema crumbs={crumbs} baseUrl={site.url} />
    </>
  );
}
