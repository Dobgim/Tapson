/**
 * Single source of truth for dealership identity, navigation and locations.
 * Everything the chrome renders reads from here so a CMS/admin can replace it
 * with a fetch without touching a component.
 */

export const site = {
  name: "Repossessed Rides",
  shortName: "Repossessed Rides",
  tagline: "Vermont's Powersports & Marine Superstore",
  description:
    "Motorcycles, ATVs, side-by-sides, watercraft, boats and golf carts from Yamaha, Suzuki, Polaris, Can-Am, Sea-Doo and CFMOTO. Sales, service, parts and financing in Burlington, Vermont.",
  // Every canonical tag, Open Graph URL, sitemap entry and JSON-LD @id is
  // built from this. It must be the live hostname: the apex 308-redirects to
  // www, so www is the canonical one. A wrong value here tells Google the
  // real pages are duplicates of somewhere else, which keeps them out of
  // results entirely.
  url: "https://www.repossessedrides.com",
  email: "repossessedride@gmail.com",
  phone: "(802) 343-2491",
  phoneHref: "tel:+18023432491",
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
  },
} as const;

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = {
  label: string;
  href: string;
  /** Rendered as a mega-menu / dropdown when present. */
  columns?: { heading: string; links: NavLink[] }[];
  featured?: { heading: string; body: string; href: string; cta: string };
};

export const primaryNav: NavItem[] = [
  {
    label: "Inventory",
    href: "/inventory",
    columns: [
      {
        heading: "Shop By Condition",
        links: [
          { label: "All Inventory", href: "/inventory" },
          { label: "New Inventory", href: "/inventory?condition=New" },
          { label: "Pre-Owned Inventory", href: "/inventory?condition=Pre-Owned" },
          { label: "Manager's Specials", href: "/specials" },
        ],
      },
      {
        heading: "Shop By Category",
        links: [
          { label: "Motorcycles", href: "/inventory?category=motorcycles" },
          { label: "ATVs", href: "/inventory?category=atvs" },
          { label: "Side-by-Sides", href: "/inventory?category=side-by-sides" },
          { label: "Watercraft", href: "/inventory?category=watercraft" },
          { label: "Boats", href: "/inventory?category=boats" },
        ],
      },
      {
        heading: "More Categories",
        links: [
          { label: "Golf Carts", href: "/inventory?category=golf-carts" },
          { label: "Scooters", href: "/inventory?category=scooters" },
          { label: "Dirt Bikes", href: "/inventory?category=dirt-bikes" },
          { label: "Generators", href: "/inventory?category=generators" },
          { label: "Shop All Brands", href: "/inventory" },
        ],
      },
    ],
    featured: {
      heading: "Manager's Specials",
      body: "Factory rebates, freight-included pricing and payments from $89/mo on select units.",
      href: "/specials",
      cta: "View the specials",
    },
  },
  {
    label: "Services",
    href: "/service",
    columns: [
      {
        heading: "Departments",
        links: [
          { label: "Service Center", href: "/service" },
          { label: "Schedule Service", href: "/service#schedule" },
          { label: "Parts & Accessories", href: "/parts" },
          { label: "Order Parts", href: "/parts#order" },
        ],
      },
      {
        heading: "Buying & Selling",
        links: [
          { label: "Apply for Financing", href: "/financing" },
          { label: "Payment Calculator", href: "/financing#calculator" },
          { label: "Value My Trade", href: "/trade-in" },
          { label: "Schedule a Test Ride", href: "/contact?topic=test-ride" },
        ],
      },
    ],
    featured: {
      heading: "Factory-certified techs",
      body: "Yamaha, Sea-Doo, Can-Am and Polaris certified service for every unit we sell.",
      href: "/service",
      cta: "Book the shop",
    },
  },
  { label: "Financing", href: "/financing" },
  { label: "Parts", href: "/parts" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
];

export type Location = {
  id: string;
  name: string;
  city: string;
  street: string;
  region: string;
  postalCode: string;
  phone: string;
  phoneHref: string;
  email: string;
  geo: { lat: number; lng: number };
  hours: { days: string; open: string }[];
  specialties: string[];
  mapQuery: string;
};

export const locations: Location[] = [
  {
    id: "burlington",
    name: "Repossessed Rides Burlington",
    city: "Burlington",
    street: "219 Intervale Ave",
    region: "VT",
    postalCode: "05401",
    phone: "(802) 343-2491",
    phoneHref: "tel:+18023432491",
    email: "repossessedride@gmail.com",
    // Approximate — replace with surveyed coordinates before launch.
    geo: { lat: 44.4869, lng: -73.2093 },
    hours: [
      { days: "Monday – Friday", open: "9:00 AM – 6:00 PM" },
      { days: "Saturday", open: "9:00 AM – 5:00 PM" },
      { days: "Sunday", open: "Closed" },
    ],
    specialties: ["Motorcycles", "ATVs & UTVs", "Watercraft", "Golf Carts"],
    mapQuery: "219 Intervale Ave, Burlington, VT 05401",
  },
];

export const footerColumns: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Inventory",
    links: [
      { label: "All Inventory", href: "/inventory" },
      { label: "New Units", href: "/inventory?condition=New" },
      { label: "Pre-Owned Units", href: "/inventory?condition=Pre-Owned" },
      { label: "Manager's Specials", href: "/specials" },
      { label: "Motorcycles", href: "/inventory?category=motorcycles" },
      { label: "Watercraft", href: "/inventory?category=watercraft" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Service Center", href: "/service" },
      { label: "Schedule Service", href: "/service#schedule" },
      { label: "Parts & Accessories", href: "/parts" },
      { label: "Apply for Financing", href: "/financing" },
      { label: "Payment Calculator", href: "/financing#calculator" },
      { label: "Value My Trade", href: "/trade-in" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Locations & Hours", href: "/locations" },
      { label: "Contact Us", href: "/contact" },
      { label: "Careers", href: "/about#careers" },
      { label: "Reviews", href: "/about#reviews" },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/contact" },
  { label: "Terms of Use", href: "/contact" },
  { label: "Accessibility", href: "/contact" },
  { label: "Image Credits", href: "/credits" },
  { label: "Sitemap", href: "/inventory" },
];

/** Builds a keyless Google Maps embed URL for a location. */
export function mapEmbedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function directionsUrl(query: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}
