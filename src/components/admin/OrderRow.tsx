import Image from "next/image";
import { Mail, Phone, Trash2, Truck, Store } from "lucide-react";
import { currency } from "./ui";
import { setOrderStatusAction, deleteOrderAction } from "@/lib/admin/actions";
import { paymentMethodName } from "@/data/payment-methods";
import type { Order, OrderStatus } from "@/lib/admin/store";

const STATUSES: { status: OrderStatus; label: string }[] = [
  { status: "awaiting_payment", label: "Awaiting" },
  { status: "paid", label: "Paid" },
  { status: "fulfilled", label: "Fulfilled" },
  { status: "cancelled", label: "Cancelled" },
];

const TONE: Record<OrderStatus, string> = {
  awaiting_payment: "bg-amber-500/15 text-amber-700",
  paid: "bg-emerald-500/15 text-emerald-700",
  fulfilled: "bg-marine-500/15 text-marine-500",
  cancelled: "bg-ink-200 text-ink-500",
};

export function OrderRow({ order }: { order: Order }) {
  return (
    <li className="p-5">
      <div className="flex flex-wrap items-start gap-4">
        {order.productImage && (
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-ink-100">
            <Image src={order.productImage} alt="" fill sizes="64px" className="object-cover" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-ink-900">{order.productTitle}</p>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 font-display text-[0.5625rem] font-bold uppercase tracking-[0.1em] ${TONE[order.status]}`}
            >
              {order.status.replace("_", " ")}
            </span>
          </div>

          <p className="mt-0.5 text-xs text-ink-400">
            {order.reference} · {order.stockNumber ?? "—"} ·{" "}
            <span className="font-semibold text-ink-600">{currency(order.unitPrice)}</span>
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
            <span className="font-medium text-ink-700">{order.customerName}</span>
            <a
              href={`mailto:${order.customerEmail}?subject=Your order ${order.reference}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-accent-500"
            >
              <Mail aria-hidden className="size-3.5" />
              {order.customerEmail}
            </a>
            <a
              href={`tel:${order.customerPhone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-accent-500"
            >
              <Phone aria-hidden className="size-3.5" />
              {order.customerPhone}
            </a>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-ink-100 px-2 py-1 font-display text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-ink-700">
              Pay by {paymentMethodName(order.paymentMethod)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink-500">
              {order.delivery === "delivery" ? (
                <>
                  <Truck aria-hidden className="size-3.5" />
                  {order.address}
                </>
              ) : (
                <>
                  <Store aria-hidden className="size-3.5" />
                  Collection
                </>
              )}
            </span>
          </div>

          {order.notes && (
            <p className="mt-2 max-w-2xl rounded-md bg-ink-50 p-2.5 text-xs leading-relaxed text-ink-600">
              {order.notes}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <time dateTime={order.createdAt} className="text-[0.6875rem] text-ink-400">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </time>
          <form action={deleteOrderAction}>
            <input type="hidden" name="id" value={order.id} />
            <button
              type="submit"
              aria-label={`Delete order ${order.reference}`}
              className="rounded-md p-2 text-ink-400 transition-colors hover:bg-accent-500/10 hover:text-accent-500"
            >
              <Trash2 aria-hidden className="size-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {STATUSES.map(({ status, label }) => (
          <form key={status} action={setOrderStatusAction}>
            <input type="hidden" name="id" value={order.id} />
            <input type="hidden" name="status" value={status} />
            <button
              type="submit"
              disabled={order.status === status}
              className={
                order.status === status
                  ? "cursor-default rounded-md bg-ink-900 px-2.5 py-1 font-display text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-white"
                  : "rounded-md border border-ink-200 px-2.5 py-1 font-display text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-ink-500 transition-colors hover:border-ink-400 hover:text-ink-900"
              }
            >
              {label}
            </button>
          </form>
        ))}
      </div>
    </li>
  );
}
