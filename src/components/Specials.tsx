import { BadgePercent, Clock, ShieldCheck } from "lucide-react";
import { ProductCarousel } from "./ProductCarousel";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion/Reveal";
import { specialProducts } from "@/data/products";

const promises = [
  { Icon: BadgePercent, title: "Freight & prep included", body: "The advertised number is the number you sign for." },
  { Icon: Clock, title: "Same-week delivery", body: "Most units leave the floor within five days of deposit." },
  { Icon: ShieldCheck, title: "Factory warranty", body: "Full manufacturer coverage plus our own 30-day guarantee." },
];

export function Specials() {
  const units = specialProducts();

  return (
    <section className="bg-ink-950 py-20 text-white lg:py-28" aria-labelledby="specials-heading">
      <div className="shell">
        <SectionHeading
          id="specials-heading"
          eyebrow="Manager's specials"
          title="This month's sharpest pricing"
          body="Factory rebates stacked with dealer discounts on units we want moved. When they're gone they're gone."
          action={{ label: "All specials", href: "/specials" }}
          tone="light"
        />

        <Reveal delay={0.1} className="mt-12">
          <ProductCarousel products={units} tone="light" />
        </Reveal>

        <div className="mt-14 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
          {promises.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.08} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/8 text-accent-400">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-wide text-white">{title}</p>
                <p className="mt-1 text-sm leading-snug text-white/50">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
