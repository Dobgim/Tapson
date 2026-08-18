import { MapPin, Phone, Mail } from "lucide-react";
import { locations } from "@/data/site";
import { listProducts } from "@/lib/admin/store";
import { PageHeader, Card, currency } from "@/components/admin/ui";

export const metadata = { title: "Locations" };

export default async function AdminLocationsPage() {
  const products = await listProducts();

  return (
    <>
      <PageHeader
        title="Locations"
        description="Stores, contact details and how stock is spread across them."
      />

      <div className="grid gap-4 px-5 py-6 sm:px-8 lg:grid-cols-3">
        {locations.map((loc) => {
          const stock = products.filter((p) => p.locationId === loc.id);
          const value = stock.reduce((sum, p) => sum + p.price, 0);

          return (
            <Card key={loc.id} className="flex flex-col p-5">
              <h2 className="font-display text-base font-extrabold uppercase tracking-[-0.01em] text-ink-900">
                {loc.name}
              </h2>

              <ul className="mt-3 space-y-2 text-sm text-ink-600">
                <li className="flex items-start gap-2">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-400" />
                  <span>
                    {loc.street}
                    <br />
                    {loc.city}, {loc.region} {loc.postalCode}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone aria-hidden className="size-4 shrink-0 text-ink-400" />
                  <a href={loc.phoneHref} className="transition-colors hover:text-accent-500">
                    {loc.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail aria-hidden className="size-4 shrink-0 text-ink-400" />
                  <a
                    href={`mailto:${loc.email}`}
                    className="truncate transition-colors hover:text-accent-500"
                  >
                    {loc.email}
                  </a>
                </li>
              </ul>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-100 pt-4">
                <div>
                  <p className="font-display text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-ink-400">
                    Units
                  </p>
                  <p className="mt-0.5 font-display text-xl font-extrabold text-ink-900">
                    {stock.length}
                  </p>
                </div>
                <div>
                  <p className="font-display text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-ink-400">
                    Value
                  </p>
                  <p className="mt-0.5 font-display text-xl font-extrabold text-ink-900">
                    {currency(value)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {loc.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-ink-100 px-2.5 py-1 text-[0.6875rem] text-ink-600"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      <p className="px-5 pb-8 text-xs text-ink-400 sm:px-8">
        Store records are read from <code>src/data/site.ts</code>. Editing them moves into this
        screen once the Supabase <code>locations</code> table is connected.
      </p>
    </>
  );
}
