import Link from "next/link";
import {
  CalendarCheck,
  CircleDollarSign,
  MessageSquare,
  PackageSearch,
  Repeat2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Stagger, StaggerItem } from "./motion/Reveal";
import { SlideArrow } from "./ui/Button";

type Service = {
  title: string;
  body: string;
  href: string;
  cta: string;
  Icon: LucideIcon;
  wide?: boolean;
};

const services: Service[] = [
  {
    title: "Service centre",
    body: "Factory-certified technicians across Yamaha, Sea-Doo, Can-Am and Polaris. Diagnostics, maintenance, repowers and warranty work — all under our own roof, with loaner units for major jobs.",
    href: "/service",
    cta: "See the shop",
    Icon: Wrench,
    wide: true,
  },
  {
    title: "Parts & accessories",
    body: "OEM parts and a genuinely stocked accessory wall. If it isn't on the shelf we'll have it in days, not weeks.",
    href: "/parts",
    cta: "Parts counter",
    Icon: PackageSearch,
  },
  {
    title: "Financing",
    body: "Multiple lenders, terms to 84 months, and approvals across the credit spectrum. Apply in about four minutes.",
    href: "/financing",
    cta: "Apply now",
    Icon: CircleDollarSign,
  },
  {
    title: "Trade-in",
    body: "Bring the old one in. We appraise anything with an engine, whether or not you buy from us.",
    href: "/trade-in",
    cta: "Value my trade",
    Icon: Repeat2,
  },
  {
    title: "Schedule service",
    body: "Pick your store, pick your date. We confirm the slot by phone the same day.",
    href: "/service#schedule",
    cta: "Book a slot",
    Icon: CalendarCheck,
  },
  {
    title: "Talk to the dealer",
    body: "Questions about a unit, a quote or an order? A real person answers.",
    href: "/contact",
    cta: "Contact us",
    Icon: MessageSquare,
  },
];

export function Services() {
  return (
    <section className="bg-ink-50 py-20 lg:py-28" aria-labelledby="services-heading">
      <div className="shell">
        <SectionHeading
          id="services-heading"
          eyebrow="Departments"
          title="We don't stop at the sale"
          body="The reason people come back isn't the price on the sticker — it's what happens in the eighteen months after."
        />

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={0.06}>
          {services.map((service) => (
            <StaggerItem key={service.title} className={service.wide ? "sm:col-span-2" : undefined}>
              <Link
                href={service.href}
                className="group/card flex h-full flex-col justify-between gap-8 rounded-2xl border border-ink-200 bg-white p-7 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-ink-300 hover:shadow-lift-lg"
              >
                <div>
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink-900 text-white transition-colors duration-500 group-hover/card:bg-accent-500">
                    <service.Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-extrabold uppercase tracking-tight text-ink-900">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{service.body}</p>
                </div>
                <span className="inline-flex items-center gap-2 font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-accent-500">
                  {service.cta}
                  <SlideArrow />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
