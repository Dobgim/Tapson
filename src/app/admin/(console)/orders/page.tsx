import { listOrders } from "@/lib/admin/store";
import { PageHeader, Card, EmptyState, currency } from "@/components/admin/ui";
import { OrderRow } from "@/components/admin/OrderRow";

export const metadata = { title: "Orders" };

const TABS = [
  { key: "", label: "All" },
  { key: "awaiting_payment", label: "Awaiting payment" },
  { key: "paid", label: "Paid" },
  { key: "fulfilled", label: "Fulfilled" },
  { key: "cancelled", label: "Cancelled" },
] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "" } = await searchParams;
  const all = await listOrders();
  const rows = status ? all.filter((o) => o.status === status) : all;

  const awaiting = all.filter((o) => o.status === "awaiting_payment");
  const owed = awaiting.reduce((sum, o) => sum + o.unitPrice, 0);

  return (
    <>
      <PageHeader
        title="Orders"
        description={
          awaiting.length
            ? `${awaiting.length} awaiting payment · ${currency(owed)} outstanding.`
            : "No orders awaiting payment."
        }
      />

      <div className="space-y-4 px-5 py-6 sm:px-8">
        <nav className="flex flex-wrap gap-1.5" aria-label="Filter by status">
          {TABS.map((tab) => {
            const active = status === tab.key;
            const count = tab.key ? all.filter((o) => o.status === tab.key).length : all.length;
            return (
              <a
                key={tab.key || "all"}
                href={tab.key ? `/admin/orders?status=${tab.key}` : "/admin/orders"}
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
              title="No orders here"
              body="Orders placed from a unit page land in this list, and you'll get an email for each one."
            />
          ) : (
            <ul className="divide-y divide-ink-100">
              {rows.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
