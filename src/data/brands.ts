export type Brand = {
  slug: string;
  name: string;
  /** Line the brand is best known for at our stores. */
  known: string;
  /** Short list of categories, shown on the tile in the brand's own grid. */
  lines: string[];
  image: string;
};

/**
 * Brand names are used nominatively to describe the lines we carry. The marks
 * rendered on the site are plain typographic wordmarks we author ourselves --
 * no manufacturer logo artwork is reproduced.
 */
export const brands: Brand[] = [
  { slug: "yamaha", name: "Yamaha", known: "Motorcycles · WaveRunners · Outboards", lines: ["Motorcycles", "WaveRunners", "Outboards"], image: "/images/brands/yamaha.webp" },
  { slug: "suzuki", name: "Suzuki", known: "Sportbikes · ATVs · Outboards", lines: ["Sportbikes", "ATVs", "Outboards"], image: "/images/brands/suzuki.webp" },
  { slug: "polaris", name: "Polaris", known: "RANGER · RZR · Sportsman", lines: ["ATV", "UTVs", "Power Generators"], image: "/images/brands/polaris.webp" },
  { slug: "can-am", name: "Can-Am", known: "Maverick · Outlander · Ryker", lines: ["Maverick", "Outlander", "Ryker"], image: "/images/brands/can-am.webp" },
  { slug: "sea-doo", name: "Sea-Doo", known: "Personal Watercraft · Pontoon", lines: ["Personal Watercraft", "Pontoon"], image: "/images/brands/sea-doo.webp" },
  { slug: "cfmoto", name: "CFMOTO", known: "UFORCE · ZFORCE · CFORCE", lines: ["UFORCE", "ZFORCE", "CFORCE"], image: "/images/brands/cfmoto.webp" },
  { slug: "kawasaki", name: "Kawasaki", known: "Ninja · Jet Ski · Mule", lines: ["Ninja", "Jet Ski", "Mule"], image: "/images/brands/kawasaki.webp" },
  { slug: "indian", name: "Indian", known: "Chief · Scout · Challenger", lines: ["Chief", "Scout", "Challenger"], image: "/images/brands/indian.webp" },
  { slug: "ez-go", name: "E-Z-GO", known: "Golf Carts · LSV", lines: ["Golf Carts", "LSV"], image: "/images/brands/ez-go.webp" },
  { slug: "honda", name: "Honda", known: "Generators · Pioneer · Rebel", lines: ["Generators", "Pioneer", "Rebel"], image: "/images/brands/honda.webp" },
];
