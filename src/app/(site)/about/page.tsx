import type { Metadata } from "next";
import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/PageHero";
import { BrandSection } from "@/components/BrandSection";
import { LocationsSection } from "@/components/LocationsSection";
import { SectionHeading } from "@/components/SectionHeading";
import { Counter } from "@/components/motion/Counter";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ButtonLink, SlideArrow } from "@/components/ui/Button";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About Repossessed Rides",
  description:
    "Selling and servicing powersports and marine in Burlington, Vermont. Factory-certified technicians and no commission-driven sales floor.",
  alternates: { canonical: "/about" },
};

const crumbs = [{ label: "About" }];

const stats = [
  { value: 20, suffix: "+", label: "Years in business" },
  { value: 10000, suffix: "+", label: "Units delivered" },
  { value: 9, suffix: "", label: "Departments" },
  { value: 3, suffix: "", label: "Stores" },
];

const timeline = [
  { year: "2005", title: "One store, one department", body: "We opened selling watercraft and outboards out of a single building on Intervale Ave." },
  { year: "2011", title: "The marine department opens", body: "Lake Champlain access turned the marine side from a parts counter into a full department." },
  { year: "2017", title: "Powersports goes wide", body: "Motorcycles, quads and side-by-sides joined the floor as franchised lines rather than trade-ins." },
  { year: "2021", title: "The showroom expands", body: "More floor space let us hold real depth on watercraft and side-by-sides through the season." },
  { year: "Today", title: "One shared inventory", body: "Three stores that operate as a single stock pool, so the right unit is never at the wrong address for long." },
];

const reviews = [
  {
    body: "Bought a Sea-Doo here after two other dealers told me I'd be waiting until next season. Had it on a trailer in four days, rigged, registered and with the first service already booked.",
    name: "Marcus D.",
    detail: "Sea-Doo RXT-X · Burlington",
  },
  {
    body: "The service department is the reason I keep coming back. They found a wiring fault two other shops missed and charged me for one hour of diagnostic time.",
    name: "Priya R.",
    detail: "Service customer · Burlington",
  },
  {
    body: "No pressure, no commission games. The salesman actually talked me out of the bigger machine and into the right one. Second unit I've bought from them.",
    name: "Tony V.",
    detail: "Polaris RANGER · Burlington",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Twenty years of getting people out there"
        body="We're a family-run dealer group, not a chain. The same technicians have been in our shop for a decade and nobody on our floor works a commission ladder."
        image="/images/dealership/showroom.webp"
        crumbs={crumbs}
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="right" blur>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/dealership/showroom.webp"
                alt="Stylised artwork of the Repossessed Rides showroom"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="eyebrow mb-3 text-accent-500">Our story</p>
              <h2 className="display-lg text-ink-900">A dealer built by people who ride</h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-600">
                <p>
                  REPOSSESSED RIDES started because the founders were tired of buying machines from people who
                  didn't use them. Everyone here rides, launches or drives something we sell, which
                  turns out to matter enormously when you're being asked which unit is right.
                </p>
                <p>
                  Twenty years later that hasn't been diluted by scale. We've added stores and
                  departments, but the sales floor still runs without a commission ladder, the shop
                  still refuses to subcontract warranty work, and the parts counter is still
                  measured on whether the part was on the shelf.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-ink-200 pt-8 sm:grid-cols-4">
              {stats.map((stat, i) => (
                <Reveal key={stat.label} delay={0.07 * i}>
                  <p className="font-display text-3xl font-extrabold tracking-tight text-ink-900">
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-xs leading-snug text-ink-500">{stat.label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink-950 py-16 text-white lg:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="How we got here"
            title="Two decades, five turning points"
            tone="light"
          />
          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-5" step={0.08}>
            {timeline.map((item) => (
              <StaggerItem key={item.year} className="bg-ink-950 p-6">
                <p className="font-display text-2xl font-extrabold tracking-tight text-accent-400">
                  {item.year}
                </p>
                <h3 className="mt-3 font-display text-sm font-bold uppercase tracking-wide text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{item.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="reviews" className="bg-ink-50 py-16 lg:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="Reviews"
            title="What customers actually say"
            body="Representative reviews from our stores. We don't filter the bad ones — we just try not to earn them."
          />
          <Stagger className="mt-12 grid gap-5 lg:grid-cols-3" step={0.08}>
            {reviews.map((review) => (
              <StaggerItem key={review.name} className="h-full">
                <figure className="flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-7">
                  <Quote className="h-7 w-7 text-accent-500/25" aria-hidden="true" />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">
                    {review.body}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-ink-100 pt-4">
                    <div className="mb-1.5 flex gap-0.5" aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="font-display text-sm font-bold uppercase tracking-wide text-ink-900">
                      {review.name}
                    </p>
                    <p className="text-xs text-ink-500">{review.detail}</p>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <BrandSection />

      <section id="careers" className="bg-white py-16 lg:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Careers"
            title="We're usually hiring technicians"
            body="If you're factory-trained on any line we carry — or you're a good diagnostic tech who wants to be — we'd rather hear from you before we advertise."
            align="center"
          />
          <Reveal delay={0.1} className="mt-8 flex justify-center">
            <ButtonLink href="/contact?topic=other" size="lg">
              Get in touch
              <SlideArrow />
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <LocationsSection />
      <BreadcrumbSchema crumbs={crumbs} baseUrl={site.url} />
    </>
  );
}
