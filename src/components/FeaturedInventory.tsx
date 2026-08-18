import { ProductCarousel } from "./ProductCarousel";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion/Reveal";
import { featuredProducts } from "@/data/products";

export function FeaturedInventory() {
  return (
    <section className="bg-white py-20 lg:py-28" aria-labelledby="featured-heading">
      <div className="shell">
        <SectionHeading
          id="featured-heading"
          eyebrow="Just arrived"
          title="Fresh on the floor"
          body="The units our sales team keeps walking people over to. All in stock, all ready to ride out."
          action={{ label: "All inventory", href: "/inventory" }}
        />
        <Reveal delay={0.1} className="mt-12">
          <ProductCarousel products={featuredProducts()} />
        </Reveal>
      </div>
    </section>
  );
}
