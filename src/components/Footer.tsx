import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { NewsletterForm } from "./forms/NewsletterForm";
import { footerColumns, legalLinks, locations, site } from "@/data/site";

const socials = [
  { label: "Facebook", href: site.social.facebook, Icon: Facebook },
  { label: "Instagram", href: site.social.instagram, Icon: Instagram },
  { label: "YouTube", href: site.social.youtube, Icon: Youtube },
];

export function Footer() {
  return (
    <footer className="bg-ink-950 text-white">
      <div className="shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="min-w-0 lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
            A Burlington, Vermont store selling and servicing motorcycles, ATVs, side-by-sides,
            watercraft, boats and golf carts. Factory-certified techs, in-house financing and a
            parts counter that actually stocks what you need.
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            <li>
              <a href={site.phoneHref} className="flex items-center gap-3 text-white/70 transition-colors hover:text-white">
                <Phone className="h-4 w-4 text-accent-400" aria-hidden="true" />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-white/70 transition-colors hover:text-white">
                <Mail className="h-4 w-4 text-accent-400" aria-hidden="true" />
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-3 text-white/70">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
              <span>
                {locations[0].street}, {locations[0].city}, {locations[0].region} {locations[0].postalCode}
              </span>
            </li>
          </ul>

          <div className="mt-7 flex gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-400 hover:bg-accent-500 hover:text-white"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {footerColumns.map((col) => (
          <nav key={col.heading} aria-label={col.heading} className="min-w-0 lg:col-span-2">
            <p className="eyebrow mb-5 text-accent-400">{col.heading}</p>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="min-w-0 md:col-span-2 lg:col-span-2">
          <p className="eyebrow mb-5 text-accent-400">Stay in the loop</p>
          <p className="mb-4 text-sm text-white/55">
            New arrivals, factory rebates and event invites. No more than twice a month.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-4 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="shell pb-8">
          <p className="max-w-4xl text-[0.6875rem] leading-relaxed text-white/30">
            Pricing shown excludes tax, title, registration, freight and dealer preparation unless
            stated otherwise. Monthly payment estimates are illustrations only, based on a 10% down
            payment at {""}
            8.99% APR over 60 months with approved credit, and are not an offer of financing.
            Specifications and availability are subject to change. This site is a design and
            engineering demonstration.
          </p>
        </div>
      </div>
    </footer>
  );
}
