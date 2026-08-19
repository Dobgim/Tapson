"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, Mail, Phone, Printer } from "lucide-react";
import { paymentMethodName, type PaymentMethodId } from "@/data/payment-methods";
import { site, locations } from "@/data/site";
import type { Product } from "@/data/products";

export type PlacedOrder = {
  reference: string;
  placedAt: string;
  emailed: boolean;
  product: Product;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  delivery: "collection" | "delivery";
  address: string;
  paymentMethod: PaymentMethodId;
  notes: string;
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Shown immediately after an order is placed.
 *
 * Deliberately titled "Invoice" and not "Receipt": nothing has been paid yet.
 * Calling it a receipt would tell the customer their money had been taken,
 * which is not true until they transfer it separately.
 */
export function Invoice({ order }: { order: PlacedOrder }) {
  const store = locations[0];
  const placed = new Date(order.placedAt);

  return (
    <div className="mx-auto max-w-3xl">
      {/* ------------------------------------------------- confirmation --- */}
      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-6 text-center print:hidden">
        <CheckCircle2 aria-hidden className="mx-auto size-10 text-emerald-600" />
        <h1 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-[-0.02em] text-ink-900">
          Order placed
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-600">
          Thanks {order.customerName.split(" ")[0]} — your order is logged as{" "}
          <span className="font-semibold text-ink-900">{order.reference}</span>. We&rsquo;ll send
          your {paymentMethodName(order.paymentMethod)} payment details shortly.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-ink-300 px-5 font-display text-xs font-bold uppercase tracking-[0.14em] text-ink-900 transition-colors hover:border-ink-900"
          >
            <Printer aria-hidden className="size-4" />
            Print / save PDF
          </button>
          <Link
            href="/inventory"
            className="inline-flex h-11 items-center rounded-lg bg-ink-900 px-5 font-display text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-ink-800"
          >
            Keep browsing
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------ invoice --- */}
      <article className="mt-6 overflow-hidden rounded-2xl border border-ink-200 bg-white print:border-0">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-200 p-6">
          <div>
            <p className="font-display text-lg font-extrabold uppercase tracking-[-0.01em] text-ink-900">
              {site.name}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">
              {store.street}
              <br />
              {store.city}, {store.region} {store.postalCode}
              <br />
              {store.phone} · {site.email}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-[0.625rem] font-bold uppercase tracking-[0.16em] text-ink-400">
              Invoice
            </p>
            <p className="font-display text-base font-extrabold text-ink-900">{order.reference}</p>
            <p className="mt-1 text-xs text-ink-500">
              {placed.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 font-display text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-amber-700">
              <Clock aria-hidden className="size-3" />
              Awaiting payment
            </span>
          </div>
        </header>

        {/* ---------------------------------------------------- parties -- */}
        <div className="grid gap-6 border-b border-ink-200 p-6 sm:grid-cols-2">
          <div>
            <p className="font-display text-[0.625rem] font-bold uppercase tracking-[0.16em] text-ink-400">
              Billed to
            </p>
            <p className="mt-1.5 text-sm font-semibold text-ink-900">{order.customerName}</p>
            <p className="text-xs leading-relaxed text-ink-500">
              {order.customerEmail}
              <br />
              {order.customerPhone}
            </p>
          </div>
          <div>
            <p className="font-display text-[0.625rem] font-bold uppercase tracking-[0.16em] text-ink-400">
              {order.delivery === "delivery" ? "Deliver to" : "Collection"}
            </p>
            <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-ink-600">
              {order.delivery === "delivery"
                ? order.address
                : `${store.name}\n${store.street}\n${store.city}, ${store.region} ${store.postalCode}`}
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------- items -- */}
        <div className="p-6">
          <div className="flex gap-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-ink-100">
              <Image
                src={order.product.images[0]}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-extrabold uppercase tracking-[-0.01em] text-ink-900">
                {order.product.title}
              </p>
              <p className="mt-0.5 text-xs text-ink-400">
                Stock {order.product.stockNumber} · {order.product.condition} ·{" "}
                {order.product.color}
              </p>
            </div>
            <p className="shrink-0 font-semibold text-ink-900">{money(order.product.price)}</p>
          </div>

          <dl className="mt-6 space-y-2 border-t border-ink-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-500">Subtotal</dt>
              <dd className="text-ink-900">{money(order.product.price)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Tax, title &amp; registration</dt>
              <dd className="text-ink-400">Confirmed before payment</dd>
            </div>
            {order.delivery === "delivery" && (
              <div className="flex justify-between">
                <dt className="text-ink-500">Delivery</dt>
                <dd className="text-ink-400">Quoted separately</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-ink-200 pt-3">
              <dt className="font-display text-xs font-bold uppercase tracking-[0.12em] text-ink-900">
                Total due
              </dt>
              <dd className="font-display text-xl font-extrabold text-ink-900">
                {money(order.product.price)}
              </dd>
            </div>
          </dl>

          {order.notes && (
            <div className="mt-6 rounded-lg bg-ink-50 p-4">
              <p className="font-display text-[0.625rem] font-bold uppercase tracking-[0.16em] text-ink-400">
                Your notes
              </p>
              <p className="mt-1.5 whitespace-pre-line text-sm text-ink-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* ----------------------------------------------- what happens --- */}
        <footer className="border-t border-ink-200 bg-ink-50 p-6">
          <p className="font-display text-[0.625rem] font-bold uppercase tracking-[0.16em] text-ink-400">
            Payment method chosen
          </p>
          <p className="mt-1 font-display text-base font-extrabold uppercase text-ink-900">
            {paymentMethodName(order.paymentMethod)}
          </p>

          <ol className="mt-5 space-y-3 text-sm text-ink-600">
            {[
              "We confirm the final total including tax, title and registration.",
              `We send your ${paymentMethodName(order.paymentMethod)} payment details by email and text.`,
              "You transfer the payment using those details.",
              "Once it clears, the unit is held in your name and we book collection or delivery.",
            ].map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ink-900 font-display text-[0.5625rem] font-bold text-white">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          <p className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-800">
            <strong>Payment details only ever come from us.</strong> We will contact you using the
            phone number and email above. If anyone else sends you payment details quoting this
            order, call us on {store.phone} before sending money.
          </p>

          <div className="mt-5 flex flex-wrap gap-4 border-t border-ink-200 pt-4 text-xs">
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-1.5 text-ink-600 transition-colors hover:text-accent-500"
            >
              <Phone aria-hidden className="size-3.5" />
              {store.phone}
            </a>
            <a
              href={`mailto:${site.email}?subject=Order ${order.reference}`}
              className="inline-flex items-center gap-1.5 text-ink-600 transition-colors hover:text-accent-500"
            >
              <Mail aria-hidden className="size-3.5" />
              {site.email}
            </a>
          </div>
        </footer>
      </article>

      {!order.emailed && (
        <p className="mt-4 rounded-lg border border-ink-200 bg-white p-3 text-xs leading-relaxed text-ink-500 print:hidden">
          Your order is saved under {order.reference}. If you don&rsquo;t hear from us within one
          business day, call {store.phone} and quote that reference.
        </p>
      )}
    </div>
  );
}
