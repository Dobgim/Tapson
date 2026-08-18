import type { Metadata } from "next";
import { About } from "@/components/About";
import { BrandSection } from "@/components/BrandSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ContactSection } from "@/components/ContactSection";
import { FeaturedInventory } from "@/components/FeaturedInventory";
import { FinancingCta } from "@/components/FinancingCta";
import { Hero } from "@/components/Hero";
import { InventoryQuickSearch } from "@/components/InventoryQuickSearch";
import { LocationsSection } from "@/components/LocationsSection";
import { Services } from "@/components/Services";
import { Specials } from "@/components/Specials";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: `${site.name} — ${site.tagline}` },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <InventoryQuickSearch />
      <CategoryGrid />
      <Specials />
      <FeaturedInventory />
      <BrandSection />
      <Services />
      <About />
      <FinancingCta />
      <LocationsSection />
      <ContactSection />
    </>
  );
}
