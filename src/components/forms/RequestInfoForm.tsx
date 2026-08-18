"use client";

import { Button, SlideArrow } from "../ui/Button";
import { FormStatus, SubmitSpinner, TextAreaField, TextField, useLeadForm } from "./fields";
import { email, minLength, phone, required } from "@/lib/validation";

type Kind = "request-info" | "test-ride";

export function RequestInfoForm({
  unit,
  stockNumber,
  kind = "request-info",
}: {
  unit: string;
  stockNumber: string;
  kind?: Kind;
}) {
  const form = useLeadForm(
    kind,
    {
      name: [required("Your name"), minLength(2, "Your name")],
      email: [required("Email"), email],
      phone: [required("Phone"), phone],
    },
    {
      name: "",
      email: "",
      phone: "",
      unit,
      stockNumber,
      message:
        kind === "test-ride"
          ? `I'd like to book a test ride on the ${unit}.`
          : `Please send me more information on the ${unit}.`,
    },
  );

  return (
    <form onSubmit={form.submit} noValidate className="space-y-4">
      <div className="rounded-xl bg-ink-50 px-4 py-3 text-sm">
        <p className="font-semibold text-ink-900">{unit}</p>
        <p className="text-xs text-ink-500">Stock {stockNumber}</p>
      </div>

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

      <TextAreaField
        label="Message"
        value={form.values.message}
        onChange={(e) => form.set("message")(e.target.value)}
      />

      <FormStatus
        state={form.state}
        message={form.message}
        successTitle={kind === "test-ride" ? "Test ride requested" : "Request sent"}
        successBody="We'll confirm by phone shortly."
      />

      <Button type="submit" size="lg" disabled={form.state === "submitting"} className="w-full">
        {form.state === "submitting" ? (
          <>
            <SubmitSpinner />
            Sending
          </>
        ) : (
          <>
            {kind === "test-ride" ? "Request test ride" : "Send request"}
            <SlideArrow />
          </>
        )}
      </Button>
    </form>
  );
}
