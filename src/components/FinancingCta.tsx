import Image from "next/image";
import { Check } from "lucide-react";
import { Reveal } from "./motion/Reveal";
import { ButtonLink, SlideArrow } from "./ui/Button";

const points = [
  "Approvals across the full credit spectrum",
  "Terms from 24 to 84 months",
  "Multiple lenders competing for your business",
  "No credit inquiry to get a conversation started",
];

export function FinancingCta() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 py-20 text-white lg:py-28">
      <Image
        src="/images/dealership/finance.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(6,8,11,0.96)_25%,rgba(6,8,11,0.6)_70%,rgba(6,8,11,0.35)_100%)]"
      />

      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-6">
          <Reveal>
            <p className="eyebrow mb-3 text-accent-400">Financing</p>
            <h2 className="display-lg text-white">
              Make your next ride <span className="text-accent-400">a reality</span>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60">
              We work with a panel of powersports lenders rather than a single bank, which is why we
              get approvals other dealers can't. Start here and a finance manager picks it up the
              same day.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <ul className="mt-8 space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-white/75">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-500">
                    <Check className="h-3 w-3 text-white" aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2} className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/financing#apply" size="lg">
              Apply now
              <SlideArrow />
            </ButtonLink>
            <ButtonLink href="/financing#calculator" variant="light" size="lg">
              Payment calculator
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal delay={0.15} direction="left" className="min-w-0 lg:col-span-6">
          <div className="rounded-2xl border border-white/12 bg-white/5 p-7 backdrop-blur-sm sm:p-9">
            <p className="eyebrow text-white/45">What a typical deal looks like</p>
            <div className="mt-6 space-y-5">
              {[
                { label: "2025 Yamaha MT-09 SP", price: "$11,799", monthly: "$220/mo" },
                { label: "2025 Sea-Doo RXT-X 325", price: "$20,399", monthly: "$381/mo" },
                { label: "2025 Polaris RANGER 1000", price: "$18,999", monthly: "$355/mo" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-white">{row.label}</p>
                    <p className="text-xs text-white/45">{row.price} · 10% down · 60 months</p>
                  </div>
                  <p className="shrink-0 font-display text-lg font-extrabold text-accent-400">{row.monthly}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[0.625rem] leading-relaxed text-white/35">
              Illustrations at 8.99% APR with approved credit. Not an offer of credit. Your rate
              depends on term, credit profile and the lender you're matched with.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
