import { LocationCard } from "./LocationCard";
import { SectionHeading } from "./SectionHeading";
import { Stagger, StaggerItem } from "./motion/Reveal";
import { locations } from "@/data/site";

export function LocationsSection() {
  return (
    <section className="bg-white py-20 lg:py-28" aria-labelledby="locations-heading">
      <div className="shell">
        <SectionHeading
          id="locations-heading"
          eyebrow="Find us"
          title="Three stores, one inventory"
          body="Units move between stores on request, so buy where it's convenient and we'll get it to the right address."
          action={{ label: "All locations", href: "/locations" }}
        />

        <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3" step={0.08}>
          {locations.map((location) => (
            <StaggerItem key={location.id} className="h-full">
              <LocationCard location={location} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
