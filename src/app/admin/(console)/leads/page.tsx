import { listLeads } from "@/lib/admin/store";
import { PageHeader, Card, EmptyState } from "@/components/admin/ui";
import { LeadRow } from "@/components/admin/LeadRow";

export const metadata = { title: "Enquiries" };

const TABS = [
  { key: "", label: "All" },
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "won", label: "Won" },
  { key: "closed", label: "Closed" },
] as const;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "" } = await searchParams;
  const all = await listLeads();
  const rows = status ? all.filter((l) => l.status === status) : all;

  return (
    <>
      <PageHeader
        title="Enquiries"
        description={`${all.filter((l) => l.status === "new").length} awaiting a first response.`}
      />

      <div className="space-y-4 px-5 py-6 sm:px-8">
        <nav className="flex flex-wrap gap-1.5" aria-label="Filter by status">
          {TABS.map((tab) => {
            const active = status === tab.key;
            const count = tab.key ? all.filter((l) => l.status === tab.key).length : all.length;
            return (
              <a
                key={tab.key || "all"}
                href={tab.key ? `/admin/leads?status=${tab.key}` : "/admin/leads"}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "inline-flex items-center gap-1.5 rounded-lg bg-ink-900 px-3.5 py-2 font-display text-[0.625rem] font-bold uppercase tracking-[0.14em] text-white"
                    : "inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3.5 py-2 font-display text-[0.625rem] font-bold uppercase tracking-[0.14em] text-ink-500 transition-colors hover:border-ink-300 hover:text-ink-900"
                }
              >
                {tab.label}
                <span className={active ? "text-white/50" : "text-ink-400"}>{count}</span>
              </a>
            );
          })}
        </nav>

        <Card className="overflow-hidden">
          {rows.length === 0 ? (
            <EmptyState
              title="Nothing here"
              body="Enquiries submitted from the storefront forms appear in this list."
            />
          ) : (
            <ul className="divide-y divide-ink-100">
              {rows.map((lead) => (
                <LeadRow key={lead.id} lead={lead} />
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
