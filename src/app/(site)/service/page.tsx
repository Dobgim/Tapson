import type { Metadata } from "next";
import Image from "next/image";
import { Anchor, Cog, Droplets, Gauge, ShieldCheck, Timer } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/PageHero";
import { ServiceForm } from "@/components/forms/ServiceForm";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ButtonLink, SlideArrow } from "@/components/ui/Button";
import { locations, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Service Centre",
  description:
    "Factory-certified powersports and marine service in Burlington, Vermont. Maintenance, diagnostics, repowers and warranty work on Yamaha, Sea-Doo, Can-Am, Polaris and more.",
  alternates: { canonical: "/service" },
};

const crumbs = [{ label: "Service" }];

const capabilities = [
  { Icon: Cog, title: "Scheduled maintenance", body: "Factory service intervals done to the book, with the stamps to prove it at resale." },
  { Icon: Gauge, title: "Diagnostics", body: "Manufacturer diagnostic software for every line we carry — not a generic OBD reader." },
  { Icon: Anchor, title: "Marine rigging & repowers", body: "Outboard installs, controls, electronics and full repowers in house." },
  { Icon: Droplets, title: "Storage & hurricane prep", body: "Fuel stabilisation, fogging, battery tending and indoor storage through the season." },
  { Icon: Timer, title: "Same-day minor work", body: "Tires, batteries, oil services and accessory fitting while you wait." },
  { Icon: ShieldCheck, title: "Warranty & recalls", body: "Authorised across every franchised line, so warranty work happens here, not elsewhere." },
];

export default function ServicePage() {
  return (
    <>
      <PageHero
        eyebrow="Service centre"
        title="The department that keeps people coming back"
        body="Factory-certified technicians across Yamaha, Sea-Doo, Can-Am, Polaris, Suzuki and CFMOTO. Most of them have been in this shop for a decade."
        image="/images/dealership/service.webp"
        crumbs={crumbs}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#schedule" size="lg">
            Schedule service
            <SlideArrow />
          </ButtonLink>
          <ButtonLink href="/parts" variant="light" size="lg">
            Parts counter
          </ButtonLink>
        </div>
      </PageHero>

      <section className="bg-white py-16 lg:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="What we do"
            title="Everything, in-house"
            body="Nothing gets subcontracted out. If it came off our floor, it gets fixed on our floor."
          />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" step={0.06}>
            {capabilities.map((c) => (
              <StaggerItem key={c.title}>
                <div className="h-full rounded-2xl border border-ink-200 bg-white p-6 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-lift">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink-900 text-white">
                    <c.Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-base font-extrabold uppercase tracking-tight text-ink-900">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{c.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-ink-950 py-16 text-white lg:py-24">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="right">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/dealership/marine.webp"
                alt="Stylised artwork of the marine service department"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="eyebrow mb-3 text-accent-400">Marine department</p>
              <h2 className="display-lg text-white">Rigging, repowers and everything wet</h2>
              <p className="mt-5 text-base leading-relaxed text-white/60">
                Our Burlington store is a full marine facility — outboard installs, electronics,
                steering and control systems, bottom work and seasonal storage. It's also where our
                boat inventory lives, which means sea trials happen from the same dock.
              </p>
            </Reveal>
            <Reveal delay={0.12} className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/inventory?category=boats" size="lg">
                Shop boats
                <SlideArrow />
              </ButtonLink>
              <ButtonLink href={`/locations#${locations[0].id}`} variant="light" size="lg">
                Burlington store
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="schedule" className="bg-ink-50 py-16 lg:py-24">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="min-w-0 lg:col-span-5">
            <p className="eyebrow mb-3 text-accent-500">Book it in</p>
            <h2 className="display-lg text-ink-900">Schedule service</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              Pick a store and a date and we'll confirm the slot by phone the same day. For anything
              major we'll sort a loaner where we can.
            </p>

            <div className="mt-8 space-y-4">
              {locations.map((loc) => (
                <div key={loc.id} className="rounded-xl border border-ink-200 bg-white p-5">
                  <p className="font-display text-sm font-bold uppercase tracking-wide text-ink-900">
                    {loc.city}
                  </p>
                  <p className="mt-1 text-sm text-ink-500">{loc.specialties.join(" · ")}</p>
                  <a
                    href={loc.phoneHref}
                    className="mt-2 inline-block text-sm font-semibold text-accent-500 underline-offset-4 hover:underline"
                  >
                    {loc.phone}
                  </a>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12} direction="left" className="min-w-0 lg:col-span-7">
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-lift sm:p-9">
              <ServiceForm kind="service" />
            </div>
          </Reveal>
        </div>
      </section>

      <BreadcrumbSchema crumbs={crumbs} baseUrl={site.url} />
    </>
  );
}
