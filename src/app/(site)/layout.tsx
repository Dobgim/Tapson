import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/PageLoader";
import { locations, site } from "@/data/site";
import { reviewSchema } from "@/data/reviews";

/** Organization + per-store LocalBusiness graph, emitted once site-wide. */
function OrganizationSchema() {
  // Null while every review is still a placeholder, so no rating markup is
  // published until there is something genuine behind it.
  const ratings = reviewSchema();

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
        ...(ratings ?? {}),
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

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}
