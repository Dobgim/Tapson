"use client";

import { Button, SlideArrow } from "../ui/Button";
import { FormStatus, SelectField, SubmitSpinner, TextAreaField, TextField, useLeadForm } from "./fields";
import { locations } from "@/data/site";
import { email, minLength, numeric, phone, required } from "@/lib/validation";

const workTypes = [
  { value: "maintenance", label: "Scheduled maintenance" },
  { value: "diagnostic", label: "Diagnostic / not running" },
  { value: "winterise", label: "Storage prep" },
  { value: "tyres", label: "Tires & wheels" },
  { value: "marine", label: "Marine service / rigging" },
  { value: "accessory", label: "Accessory fitting" },
];

/** Used on /service and /parts — `kind` swaps the lead type and copy. */
export function ServiceForm({ kind = "service" }: { kind?: "service" | "parts" }) {
  const isParts = kind === "parts";
  const form = useLeadForm(
    kind,
    {
      name: [required("Your name"), minLength(2, "Your name")],
      email: [required("Email"), email],
      phone: [required("Phone"), phone],
      year: [numeric("Year")],
      make: [required("Make")],
      model: [required("Model")],
      details: [required("Details"), minLength(10, "Details")],
    },
    {
      name: "",
      email: "",
      phone: "",
      year: "",
      make: "",
      model: "",
      work: isParts ? "accessory" : "maintenance",
      store: locations[0].id,
      preferredDate: "",
      details: "",
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

      <TextField
        label="Email"
        type="email"
        required
        autoComplete="email"
        value={form.values.email}
        error={form.errors.email}
        onChange={(e) => form.set("email")(e.target.value)}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <TextField
          label="Year"
          inputMode="numeric"
          placeholder="2022"
          value={form.values.year}
          error={form.errors.year}
          onChange={(e) => form.set("year")(e.target.value)}
        />
        <TextField
          label="Make"
          required
          placeholder="Sea-Doo"
          value={form.values.make}
          error={form.errors.make}
          onChange={(e) => form.set("make")(e.target.value)}
        />
        <TextField
          label="Model"
          required
          placeholder="GTI SE 170"
          value={form.values.model}
          error={form.errors.model}
          onChange={(e) => form.set("model")(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {!isParts && (
          <SelectField
            label="Type of work"
            options={workTypes}
            value={form.values.work}
            onChange={(e) => form.set("work")(e.target.value)}
          />
        )}
        <SelectField
          label="Store"
          options={locations.map((l) => ({ value: l.id, label: l.city }))}
          value={form.values.store}
          onChange={(e) => form.set("store")(e.target.value)}
        />
        {!isParts && (
          <TextField
            label="Preferred date"
            type="date"
            value={form.values.preferredDate}
            onChange={(e) => form.set("preferredDate")(e.target.value)}
          />
        )}
      </div>

      <TextAreaField
        label={isParts ? "Parts you need" : "What's going on?"}
        required
        placeholder={
          isParts
            ? "Part numbers if you have them, or just describe what you're after."
            : "Symptoms, noises, last service date, anything else useful."
        }
        value={form.values.details}
        error={form.errors.details}
        onChange={(e) => form.set("details")(e.target.value)}
      />

      <FormStatus
        state={form.state}
        message={form.message}
        successTitle={isParts ? "Parts request received" : "Service request received"}
        successBody={
          isParts
            ? "The parts counter will confirm availability and pricing."
            : "The shop will confirm your slot by phone."
        }
      />

      <Button type="submit" size="lg" disabled={form.state === "submitting"} className="w-full sm:w-auto">
        {form.state === "submitting" ? (
          <>
            <SubmitSpinner />
            Sending
          </>
        ) : (
          <>
            {isParts ? "Request parts" : "Schedule service"}
            <SlideArrow />
          </>
        )}
      </Button>
    </form>
  );
}
