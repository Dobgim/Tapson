import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LayoutGrid } from "lucide-react";
import { CategoryIcon } from "./CategoryIcon";
import { Reveal, Stagger, StaggerItem } from "./motion/Reveal";
import { SectionHeading } from "./SectionHeading";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

function countIn(slug: string) {
  return products.filter((p) => p.category === slug).length;
}

export function CategoryGrid() {
  return (
    <section className="bg-ink-50 py-20 lg:py-28" aria-labelledby="categories-heading">
      <div className="shell">
        <SectionHeading
          id="categories-heading"
          eyebrow="Shop by category"
          title="Every way to get out there"
          body="Nine departments under three roofs. Pick a lane and we'll show you what's on the floor right now."
          action={{ label: "All inventory", href: "/inventory" }}
        />

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={0.06}>
          {categories.map((category) => (
            <StaggerItem key={category.slug}>
              <Link
                href={`/inventory?category=${category.slug}`}
                className="group/card relative block h-64 overflow-hidden rounded-2xl bg-ink-900 shadow-lift transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-lift-lg sm:h-72"
              >
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover/card:scale-110"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,8,11,0.92)_5%,rgba(6,8,11,0.35)_55%,rgba(6,8,11,0.1)_100%)] transition-opacity duration-500 group-hover/card:opacity-90"
                />

                <div className="relative flex h-full flex-col justify-between p-6">
                  <div className="flex items-start justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors duration-500 group-hover/card:border-accent-400 group-hover/card:bg-accent-500">
                      <CategoryIcon name={category.icon} className="h-5 w-5" />
                    </span>
                    <span className="rounded-full border border-white/20 bg-black/20 px-2.5 py-1 font-display text-[0.625rem] font-bold uppercase tracking-[0.16em] text-white/80 backdrop-blur-sm">
                      {countIn(category.slug)} in stock
                    </span>
                  </div>

                  <div className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/card:-translate-y-1">
                    <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
                      {category.name}
                    </h3>
                    <p className="mt-1.5 max-w-[22rem] text-sm leading-snug text-white/60">
                      {category.blurb}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-white">
                      View models
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}

          <StaggerItem>
            <Link
              href="/inventory"
              className="group/card relative flex h-64 flex-col justify-between overflow-hidden rounded-2xl border border-ink-200 bg-white p-6 shadow-lift transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-accent-500 hover:shadow-lift-lg sm:h-72"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-900 text-white transition-colors duration-500 group-hover/card:bg-accent-500">
                <LayoutGrid className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink-900">
                  All inventory
                </h3>
                <p className="mt-1.5 text-sm leading-snug text-ink-500">
                  Filter {products.length}+ units by make, price, condition and store.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-accent-500">
                  Open the search
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </StaggerItem>
        </Stagger>

        <Reveal delay={0.1} className="mt-10 text-center">
          <p className="text-sm text-ink-500">
            Can't see what you're after?{" "}
            <Link href="/contact" className="font-semibold text-accent-500 underline-offset-4 hover:underline">
              Tell us what you want and we'll source it.
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
