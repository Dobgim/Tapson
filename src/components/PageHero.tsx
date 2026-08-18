import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "./motion/Reveal";

export type Crumb = { label: string; href?: string };

export function PageHero({
  eyebrow,
  title,
  body,
  image = "/images/hero/hero-1.webp",
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  image?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 pb-14 pt-16 text-white sm:pb-20 sm:pt-24">
      <Image src={image} alt="" fill sizes="100vw" priority className="-z-10 object-cover opacity-45" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(6,8,11,0.97)_10%,rgba(6,8,11,0.75)_55%,rgba(6,8,11,0.6)_100%)]"
      />

      <div className="shell">
        {crumbs.length > 0 && (
          <Reveal duration={0.5}>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1 text-xs text-white/45">
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                {crumbs.map((crumb) => (
                  <li key={crumb.label} className="flex items-center gap-1">
                    <ChevronRight className="h-3 w-3 text-white/25" aria-hidden="true" />
                    {crumb.href ? (
                      <Link href={crumb.href} className="transition-colors hover:text-white">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-white/80" aria-current="page">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        )}

        <Reveal delay={0.06} className="mt-6 max-w-3xl">
          {eyebrow && <p className="eyebrow mb-3 text-accent-400">{eyebrow}</p>}
          <h1 className="display-lg text-white">{title}</h1>
          {body && <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">{body}</p>}
        </Reveal>

        {children && (
          <Reveal delay={0.14} className="mt-8">
            {children}
          </Reveal>
        )}
      </div>
    </section>
  );
}

/** BreadcrumbList JSON-LD to pair with the visual trail above. */
export function BreadcrumbSchema({ crumbs, baseUrl }: { crumbs: Crumb[]; baseUrl: string }) {
  const items = [{ label: "Home", href: "/" }, ...crumbs];
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${baseUrl}${c.href}` } : {}),
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
