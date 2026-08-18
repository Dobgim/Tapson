import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { ButtonLink } from "./ui/Button";
import { directionsUrl, mapEmbedUrl, type Location } from "@/data/site";

export function LocationCard({ location, showMap = true }: { location: Location; showMap?: boolean }) {
  return (
    <article
      id={location.id}
      className="group/card flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-lift-lg"
    >
      {showMap && (
        <div className="relative h-52 w-full overflow-hidden bg-ink-100">
          <iframe
            src={mapEmbedUrl(location.mapQuery)}
            title={`Map of ${location.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0 grayscale-[0.35] transition-all duration-700 group-hover/card:grayscale-0"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-extrabold uppercase leading-tight tracking-tight text-ink-900">
          {location.name}
        </h3>

        <ul className="mt-4 space-y-3 text-sm">
          <li className="flex items-start gap-3 text-ink-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
            <span>
              {location.street}
              <br />
              {location.city}, {location.region} {location.postalCode}
            </span>
          </li>
          <li>
            <a href={location.phoneHref} className="flex items-center gap-3 text-ink-600 transition-colors hover:text-accent-500">
              <Phone className="h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
              {location.phone}
            </a>
          </li>
          <li className="flex items-start gap-3 text-ink-600">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
            <dl className="space-y-1">
              {location.hours.map((h) => (
                <div key={h.days} className="flex flex-wrap gap-x-2">
                  <dt className="font-medium text-ink-700">{h.days}</dt>
                  <dd className="text-ink-500">{h.open}</dd>
                </div>
              ))}
            </dl>
          </li>
        </ul>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {location.specialties.map((s) => (
            <li
              key={s}
              className="rounded-full bg-ink-50 px-2.5 py-1 text-[0.6875rem] font-medium text-ink-600"
            >
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          <ButtonLink href={directionsUrl(location.mapQuery)} target="_blank" rel="noreferrer noopener" size="sm">
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
            Directions
          </ButtonLink>
          <ButtonLink href={`/contact?store=${location.id}`} variant="outline" size="sm">
            Contact store
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
