import { NextResponse } from "next/server";
import { createOrder } from "@/lib/admin/store";
import { paymentMethodById, paymentMethodName, type PaymentMethodId } from "@/data/payment-methods";
import { site, locations } from "@/data/site";

/**
 * Order intake.
 *
 * Persists the order, then notifies the dealership by email through Web3Forms.
 * The two are deliberately independent: if the email provider is down or the
 * access key is missing, the order is still stored and visible in the console,
 * and the customer still gets their invoice. Losing a sale to a mail outage
 * would be worse than a missing notification.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

type Body = {
  productId?: string;
  productTitle?: string;
  productImage?: string;
  stockNumber?: string;
  unitPrice?: number;
  name?: string;
  email?: string;
  phone?: string;
  delivery?: string;
  address?: string;
  paymentMethod?: string;
  notes?: string;
};

function reference() {
  // RR-ORD-XXXXXX — short enough to read down the phone.
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  const time = Date.now().toString(36).toUpperCase().slice(-4);
  return `RR-ORD-${time}${rand}`;
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Fire-and-forget notification. Never throws into the request path. */
async function notify(order: Record<string, string | number>) {
  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) {
    console.warn("[orders] WEB3FORMS_ACCESS_KEY not set — no email sent");
    return { sent: false, reason: "not-configured" as const };
  }

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: `New order ${order.reference} — ${order.product}`,
        from_name: `${site.name} website`,
        // Replying to the notification reaches the customer directly.
        replyto: order.customer_email,
        ...order,
      }),
    });
    const json = (await res.json()) as { success?: boolean; message?: string };
    if (!json.success) {
      console.error("[orders] web3forms rejected:", json.message);
      return { sent: false, reason: "rejected" as const };
    }
    return { sent: true, reason: null };
  } catch (err) {
    console.error("[orders] web3forms failed:", err);
    return { sent: false, reason: "error" as const };
  }
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const method = (body.paymentMethod ?? "").trim();
  const title = (body.productTitle ?? "").trim();
  const price = Number(body.unitPrice);

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Enter your full name." }, { status: 422 });
  }
  if (!EMAIL.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 422 });
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ ok: false, error: "Enter a valid phone number." }, { status: 422 });
  }
  if (!paymentMethodById.has(method as PaymentMethodId)) {
    return NextResponse.json({ ok: false, error: "Choose a payment method." }, { status: 422 });
  }
  if (!title || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ ok: false, error: "That unit is unavailable." }, { status: 422 });
  }

  const delivery = body.delivery === "delivery" ? "delivery" : "collection";
  const address = (body.address ?? "").trim();
  if (delivery === "delivery" && address.length < 8) {
    return NextResponse.json(
      { ok: false, error: "Enter the delivery address." },
      { status: 422 },
    );
  }

  const ref = reference();
  const placedAt = new Date().toISOString();

  const stored = await createOrder({
    reference: ref,
    productId: body.productId ?? null,
    productTitle: title,
    productImage: body.productImage ?? null,
    stockNumber: body.stockNumber ?? null,
    unitPrice: price,
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    delivery,
    address,
    paymentMethod: method,
    notes: (body.notes ?? "").trim(),
  });

  if (!stored) {
    return NextResponse.json(
      { ok: false, error: "We couldn't record that order. Please call us and we'll take it by phone." },
      { status: 503 },
    );
  }

  const store = locations[0];
  const notification = await notify({
    reference: ref,
    product: title,
    stock_number: body.stockNumber ?? "—",
    price: money(price),
    payment_method: paymentMethodName(method),
    fulfilment: delivery === "delivery" ? `Delivery to ${address}` : `Collection from ${store.city}`,
    customer_name: name,
    customer_email: email,
    customer_phone: phone,
    notes: (body.notes ?? "").trim() || "—",
    placed_at: placedAt,
  });

  return NextResponse.json({
    ok: true,
    reference: ref,
    placedAt,
    emailed: notification.sent,
  });
}
