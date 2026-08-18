import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getProduct } from "@/lib/admin/store";
import { PageHeader } from "@/components/admin/ui";
import { UnitForm } from "@/components/admin/UnitForm";
import { updateProductAction } from "@/lib/admin/actions";

export const metadata = { title: "Edit unit" };

export default async function EditUnitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <>
      <PageHeader title={product.title} description={`Stock ${product.stockNumber}`} />
      <div className="space-y-4 px-5 py-6 sm:px-8">
        <Link
          href={`/inventory/${product.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 font-display text-[0.625rem] font-bold uppercase tracking-[0.16em] text-accent-500 transition-colors hover:text-accent-600"
        >
          <ExternalLink aria-hidden className="size-3.5" />
          View on storefront
        </Link>
        <UnitForm action={updateProductAction} product={product} submitLabel="Save changes" />
      </div>
    </>
  );
}
