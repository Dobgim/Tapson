import type { Metadata } from "next";
import { ClipboardCheck, HandCoins, PhoneCall, Signature } from "lucide-react";
import { BreadcrumbSchema, PageHero } from "@/components/PageHero";
import { FinancingForm } from "@/components/forms/FinancingForm";
import { PaymentCalculator } from "@/components/PaymentCalculator";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ButtonLink, SlideArrow } from "@/components/ui/Button";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Powersports Financing",
  description:
    "Apply for motorcycle, ATV, UTV, watercraft and boat financing at Repossessed Rides. Multiple lenders, terms to 84 months, approvals across the credit spectrum.",
  alternates: { canonical: "/financing" },
};

const crumbs = [{ label: "Financing" }];

const steps = [
  { Icon: ClipboardCheck, title: "Tell us the basics", body: "Four minutes, no social security number, no credit inquiry." },
  { Icon: PhoneCall, title: "We shop your file", body: "A finance manager takes your profile to our panel of powersports lenders." },
  { Icon: HandCoins, title: "You pick the terms", body: "We come back with real offers so you can weigh rate against term." },
  { Icon: Signature, title: "Sign and ride", body: "Paperwork happens at the store, usually in under half an hour." },
];

const faqs = [
  {
    q: "Will applying hurt my credit score?",
    a: "Starting a conversation here does not. We only run credit once you tell us to, and when we do it's a single submission to multiple lenders inside a short window, which the scoring models treat as one inquiry.",
  },
  {
    q: "What credit score do I need?",
    a: "There isn't a single cutoff. We place deals across the spectrum, including first-time buyers and rebuilding credit. The score affects your rate and the down payment we'll need, not whether we'll talk to you.",
  },
  {
    q: "Can I roll my trade-in into the deal?",
    a: "Yes, and it's usually the cleanest way to do it. We appraise the trade, pay off any outstanding finance directly, and apply the equity to your new unit.",
  },
  {
    q: "Do you finance pre-owned units?",
    a: "We do, on both units we sell and comparable machines. Terms on used inventory are typically a little shorter than new.",
  },
];

export default function FinancingPage() {
  return (
    <>
      <PageHero
        eyebrow="Financing"
        title="Make your next ride a reality"
        body="We're not tied to one bank. Your file goes to a panel of powersports lenders and we bring back whoever competes hardest for it."
        image="/images/dealership/finance.webp"
        crumbs={crumbs}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#apply" size="lg">
            Apply now
            <SlideArrow />
          </ButtonLink>
          <ButtonLink href="#calculator" variant="light" size="lg">
            Payment calculator
          </ButtonLink>
        </div>
      </PageHero>

      <section className="bg-white py-16 lg:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="How it works"
            title="Four steps, most of them ours"
            body="You do about four minutes of work. We do the rest."
            align="center"
          />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" step={0.08}>
            {steps.map((step, i) => (
              <StaggerItem key={step.title}>
                <div className="relative h-full rounded-2xl border border-ink-200 bg-white p-6">
                  <span className="absolute right-5 top-5 font-display text-4xl font-extrabold text-ink-100">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink-900 text-white">
                    <step.Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-base font-extrabold uppercase tracking-tight text-ink-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="calculator" className="bg-ink-50 py-16 lg:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="Payment calculator"
            title="Run the numbers yourself"
            body="Drag the sliders. Every figure updates live, including total interest — the number most calculators quietly hide."
          />
          <Reveal delay={0.1} className="mt-10">
            <PaymentCalculator initialPrice={15000} />
          </Reveal>
        </div>
      </section>

      <section id="apply" className="bg-white py-16 lg:py-24">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="min-w-0 lg:col-span-5">
            <p className="eyebrow mb-3 text-accent-500">Get started</p>
            <h2 className="display-lg text-ink-900">Start your application</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              This form starts a conversation — it is not a credit application and it will not
              trigger an inquiry. A finance manager reads it, calls you, and takes it from there.
            </p>

            <dl className="mt-8 space-y-5">
              {faqs.map((faq) => (
                <div key={faq.q} className="border-l-2 border-accent-500 pl-5">
                  <dt className="font-display text-sm font-bold uppercase tracking-wide text-ink-900">
                    {faq.q}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-ink-500">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.12} direction="left" className="min-w-0 lg:col-span-7">
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-lift sm:p-9">
              <FinancingForm />
            </div>
          </Reveal>
        </div>
      </section>

      <BreadcrumbSchema crumbs={crumbs} baseUrl={site.url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </>
  );
}
