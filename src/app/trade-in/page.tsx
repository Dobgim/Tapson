import type { Metadata } from "next";
import { Camera, Gauge, HandCoins, Sparkles } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/PageHero";
import { TradeInForm } from "@/components/forms/TradeInForm";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Value My Trade",
  description:
    "Get a real appraisal on your motorcycle, ATV, UTV, watercraft or boat. RIVA Motorsports appraises anything with an engine, whether or not you buy from us.",
  alternates: { canonical: "/trade-in" },
};

const crumbs = [{ label: "Trade-In" }];

const tips = [
  { Icon: Camera, title: "Photograph it honestly", body: "Four or five angles plus the odometer. Damage in the photos means no renegotiation at the counter." },
  { Icon: Gauge, title: "Know the hours or miles", body: "It's the single biggest input on a used powersports valuation — more than cosmetic condition." },
  { Icon: Sparkles, title: "A wash is worth real money", body: "Not a metaphor. A clean, presented unit consistently appraises higher than the same machine dirty." },
  { Icon: HandCoins, title: "Bring the paperwork", body: "Title, service records and a payoff quote if there's outstanding finance. It speeds everything up." },
];

export default function TradeInPage() {
  return (
    <>
      <PageHero
        eyebrow="Trade-in"
        title="What's yours actually worth?"
        body="We appraise anything with an engine — motorcycles, quads, side-by-sides, skis, boats, carts — whether or not you buy the next one from us."
        image="/images/categories/motorcycles.webp"
        crumbs={crumbs}
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-3 text-accent-500">How we value it</p>
            <h2 className="display-lg text-ink-900">A real number, not a range</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              Most sites hand you a $4,000 spread and call it an appraisal. We'd rather look at the
              actual unit and give you one figure we'll stand behind — usually within a few hours of
              your photos landing.
            </p>

            <Stagger className="mt-9 space-y-6" step={0.08}>
              {tips.map((tip) => (
                <StaggerItem key={tip.title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-50 text-accent-500">
                    <tip.Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold uppercase tracking-wide text-ink-900">
                      {tip.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-500">{tip.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <div className="mt-9 rounded-2xl bg-ink-950 p-6 text-white">
              <p className="eyebrow text-accent-400">Outstanding finance?</p>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Not a problem, and not unusual. We pay lenders directly and roll any equity — or any
                shortfall — into the new deal. Bring a payoff quote dated within ten days.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} direction="left" className="lg:col-span-7">
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-lift sm:p-9">
              <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink-900">
                Tell us about your unit
              </h2>
              <p className="mb-6 mt-1.5 text-sm text-ink-500">
                Fields marked <span className="text-accent-500">*</span> are required.
              </p>
              <TradeInForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink-50 py-16 lg:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="After the appraisal"
            title="Trade it, or just sell it to us"
            body="You are under no obligation to buy anything. If the number works and you simply want out of the unit, we'll write the cheque."
            align="center"
            action={{ label: "Browse what's in stock", href: "/inventory" }}
          />
        </div>
      </section>

      <BreadcrumbSchema crumbs={crumbs} baseUrl={site.url} />
    </>
  );
}
