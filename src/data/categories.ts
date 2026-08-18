export type CategorySlug =
  | "motorcycles"
  | "atvs"
  | "side-by-sides"
  | "watercraft"
  | "boats"
  | "golf-carts"
  | "scooters"
  | "dirt-bikes"
  | "generators";

export type Category = {
  slug: CategorySlug;
  name: string;
  /** Lucide icon name, resolved by the CategoryIcon component. */
  icon: string;
  blurb: string;
  image: string;
  /** Duotone accent used by the generated artwork, kept in sync for gradients. */
  hue: string;
};

export const categories: Category[] = [
  {
    slug: "motorcycles",
    name: "Motorcycles",
    icon: "Bike",
    blurb: "Sport, touring and cruiser platforms built for the open road.",
    image: "/images/categories/motorcycles.webp",
    hue: "#d81f18",
  },
  {
    slug: "atvs",
    name: "ATVs",
    icon: "Mountain",
    blurb: "Four-wheel utility and sport quads for trail, farm and dune.",
    image: "/images/categories/atvs.webp",
    hue: "#c2570f",
  },
  {
    slug: "side-by-sides",
    name: "Side-by-Sides",
    icon: "Car",
    blurb: "Two, four and six-seat UTVs with real suspension travel.",
    image: "/images/categories/side-by-sides.webp",
    hue: "#8a5b12",
  },
  {
    slug: "watercraft",
    name: "Watercraft",
    icon: "Waves",
    blurb: "Supercharged and rec-lite PWC for the Biscayne Bay run.",
    image: "/images/categories/watercraft.webp",
    hue: "#0e7c8a",
  },
  {
    slug: "boats",
    name: "Boats",
    icon: "Sailboat",
    blurb: "Center consoles, bay boats and jet boats, rigged and ready.",
    image: "/images/categories/boats.webp",
    hue: "#15557f",
  },
  {
    slug: "golf-carts",
    name: "Golf Carts",
    icon: "Flag",
    blurb: "Street-legal LSVs and lifted carts for club and community.",
    image: "/images/categories/golf-carts.webp",
    hue: "#2f6b3a",
  },
  {
    slug: "scooters",
    name: "Scooters",
    icon: "Zap",
    blurb: "50cc to 560cc commuters that make city miles disappear.",
    image: "/images/categories/scooters.webp",
    hue: "#6b3a86",
  },
  {
    slug: "dirt-bikes",
    name: "Dirt Bikes",
    icon: "Flame",
    blurb: "Motocross, trail and youth bikes from 50cc to 450cc.",
    image: "/images/categories/dirt-bikes.webp",
    hue: "#a3141f",
  },
  {
    slug: "generators",
    name: "Generators",
    icon: "BatteryCharging",
    blurb: "Inverter and standby power that runs through hurricane season.",
    image: "/images/categories/generators.webp",
    hue: "#41505f",
  },
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

export function categoryName(slug: string) {
  return categoryBySlug.get(slug as CategorySlug)?.name ?? slug;
}
