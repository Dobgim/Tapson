"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, Check, Loader2, ShieldCheck } from "lucide-react";
import { paymentMethods, type PaymentMethodId } from "@/data/payment-methods";
import type { Product } from "@/data/products";
import { Invoice, type PlacedOrder } from "./Invoice";
import { cn } from "@/lib/utils";

const field =
  "h-11 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 transition-colors focus:border-accent-500 focus:outline-none";
const labelCls =
  "mb-1.5 block font-display text-[0.625rem] font-bold uppercase tracking-[0.14em] text-ink-400";

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/**
 * Deliver the order notification from the browser.
 *
 * Web3Forms rejects server-side calls on the free plan ("Use our API in
 * client side ... Pro plan is required"), so this has to run here. The access
 * key is designed to be public and only permits submitting to this one form.
 *
 * The body must be FormData, not JSON. A JSON body sets
 * Content-Type: application/json, which makes this a non-simple cross-origin
 * request and triggers a CORS preflight. Web3Forms does not answer the
 * preflight, so the browser blocks the send outright:
 *
 *   Access to fetch at 'https://api.web3forms.com/submit' from origin
 *   '…' has been blocked by CORS policy: Response to preflight request…
 *
 * FormData is a simple request, so no preflight happens. This is the shape
 * their own documentation uses.
 *
 * Returns whether the mail went out. Never throws: the order is already saved
 * in the database and visible in the dashboard, so a mail outage must not
 * cost the customer their invoice.
 */
async function sendNotification(payload: Record<string, string | number> | undefined) {
  const key = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!key || !payload) return false;

  const form = new FormData();
  form.append("access_key", key);
  form.append("subject", `New order ${payload.reference} — ${payload.product}`);
  form.append("from_name", "Repossessed Rides website");
  // Replying to the notification reaches the customer directly.
  form.append("replyto", String(payload.customer_email ?? ""));
  for (const [k, v] of Object.entries(payload)) form.append(k, String(v));

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, { method: "POST", body: form });
    const json = (await res.json()) as { success?: boolean };
    return Boolean(json.success);
  } catch {
    return false;
  }
}

export function OrderForm({ product }: { product: Product }) {
  const [method, setMethod] = useState<PaymentMethodId | "">("");
  const [delivery, setDelivery] = useState<"collection" | "delivery">("collection");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    const payload = {
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0],
      stockNumber: product.stockNumber,
      unitPrice: product.price,
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      delivery,
      address: String(data.get("address") ?? ""),
      paymentMethod: method,
      notes: String(data.get("notes") ?? ""),
    };

    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Something went wrong. Please call us instead.");
        return;
      }
      // Web3Forms only accepts submissions from the browser on the free plan,
      // so the notification is delivered from here rather than the server. The
      // order is already stored, so a mail failure must not block the invoice.
      const emailed = await sendNotification(json.notification);

      setPlaced({
        reference: json.reference,
        placedAt: json.placedAt,
        emailed,
        product,
        customerName: payload.name,
        customerEmail: payload.email,
        customerPhone: payload.phone,
        delivery,
        address: payload.address,
        paymentMethod: method as PaymentMethodId,
        notes: payload.notes,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Network problem — check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (placed) return <Invoice order={placed} />;

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
      <div className="space-y-6">
        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-accent-500/30 bg-accent-500/8 p-3 text-sm text-accent-600"
          >
            <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        )}

        {/* ------------------------------------------------ your details --- */}
        <section className="rounded-2xl border border-ink-200 bg-white p-6">
          <h2 className="mb-4 font-display text-sm font-extrabold uppercase tracking-[0.08em] text-ink-900">
            Your details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className={labelCls}>Full name</label>
              <input id="name" name="name" required autoComplete="name" className={field} />
            </div>
            <div>
              <label htmlFor="email" className={labelCls}>Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" className={field} />
            </div>
            <div>
              <label htmlFor="phone" className={labelCls}>Phone</label>
              <input id="phone" name="phone" type="tel" required autoComplete="tel" className={field} />
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- fulfilment -- */}
        <section className="rounded-2xl border border-ink-200 bg-white p-6">
          <h2 className="mb-4 font-display text-sm font-extrabold uppercase tracking-[0.08em] text-ink-900">
            Collection or delivery
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["collection", "delivery"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setDelivery(opt)}
                aria-pressed={delivery === opt}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all duration-300",
                  delivery === opt
                    ? "border-accent-500 bg-accent-500/5"
                    : "border-ink-200 hover:border-ink-300",
                )}
              >
                <span className="block font-display text-xs font-bold uppercase tracking-[0.12em] text-ink-900">
                  {opt === "collection" ? "Collect in store" : "Deliver to me"}
                </span>
                <span className="mt-1 block text-xs text-ink-500">
                  {opt === "collection"
                    ? "Pick up from Burlington"
                    : "We'll quote delivery separately"}
                </span>
              </button>
            ))}
          </div>

          {delivery === "delivery" && (
            <div className="mt-4">
              <label htmlFor="address" className={labelCls}>Delivery address</label>
              <textarea
                id="address"
                name="address"
                rows={3}
                required
                autoComplete="street-address"
                placeholder="Street, city, state, ZIP"
                className="w-full rounded-lg border border-ink-200 bg-white p-3 text-sm text-ink-900 focus:border-accent-500 focus:outline-none"
              />
            </div>
          )}
        </section>

        {/* ------------------------------------------------ payment pick --- */}
        <section className="rounded-2xl border border-ink-200 bg-white p-6">
          <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.08em] text-ink-900">
            How would you like to pay?
          </h2>
          <p className="mt-1.5 mb-4 text-xs text-ink-500">
            Pick one and we&rsquo;ll send you the payment details to complete it. Nothing is
            charged here, and we never ask for card or account numbers on this page.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {paymentMethods.map((m) => {
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-300",
                    active
                      ? "border-accent-500 bg-accent-500/5"
                      : "border-ink-200 hover:border-ink-300",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-9 place-items-center rounded-lg font-display text-base font-extrabold transition-colors",
                      active ? "bg-accent-500 text-white" : "bg-ink-100 text-ink-500",
                    )}
                  >
                    {m.monogram}
                  </span>
                  <span className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-ink-900">
                    {m.name}
                  </span>
                  <span className="text-[0.625rem] leading-tight text-ink-400">{m.hint}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <label htmlFor="notes" className={labelCls}>Anything else? (optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Trade-in, accessories, timing…"
              className="w-full rounded-lg border border-ink-200 bg-white p-3 text-sm text-ink-900 focus:border-accent-500 focus:outline-none"
            />
          </div>
        </section>
      </div>

      {/* --------------------------------------------------------- summary -- */}
      <aside className="lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
          <div className="relative aspect-4/3 bg-ink-100">
            <Image
              src={product.images[0]}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <p className="font-display text-base font-extrabold uppercase tracking-[-0.01em] text-ink-900">
              {product.title}
            </p>
            <p className="mt-1 text-xs text-ink-400">
              Stock {product.stockNumber} · {product.condition}
            </p>

            <dl className="mt-5 space-y-2 border-t border-ink-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">Unit price</dt>
                <dd className="font-semibold text-ink-900">{money(product.price)}</dd>
              </div>
              {product.savings > 0 && (
                <div className="flex justify-between">
                  <dt className="text-ink-500">You save</dt>
                  <dd className="font-semibold text-accent-500">−{money(product.savings)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-ink-100 pt-2">
                <dt className="font-display text-xs font-bold uppercase tracking-[0.12em] text-ink-900">
                  Total due
                </dt>
                <dd className="font-display text-lg font-extrabold text-ink-900">
                  {money(product.price)}
                </dd>
              </div>
            </dl>

            <p className="mt-2 text-[0.6875rem] leading-relaxed text-ink-400">
              Excludes tax, title, registration and any delivery charge. We&rsquo;ll confirm the
              final figure before you pay.
            </p>

            <button
              type="submit"
              disabled={busy || !method}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent-500 font-display text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 aria-hidden className="size-4 animate-spin" />
                  Placing order
                </>
              ) : (
                <>
                  <Check aria-hidden className="size-4" />
                  Place order
                </>
              )}
            </button>
            {!method && (
              <p className="mt-2 text-center text-[0.6875rem] text-ink-400">
                Choose a payment method to continue
              </p>
            )}

            <p className="mt-4 flex items-start gap-2 border-t border-ink-100 pt-4 text-[0.6875rem] leading-relaxed text-ink-400">
              <ShieldCheck aria-hidden className="mt-px size-3.5 shrink-0 text-ink-400" />
              No payment is taken on this website. You&rsquo;ll receive payment instructions from
              us directly, and the unit is held once payment clears.
            </p>
          </div>
        </div>
      </aside>
    </form>
  );
}
