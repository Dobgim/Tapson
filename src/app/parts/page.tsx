import type { Metadata } from "next";
import { Boxes, HardHat, LifeBuoy, PackageSearch, Shirt, Wrench } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/PageHero";
import { ServiceForm } from "@/components/forms/ServiceForm";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ButtonLink, SlideArrow } from "@/components/ui/Button";
import { brands } from "@/data/brands";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Parts & Accessories",
  description:
    "OEM parts, accessories, helmets and riding gear for Yamaha, Suzuki, Polaris, Can-Am, Sea-Doo, CFMOTO and more at RIVA Motorsports in South Florida.",
  alternates: { canonical: "/parts" },
};

const crumbs = [{ label: "Parts & Accessories" }];

const departments = [
  { Icon: PackageSearch, title: "OEM parts", body: "Genuine parts for every franchised line we carry, with the fiche open on the counter so you get the right one first time." },
  { Icon: Wrench, title: "Maintenance items", body: "Oil, filters, plugs, belts, impellers and anodes for the machines we actually sell — in stock, not ordered." },
  { Icon: Boxes, title: "Accessories", body: "Racks, windshields, audio, lighting, covers, trailers and tow gear. Fitted here if you want it fitted." },
  { Icon: HardHat, title: "Helmets & protection", body: "Full range of road, off-road and watersport helmets, with proper sizing rather than a guess." },
  { Icon: Shirt, title: "Riding gear & apparel", body: "Jackets, gloves, boots and Florida-appropriate mesh that doesn't cook you in August." },
  { Icon: LifeBuoy, title: "Marine safety", body: "PFDs, flares, kill switches, dock lines and everything the Coast Guard will ask about." },
];

export default function PartsPage() {
  return (
    <>
      <PageHero
        eyebrow="Parts & accessories"
        title="A parts counter that's actually stocked"
        body="The difference between a good dealer and a bad one is whether the part is on the shelf. Ours usually is — and when it isn't, it's days away, not weeks."
        image="/images/categories/generators.webp"
        crumbs={crumbs}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#order" size="lg">
            Request a part
            <SlideArrow />
          </ButtonLink>
          <ButtonLink href="/service" variant="light" size="lg">
            Have us fit it
          </ButtonLink>
        </div>
      </PageHero>

      <section className="bg-white py-16 lg:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="What's on the shelf"
            title="Six counters, one department"
            body="If it bolts to something we sell, we either have it or we can get it."
          />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" step={0.06}>
            {departments.map((d) => (
              <StaggerItem key={d.title}>
                <div className="h-full rounded-2xl border border-ink-200 bg-white p-6 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-lift">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink-900 text-white">
                    <d.Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-base font-extrabold uppercase tracking-tight text-ink-900">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{d.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="border-y border-ink-200 bg-ink-50 py-14">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-6 text-center text-ink-400">Parts stocked for</p>
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {brands.map((b) => (
                <li
                  key={b.slug}
                  className="font-display text-lg font-extrabold uppercase tracking-[0.06em] text-ink-400 transition-colors duration-300 hover:text-ink-900"
                >
                  {b.name}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="order" className="bg-white py-16 lg:py-24">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-3 text-accent-500">Order a part</p>
            <h2 className="display-lg text-ink-900">Tell us what you need</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              Part numbers are ideal but not required — describe it, or tell us the symptom, and the
              counter will work it out. We'll confirm availability and pricing before charging
              anything.
            </p>
            <div className="mt-8 rounded-2xl bg-ink-950 p-6 text-white">
              <p className="eyebrow text-accent-400">Fitting available</p>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Accessories bought here can be fitted by our technicians, usually same-day for
                simple items. Ask when you order and we'll quote the labour up front.
              </p>
              <ButtonLink href="/service#schedule" variant="light" size="sm" className="mt-5">
                Book the shop
                <SlideArrow />
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.12} direction="left" className="lg:col-span-7">
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-lift sm:p-9">
              <ServiceForm kind="parts" />
            </div>
          </Reveal>
        </div>
      </section>

      <BreadcrumbSchema crumbs={crumbs} baseUrl={site.url} />
    </>
  );
}
