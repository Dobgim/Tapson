import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Stagger, StaggerItem } from "./motion/Reveal";
import { brands } from "@/data/brands";

/**
 * Image-led brand grid: a photograph of the line each brand is known for,
 * darkened, with the brand set as our own typographic wordmark. Nominative
 * reference only — no manufacturer logo artwork is reproduced.
 */
export function BrandSection() {
  return (
    <section
      className="border-y border-ink-800 bg-ink-950 py-20 lg:py-24"
      aria-labelledby="brands-heading"
    >
      <div className="shell">
        <SectionHeading
          id="brands-heading"
          eyebrow="Franchised lines"
          title="The brands we sell and service"
          body="Factory-authorised across every line we carry, which means warranty work, recalls and parts all happen in-house."
          align="center"
          tone="light"
        />

        <Stagger
          className="mt-12 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4"
          step={0.05}
        >
          {brands.map((brand) => (
            <StaggerItem key={brand.slug}>
              <Link
                href={`/inventory?make=${encodeURIComponent(brand.name)}`}
                className="group/tile relative block aspect-3/4 overflow-hidden rounded-lg bg-ink-900 sm:aspect-4/5 lg:aspect-3/4"
              >
                <Image
                  src={brand.image}
                  alt={`${brand.name} models at Repossessed Rides`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover/tile:scale-[1.07]"
                />

                {/* Legibility floor for the wordmark, deepening on hover. */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/10 transition-opacity duration-500 group-hover/tile:opacity-90" />

                {/* Category list — hidden until hover on pointer devices. */}
                <div className="absolute inset-x-0 top-0 p-4 sm:p-5">
                  <ul className="space-y-0.5 opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100 motion-safe:-translate-y-1 motion-safe:group-hover/tile:translate-y-0">
                    {brand.lines.map((line) => (
                      <li
                        key={line}
                        className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-white/85 sm:text-xs"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 sm:p-5">
                  <span className="font-display text-xl font-extrabold uppercase leading-none tracking-[-0.02em] text-white sm:text-2xl lg:text-[1.75rem]">
                    {brand.name}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-5 shrink-0 text-white/70 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover/tile:text-accent-300 motion-safe:translate-y-1 motion-safe:opacity-0 motion-safe:group-hover/tile:translate-y-0 motion-safe:group-hover/tile:opacity-100"
                  />
                </div>

                {/* Accent hairline that draws in from the left on hover. */}
                <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent-500 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/tile:scale-x-100" />
              </Link>
            </StaggerItem>
          ))}

          {/* Closing tile mirrors the reference grid's "All Inventory" cell. */}
          <StaggerItem className="min-w-0 col-span-2">
            <Link
              href="/inventory"
              className="group/tile relative block aspect-3/2 overflow-hidden rounded-lg bg-ink-900 sm:aspect-8/5 lg:aspect-3/2"
            >
              <Image
                src="/images/brands/all-inventory.webp"
                alt="Browse the full Repossessed Rides inventory"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover/tile:scale-[1.07]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-ink-950/15" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
                <span className="font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.02em] text-white sm:text-3xl lg:text-4xl">
                  All Inventory
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="size-6 shrink-0 text-white/70 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover/tile:text-accent-300 motion-safe:translate-y-1 motion-safe:opacity-0 motion-safe:group-hover/tile:translate-y-0 motion-safe:group-hover/tile:opacity-100"
                />
              </div>
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent-500 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/tile:scale-x-100" />
            </Link>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
