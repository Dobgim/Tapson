"use client";

import { Button, SlideArrow } from "../ui/Button";
import {
  FileField,
  FormStatus,
  SelectField,
  SubmitSpinner,
  TextAreaField,
  TextField,
  useLeadForm,
} from "./fields";
import { categories } from "@/data/categories";
import { email, minLength, numeric, phone, required } from "@/lib/validation";

const conditions = [
  { value: "excellent", label: "Excellent — showroom ready" },
  { value: "good", label: "Good — normal wear" },
  { value: "fair", label: "Fair — needs some work" },
  { value: "poor", label: "Poor — not running" },
];

export function TradeInForm() {
  const form = useLeadForm(
    "trade-in",
    {
      name: [required("Your name"), minLength(2, "Your name")],
      email: [required("Email"), email],
      phone: [required("Phone"), phone],
      year: [required("Year"), numeric("Year")],
      make: [required("Make")],
      model: [required("Model")],
      mileage: [numeric("Mileage")],
    },
    {
      name: "",
      email: "",
      phone: "",
      year: "",
      make: "",
      model: "",
      category: categories[0].slug,
      mileage: "",
      condition: "good",
      comments: "",
      photos: "",
    },
  );

  return (
    <form onSubmit={form.submit} noValidate className="space-y-5">
      <fieldset className="space-y-4">
        <legend className="eyebrow mb-2 text-ink-400">Your details</legend>
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
        <TextField
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={form.values.email}
          error={form.errors.email}
          onChange={(e) => form.set("email")(e.target.value)}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="eyebrow mb-2 text-ink-400">Your unit</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            label="Year"
            required
            inputMode="numeric"
            placeholder="2021"
            value={form.values.year}
            error={form.errors.year}
            onChange={(e) => form.set("year")(e.target.value)}
          />
          <TextField
            label="Make"
            required
            placeholder="Yamaha"
            value={form.values.make}
            error={form.errors.make}
            onChange={(e) => form.set("make")(e.target.value)}
          />
          <TextField
            label="Model"
            required
            placeholder="MT-07"
            value={form.values.model}
            error={form.errors.model}
            onChange={(e) => form.set("model")(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField
            label="Type"
            options={categories.map((c) => ({ value: c.slug, label: c.name }))}
            value={form.values.category}
            onChange={(e) => form.set("category")(e.target.value)}
          />
          <TextField
            label="Miles / hours"
            inputMode="numeric"
            placeholder="4200"
            value={form.values.mileage}
            error={form.errors.mileage}
            onChange={(e) => form.set("mileage")(e.target.value)}
          />
          <SelectField
            label="Condition"
            options={conditions}
            value={form.values.condition}
            onChange={(e) => form.set("condition")(e.target.value)}
          />
        </div>

        <TextAreaField
          label="Anything we should know?"
          placeholder="Service history, modifications, damage, outstanding finance..."
          value={form.values.comments}
          onChange={(e) => form.set("comments")(e.target.value)}
        />

        <FileField
          label="Photos"
          hint="Four or five angles plus the odometer gets you the most accurate number."
          onFiles={(names) => form.set("photos")(names.join(", "))}
        />
      </fieldset>

      <FormStatus
        state={form.state}
        message={form.message}
        successTitle="Appraisal request received"
        successBody="We'll come back with a real number, usually the same day."
      />

      <Button type="submit" size="lg" disabled={form.state === "submitting"} className="w-full sm:w-auto">
        {form.state === "submitting" ? (
          <>
            <SubmitSpinner />
            Sending
          </>
        ) : (
          <>
            Value my trade
            <SlideArrow />
          </>
        )}
      </Button>
    </form>
  );
}
