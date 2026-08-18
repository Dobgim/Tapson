/**
 * Single source of truth for dealership identity, navigation and locations.
 * Everything the chrome renders reads from here so a CMS/admin can replace it
 * with a fetch without touching a component.
 */

export const site = {
  name: "Repossessed Rides",
  shortName: "Repossessed Rides",
  tagline: "South Florida's Powersports & Marine Superstore",
  description:
    "Motorcycles, ATVs, side-by-sides, watercraft, boats and golf carts from Yamaha, Suzuki, Polaris, Can-Am, Sea-Doo and CFMOTO. Sales, service, parts and financing across South Florida.",
  url: "https://repossessed-rides.example.com",
  email: "sales@repossessedrides.example.com",
  phone: "(305) 555-0142",
  phoneHref: "tel:+13055550142",
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
    id: "miami",
    name: "Repossessed Rides Miami",
    city: "Miami",
    street: "8420 Palm Trail",
    region: "FL",
    postalCode: "33170",
    phone: "(305) 555-0142",
    phoneHref: "tel:+13055550142",
    email: "sales@repossessedrides.example.com",
    geo: { lat: 25.5271, lng: -80.3931 },
    hours: [
      { days: "Monday – Friday", open: "9:00 AM – 6:00 PM" },
      { days: "Saturday", open: "9:00 AM – 5:00 PM" },
      { days: "Sunday", open: "Closed" },
    ],
    specialties: ["Motorcycles", "ATVs & UTVs", "Watercraft", "Golf Carts"],
    mapQuery: "Miami, FL 33170",
  },
  {
    id: "key-largo",
    name: "Repossessed Rides Marine of the Keys",
    city: "Key Largo",
    street: "215 Coral Point Way",
    region: "FL",
    postalCode: "33037",
    phone: "(305) 555-0178",
    phoneHref: "tel:+13055550178",
    email: "keys@repossessedrides.example.com",
    geo: { lat: 25.1224, lng: -80.4128 },
    hours: [
      { days: "Monday – Friday", open: "9:00 AM – 6:00 PM" },
      { days: "Saturday", open: "9:00 AM – 5:00 PM" },
      { days: "Sunday", open: "Closed" },
    ],
    specialties: ["Boats", "Outboards", "Watercraft", "Marine Service"],
    mapQuery: "Key Largo, FL 33037",
  },
  {
    id: "pompano",
    name: "Repossessed Rides Pompano Beach",
    city: "Pompano Beach",
    street: "640 Marina Vista Blvd",
    region: "FL",
    postalCode: "33062",
    phone: "(954) 555-0116",
    phoneHref: "tel:+19545550116",
    email: "pompano@repossessedrides.example.com",
    geo: { lat: 26.2504, lng: -80.1187 },
    hours: [
      { days: "Monday – Friday", open: "9:00 AM – 6:00 PM" },
      { days: "Saturday", open: "9:00 AM – 4:00 PM" },
      { days: "Sunday", open: "Closed" },
    ],
    specialties: ["Watercraft", "Side-by-Sides", "Scooters", "Parts"],
    mapQuery: "Pompano Beach, FL 33062",
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
