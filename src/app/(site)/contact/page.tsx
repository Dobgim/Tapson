import type { Metadata } from "next";
import { BreadcrumbSchema, PageHero } from "@/components/PageHero";
import { ContactSection } from "@/components/ContactSection";
import { LocationsSection } from "@/components/LocationsSection";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call, email or message Repossessed Rides. Sales, service, parts and financing enquiries for our Burlington, Vermont store.",
  alternates: { canonical: "/contact" },
};

const crumbs = [{ label: "Contact" }];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const raw = params.topic;
  const topic = (Array.isArray(raw) ? raw[0] : raw) ?? "sales";

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to a human"
        body="Whichever way you get in touch, someone who works on the floor answers — usually within a business day."
        image="/images/hero/hero-2.webp"
        crumbs={crumbs}
      />
      <ContactSection defaultTopic={topic} />
      <LocationsSection />
      <BreadcrumbSchema crumbs={crumbs} baseUrl={site.url} />
    </>
  );
}
