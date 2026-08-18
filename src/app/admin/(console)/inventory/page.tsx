import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { listProducts } from "@/lib/admin/store";
import { categories } from "@/data/categories";
import { locations } from "@/data/site";
import { PageHeader, Card, Badge, currency, EmptyState } from "@/components/admin/ui";
import { DeleteUnitButton } from "@/components/admin/DeleteUnitButton";
import { InventoryFilters } from "@/components/admin/InventoryFilters";

export const metadata = { title: "Inventory" };

type Search = { q?: string; category?: string; condition?: string };

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { q = "", category = "", condition = "" } = await searchParams;
  const all = await listProducts();

  const needle = q.trim().toLowerCase();
  const rows = all.filter((p) => {
    if (category && p.category !== category) return false;
    if (condition && p.condition !== condition) return false;
    if (!needle) return true;
    return `${p.title} ${p.stockNumber} ${p.color}`.toLowerCase().includes(needle);
  });

  const locationName = (id: string) => locations.find((l) => l.id === id)?.city ?? id;
  const categoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <>
      <PageHeader
        title="Inventory"
        description={`${all.length} units on the floor.`}
        action={{ label: "Add unit", href: "/admin/inventory/new" }}
      />

      <div className="space-y-4 px-5 py-6 sm:px-8">
        <InventoryFilters q={q} category={category} condition={condition} />

        <Card className="overflow-hidden">
          {rows.length === 0 ? (
            <EmptyState
              title="Nothing matches"
              body="Try a different search term or clear the filters."
            />
          ) : (
            <>
              {/* ------------------------------------------- table -------- */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-ink-200 bg-ink-50">
                    <tr className="font-display text-[0.625rem] uppercase tracking-[0.14em] text-ink-400">
                      <th className="px-4 py-3 font-bold">Unit</th>
                      <th className="px-4 py-3 font-bold">Category</th>
                      <th className="px-4 py-3 font-bold">Condition</th>
                      <th className="px-4 py-3 font-bold">Store</th>
                      <th className="px-4 py-3 text-right font-bold">Price</th>
                      <th className="px-4 py-3 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {rows.map((p) => (
                      <tr key={p.id} className="transition-colors hover:bg-ink-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-ink-100">
                              <Image src={p.images[0]} alt="" fill sizes="44px" className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-ink-900">{p.title}</p>
                              <p className="truncate text-xs text-ink-400">
                                {p.stockNumber} · {p.color}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-ink-600">{categoryName(p.category)}</td>
                        <td className="px-4 py-3">
                          <Badge tone={p.condition}>{p.condition}</Badge>
                        </td>
                        <td className="px-4 py-3 text-ink-600">{locationName(p.locationId)}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-semibold text-ink-900">{currency(p.price)}</span>
                          {p.savings > 0 && (
                            <span className="block text-xs text-accent-500">
                              −{currency(p.savings)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/inventory/${p.id}`}
                              aria-label={`Edit ${p.title}`}
                              className="rounded-md p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
                            >
                              <Pencil aria-hidden className="size-4" />
                            </Link>
                            <DeleteUnitButton id={p.id} title={p.title} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* -------------------------------------------- cards ------- */}
              <ul className="divide-y divide-ink-100 md:hidden">
                {rows.map((p) => (
                  <li key={p.id} className="flex gap-3 p-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-ink-100">
                      <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">{p.title}</p>
                      <p className="truncate text-xs text-ink-400">
                        {p.stockNumber} · {locationName(p.locationId)}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge tone={p.condition}>{p.condition}</Badge>
                        <span className="text-sm font-semibold text-ink-900">
                          {currency(p.price)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <Link
                          href={`/admin/inventory/${p.id}`}
                          className="rounded-md px-2 py-1 font-display text-[0.625rem] font-bold uppercase tracking-[0.14em] text-accent-500"
                        >
                          Edit
                        </Link>
                        <DeleteUnitButton id={p.id} title={p.title} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <p className="text-xs text-ink-400">
          Showing {rows.length} of {all.length} units.
        </p>
      </div>
    </>
  );
}
