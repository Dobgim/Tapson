"use client";

import { Button, SlideArrow } from "../ui/Button";
import { FormStatus, SelectField, SubmitSpinner, TextAreaField, TextField, useLeadForm } from "./fields";
import { categories } from "@/data/categories";
import { locations } from "@/data/site";
import { email, minLength, numeric, phone, required } from "@/lib/validation";

const employment = [
  { value: "full-time", label: "Employed full time" },
  { value: "part-time", label: "Employed part time" },
  { value: "self", label: "Self-employed" },
  { value: "retired", label: "Retired" },
  { value: "other", label: "Other" },
];

export function FinancingForm() {
  const form = useLeadForm(
    "financing",
    {
      name: [required("Your name"), minLength(2, "Your name")],
      email: [required("Email"), email],
      phone: [required("Phone"), phone],
      income: [required("Monthly income"), numeric("Monthly income")],
      interest: [required("Unit of interest")],
    },
    {
      name: "",
      email: "",
      phone: "",
      income: "",
      employment: "full-time",
      interest: "",
      category: categories[0].slug,
      store: locations[0].id,
      notes: "",
    },
  );

  return (
    <form onSubmit={form.submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Full name"
          required
          autoComplete="name"
          value={form.values.name}
          error={form.errors.name}
          onChange={(e) => form.set("name")(e.target.value)}
        />
        <TextField
          label="Phone"
          type="tel"
          required
          autoComplete="tel"
          value={form.values.phone}
          error={form.errors.phone}
          onChange={(e) => form.set("phone")(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={form.values.email}
          error={form.errors.email}
          onChange={(e) => form.set("email")(e.target.value)}
        />
        <TextField
          label="Gross monthly income"
          required
          inputMode="numeric"
          placeholder="5200"
          hint="Used only to match you to the right lender."
          value={form.values.income}
          error={form.errors.income}
          onChange={(e) => form.set("income")(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Employment"
          options={employment}
          value={form.values.employment}
          onChange={(e) => form.set("employment")(e.target.value)}
        />
        <SelectField
          label="Category"
          options={categories.map((c) => ({ value: c.slug, label: c.name }))}
          value={form.values.category}
          onChange={(e) => form.set("category")(e.target.value)}
        />
      </div>

      <TextField
        label="Unit you're interested in"
        required
        placeholder="2025 Yamaha MT-09 SP"
        value={form.values.interest}
        error={form.errors.interest}
        onChange={(e) => form.set("interest")(e.target.value)}
      />

      <SelectField
        label="Preferred store"
        options={locations.map((l) => ({ value: l.id, label: `${l.city} — ${l.phone}` }))}
        value={form.values.store}
        onChange={(e) => form.set("store")(e.target.value)}
      />

      <TextAreaField
        label="Anything else?"
        placeholder="Trade-in details, down payment, timing..."
        value={form.values.notes}
        onChange={(e) => form.set("notes")(e.target.value)}
      />

      <p className="text-[0.6875rem] leading-relaxed text-ink-500">
        Submitting this form starts a conversation only. It is not a credit application and does not
        trigger a credit inquiry. No social security number is collected here.
      </p>

      <FormStatus
        state={form.state}
        message={form.message}
        successTitle="Application started"
        successBody="A finance manager will call to finish the paperwork."
      />

      <Button type="submit" size="lg" disabled={form.state === "submitting"} className="w-full sm:w-auto">
        {form.state === "submitting" ? (
          <>
            <SubmitSpinner />
            Sending
          </>
        ) : (
          <>
            Apply now
            <SlideArrow />
          </>
        )}
      </Button>
    </form>
  );
}
