import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { overview, listLeads, listProducts } from "@/lib/admin/store";
import { categories } from "@/data/categories";
import { PageHeader, Card, StatTile, Badge, currency, EmptyState } from "@/components/admin/ui";

export const metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  const [stats, leads, products] = await Promise.all([overview(), listLeads(), listProducts()]);
  const recentLeads = leads.slice(0, 5);
  const specials = products.filter((p) => p.special).slice(0, 4);
  const categoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;
  const maxCount = Math.max(...stats.byCategory.map((c) => c.count), 1);

  return (
    <>
      <PageHeader
        title="Overview"
        description="Inventory position and enquiry flow at a glance."
        action={{ label: "Add unit", href: "/admin/inventory/new" }}
      />

      <div className="space-y-6 px-5 py-6 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile
            label="Units in stock"
            value={String(stats.totalUnits)}
            hint={`${stats.newUnits} new · ${stats.usedUnits} pre-owned`}
          />
          <StatTile
            label="Inventory value"
            value={currency(stats.inventoryValue)}
            hint={`${currency(stats.averagePrice)} average`}
          />
          <StatTile
            label="Open enquiries"
            value={String(stats.newLeads)}
            hint={`${stats.totalLeads} total received`}
          />
          <StatTile
            label="On special"
            value={String(stats.onSpecial)}
            hint="Discounted from MSRP"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* ------------------------------------------- recent leads ----- */}
          <Card>
            <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
              <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.08em] text-ink-900">
                Latest enquiries
              </h2>
              <Link
                href="/admin/leads"
                className="group inline-flex items-center gap-1 font-display text-[0.625rem] font-bold uppercase tracking-[0.16em] text-accent-500 transition-colors hover:text-accent-600"
              >
                View all
                <ArrowUpRight
                  aria-hidden
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <EmptyState
                title="No enquiries yet"
                body="Submissions from the storefront forms land here."
              />
            ) : (
              <ul className="divide-y divide-ink-100">
                {recentLeads.map((lead) => (
                  <li key={lead.id} className="flex items-start gap-3 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-ink-900">{lead.name}</p>
                        <Badge tone={lead.status}>{lead.status}</Badge>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-ink-400">
                        {lead.kind.replace(/-/g, " ")} · {lead.email}
                      </p>
                      <p className="mt-1 line-clamp-1 text-xs text-ink-500">{lead.message}</p>
                    </div>
                    <time
                      dateTime={lead.createdAt}
                      className="shrink-0 text-[0.6875rem] text-ink-400"
                    >
                      {new Date(lead.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* --------------------------------------------- mix ------------ */}
          <Card>
            <div className="border-b border-ink-200 px-5 py-4">
              <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.08em] text-ink-900">
                Stock by category
              </h2>
            </div>
            <ul className="space-y-3 px-5 py-4">
              {stats.byCategory.map(({ category, count }) => (
                <li key={category}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="truncate text-xs font-medium text-ink-700">
                      {categoryName(category)}
                    </span>
                    <span className="shrink-0 font-display text-xs font-bold text-ink-900">
                      {count}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-accent-500"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* ------------------------------------------- specials ----------- */}
        {specials.length > 0 && (
          <Card>
            <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
              <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.08em] text-ink-900">
                Currently discounted
              </h2>
              <Link
                href="/admin/inventory"
                className="font-display text-[0.625rem] font-bold uppercase tracking-[0.16em] text-accent-500 transition-colors hover:text-accent-600"
              >
                Manage
              </Link>
            </div>
            <ul className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
              {specials.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/inventory/${p.id}`} className="group block">
                    <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-ink-100">
                      <Image
                        src={p.images[0]}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-2 truncate text-xs font-semibold text-ink-900">{p.title}</p>
                    <p className="text-xs text-ink-500">
                      {currency(p.price)}
                      {p.savings > 0 && (
                        <span className="ml-1.5 text-accent-500">
                          save {currency(p.savings)}
                        </span>
                      )}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </>
  );
}
