import type { Metadata } from "next";
import { BreadcrumbSchema, PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { photoCredits } from "@/data/credits";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Image Credits",
  description:
    "Attribution for the photography used across this site, including author, licence and source for each image.",
  alternates: { canonical: "/credits" },
};

const crumbs = [{ label: "Image Credits" }];

export default function CreditsPage() {
  return (
    <>
      <PageHero
        eyebrow="Attribution"
        title="Image credits"
        body="Photography on this site is reused under licences that permit commercial use. Each photograph is credited to its author below, with a link to the original and to the licence it is used under."
        image="/images/hero/hero-2.webp"
        crumbs={crumbs}
      />

      <section className="bg-ink-50 py-16 lg:py-24">
        <div className="shell max-w-4xl">
          <Reveal>
            <div className="rounded-2xl border border-ink-200 bg-white p-6 text-sm leading-relaxed text-ink-600 md:p-8">
              <p>
                Photographs are sourced from{" "}
                <a
                  href="https://commons.wikimedia.org/"
                  className="font-semibold text-accent-500 underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikimedia Commons
                </a>
                . They have been cropped and re-encoded for the web, which makes them derivative
                works; where a licence is ShareAlike, that same licence continues to apply to the
                cropped version published here.
              </p>
              <p className="mt-4">
                Brand names and manufacturer marks referenced on this site remain the property of
                their respective owners and are used for identification only. Vehicle listings and
                dealership statistics shown here are illustrative sample data.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="mt-8 divide-y divide-ink-200 overflow-hidden rounded-2xl border border-ink-200 bg-white">
              {photoCredits.map((credit) => (
                <li
                  key={credit.key}
                  className="flex flex-col gap-1 p-4 text-sm md:flex-row md:items-baseline md:justify-between md:gap-6 md:p-5"
                >
                  <div className="min-w-0">
                    <a
                      href={credit.sourceUrl}
                      className="font-semibold text-ink-900 underline-offset-4 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {credit.title}
                    </a>
                    <p className="mt-0.5 text-ink-500">by {credit.author}</p>
                  </div>
                  <div className="shrink-0 text-ink-500 md:text-right">
                    {credit.licenceUrl ? (
                      <a
                        href={credit.licenceUrl}
                        className="underline underline-offset-4 hover:text-accent-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {credit.licence}
                      </a>
                    ) : (
                      credit.licence
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <p className="mt-6 text-xs text-ink-500">
            {photoCredits.length} photographs credited.
          </p>
        </div>
      </section>

      <BreadcrumbSchema crumbs={crumbs} baseUrl={site.url} />
    </>
  );
}
