import type { Metadata } from "next";
import { BreadcrumbSchema, PageHero } from "@/components/PageHero";
import { LocationCard } from "@/components/LocationCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/Reveal";
import { ButtonLink, SlideArrow } from "@/components/ui/Button";
import { locations, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Locations & Hours",
  description:
    "RIVA Motorsports store locations, opening hours, phone numbers and directions for Miami, Key Largo and Pompano Beach, Florida.",
  alternates: { canonical: "/locations" },
};

const crumbs = [{ label: "Locations" }];

export default function LocationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Find us"
        title="Three stores, one inventory"
        body="Buy at whichever store is convenient. We move units between Miami, Key Largo and Pompano Beach for collection at no charge."
        image="/images/hero/hero-4.webp"
        crumbs={crumbs}
      />

      <section className="bg-ink-50 py-16 lg:py-24">
        <div className="shell">
          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" step={0.09}>
            {locations.map((location) => (
              <StaggerItem key={location.id} className="h-full">
                <LocationCard location={location} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Not local?"
            title="We ship and we deliver"
            body="We regularly deliver across Florida and arrange enclosed transport nationwide. Ask for a quote when you enquire on a unit."
            align="center"
          />
          <Reveal delay={0.1} className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/inventory" size="lg">
              Browse inventory
              <SlideArrow />
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Ask about delivery
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <BreadcrumbSchema crumbs={crumbs} baseUrl={site.url} />
    </>
  );
}
