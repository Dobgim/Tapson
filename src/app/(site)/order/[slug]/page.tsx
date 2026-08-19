import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProduct } from "@/lib/admin/store";
import { OrderForm } from "@/components/order/OrderForm";

export const metadata: Metadata = {
  title: "Place an order",
  // A checkout page has no business in search results.
  robots: { index: false, follow: false },
};

export default async function OrderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <section className="bg-ink-50 py-10 lg:py-16">
      <div className="shell">
        <Link
          href={`/inventory/${product.slug}`}
          className="group inline-flex items-center gap-1.5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink-500 transition-colors hover:text-accent-500"
        >
          <ArrowLeft
            aria-hidden
            className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          Back to the unit
        </Link>

        <h1 className="display-lg mt-4 text-ink-900">Place your order</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-500">
          Tell us how to reach you and how you&rsquo;d like to pay. You&rsquo;ll get an invoice
          straight away, and we&rsquo;ll follow up with the payment details.
        </p>

        <div className="mt-10">
          <OrderForm product={product} />
        </div>
      </div>
    </section>
  );
}
