import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/PageLoader";
import { locations, site } from "@/data/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#06080b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "powersports dealer Miami",
    "motorcycles Miami",
    "Sea-Doo dealer Florida",
    "ATV dealer South Florida",
    "boat dealer Key Largo",
    "side by side UTV Miami",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    locale: "en_US",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` },
      { url: "/og-square.png", width: 630, height: 630, alt: site.name },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/** Organization + per-store LocalBusiness graph, emitted once site-wide. */
function OrganizationSchema() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}#organization`,
        name: site.name,
        url: site.url,
        email: site.email,
        telephone: site.phone,
        description: site.description,
        sameAs: Object.values(site.social),
      },
      ...locations.map((loc) => ({
        "@type": "AutomotiveBusiness",
        "@id": `${site.url}/locations#${loc.id}`,
        name: loc.name,
        parentOrganization: { "@id": `${site.url}#organization` },
        telephone: loc.phone,
        email: loc.email,
        url: `${site.url}/locations`,
        address: {
          "@type": "PostalAddress",
          streetAddress: loc.street,
          addressLocality: loc.city,
          addressRegion: loc.region,
          postalCode: loc.postalCode,
          addressCountry: "US",
        },
        geo: { "@type": "GeoCoordinates", latitude: loc.geo.lat, longitude: loc.geo.lng },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Saturday"],
            opens: "09:00",
            closes: "17:00",
          },
        ],
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <PageLoader />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <OrganizationSchema />
      </body>
    </html>
  );
}
