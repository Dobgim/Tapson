import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { ContactForm } from "./forms/ContactForm";
import { Reveal } from "./motion/Reveal";
import { locations, mapEmbedUrl, site } from "@/data/site";

const socials = [
  { label: "Facebook", href: site.social.facebook, Icon: Facebook },
  { label: "Instagram", href: site.social.instagram, Icon: Instagram },
  { label: "YouTube", href: site.social.youtube, Icon: Youtube },
];

export function ContactSection({
  defaultTopic = "sales",
  withMap = true,
}: {
  defaultTopic?: string;
  withMap?: boolean;
}) {
  const main = locations[0];

  return (
    <section className="bg-ink-50 py-20 lg:py-28" aria-labelledby="contact-heading">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow mb-3 text-accent-500">Get in touch</p>
          <h2 id="contact-heading" className="display-lg text-ink-900">
            Talk to a human
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-500">
            Call, email or send the form. Whichever you pick, someone who actually works on the
            floor will answer — usually within a business day.
          </p>

          <ul className="mt-8 space-y-5">
            <li>
              <a href={site.phoneHref} className="group/row flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-accent-500 shadow-sm transition-colors duration-300 group-hover/row:bg-accent-500 group-hover/row:text-white">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wide text-ink-400">Phone</span>
                  <span className="block text-base font-semibold text-ink-900">{site.phone}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="group/row flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-accent-500 shadow-sm transition-colors duration-300 group-hover/row:bg-accent-500 group-hover/row:text-white">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wide text-ink-400">Email</span>
                  <span className="block text-base font-semibold text-ink-900">{site.email}</span>
                </span>
              </a>
            </li>
            <li className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-accent-500 shadow-sm">
                <MapPin className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-ink-400">Main store</span>
                <span className="block text-base font-semibold text-ink-900">
                  {main.street}, {main.city}, {main.region} {main.postalCode}
                </span>
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-accent-500 shadow-sm">
                <Clock className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-ink-400">Hours</span>
                <dl className="mt-1 space-y-0.5 text-sm">
                  {main.hours.map((h) => (
                    <div key={h.days} className="flex flex-wrap gap-x-2">
                      <dt className="font-medium text-ink-700">{h.days}</dt>
                      <dd className="text-ink-500">{h.open}</dd>
                    </div>
                  ))}
                </dl>
              </span>
            </li>
          </ul>

          <div className="mt-8 flex gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full border border-ink-200 bg-white text-ink-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-500 hover:bg-accent-500 hover:text-white"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>

          {withMap && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-ink-200">
              <iframe
                src={mapEmbedUrl(main.mapQuery)}
                title={`Map of ${main.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full border-0"
              />
            </div>
          )}
        </Reveal>

        <Reveal delay={0.12} direction="left" className="lg:col-span-7">
          <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-lift sm:p-9">
            <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink-900">
              Send us a message
            </h3>
            <p className="mt-1.5 mb-6 text-sm text-ink-500">
              Fields marked <span className="text-accent-500">*</span> are required.
            </p>
            <ContactForm defaultTopic={defaultTopic} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
