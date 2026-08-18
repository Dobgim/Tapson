import { PageHeader } from "@/components/admin/ui";
import { UnitForm } from "@/components/admin/UnitForm";
import { createProductAction } from "@/lib/admin/actions";

export const metadata = { title: "Add unit" };

export default function NewUnitPage() {
  return (
    <>
      <PageHeader title="Add unit" description="Put a new machine on the floor." />
      <div className="px-5 py-6 sm:px-8">
        <UnitForm action={createProductAction} submitLabel="Create unit" />
      </div>
    </>
  );
}
