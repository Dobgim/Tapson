"use client";

import { Button, SlideArrow } from "../ui/Button";
import {
  FormStatus,
  SelectField,
  SubmitSpinner,
  TextAreaField,
  TextField,
  useLeadForm,
} from "./fields";
import { locations } from "@/data/site";
import { email, minLength, phone, required } from "@/lib/validation";

const topics = [
  { value: "sales", label: "Buying a unit" },
  { value: "test-ride", label: "Schedule a test ride" },
  { value: "service", label: "Service department" },
  { value: "parts", label: "Parts & accessories" },
  { value: "financing", label: "Financing" },
  { value: "other", label: "Something else" },
];

export function ContactForm({ defaultTopic = "sales" }: { defaultTopic?: string }) {
  const form = useLeadForm(
    "contact",
    {
      name: [required("Your name"), minLength(2, "Your name")],
      email: [required("Email"), email],
      phone: [required("Phone"), phone],
      message: [required("Message"), minLength(10, "Message")],
    },
    {
      name: "",
      email: "",
      phone: "",
      topic: topics.some((t) => t.value === defaultTopic) ? defaultTopic : "sales",
      store: locations[0].id,
      message: "",
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
          placeholder="(305) 555-0123"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="What can we help with?"
          options={topics}
          value={form.values.topic}
          onChange={(e) => form.set("topic")(e.target.value)}
        />
        <SelectField
          label="Preferred store"
          options={locations.map((l) => ({ value: l.id, label: `${l.city} — ${l.phone}` }))}
          value={form.values.store}
          onChange={(e) => form.set("store")(e.target.value)}
        />
      </div>

      <TextAreaField
        label="Message"
        required
        placeholder="Tell us what you're looking for, and when you'd like to come by."
        value={form.values.message}
        error={form.errors.message}
        onChange={(e) => form.set("message")(e.target.value)}
      />

      <FormStatus
        state={form.state}
        message={form.message}
        successTitle="Message sent"
        successBody="A product specialist will reply within one business day."
      />

      <Button type="submit" size="lg" disabled={form.state === "submitting"} className="w-full sm:w-auto">
        {form.state === "submitting" ? (
          <>
            <SubmitSpinner />
            Sending
          </>
        ) : (
          <>
            Send message
            <SlideArrow />
          </>
        )}
      </Button>
    </form>
  );
}
