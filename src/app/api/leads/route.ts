import { NextResponse } from "next/server";
import { createLead } from "@/lib/admin/store";

/**
 * Lead intake endpoint. Today it validates and echoes a reference number; the
 * shape is deliberately generic so it can be pointed at a CRM, Supabase table
 * or transactional-email provider without changing any form component.
 */

type LeadKind =
  | "contact"
  | "trade-in"
  | "financing"
  | "service"
  | "parts"
  | "request-info"
  | "test-ride"
  | "newsletter";

const KINDS: LeadKind[] = [
  "contact",
  "trade-in",
  "financing",
  "service",
  "parts",
  "request-info",
  "test-ride",
  "newsletter",
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request body." }, { status: 400 });
  }

  const payload = body as { kind?: string; fields?: Record<string, unknown> };
  const kind = payload?.kind;
  const fields = payload?.fields ?? {};

  if (!kind || !KINDS.includes(kind as LeadKind)) {
    return NextResponse.json({ ok: false, error: "Unknown enquiry type." }, { status: 400 });
  }

  const emailValue = typeof fields.email === "string" ? fields.email : "";
  if (!EMAIL.test(emailValue)) {
    return NextResponse.json(
      { ok: false, error: "A valid email address is required." },
      { status: 422 },
    );
  }

  const reference = `RR-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const text = (key: string) => (typeof fields[key] === "string" ? (fields[key] as string) : "");

  // Persists to Supabase so submissions surface in the dealer console. A
  // storage failure must not lose the customer's enquiry silently.
  const saved = await createLead({
    reference,
    kind,
    name: text("name") || text("firstName") || "Website visitor",
    email: emailValue,
    phone: text("phone"),
    message: text("message") || text("comments") || text("details") || "",
  });

  if (!saved) {
    console.error(`[lead:${kind}] ${reference} could not be stored`);
    return NextResponse.json(
      { ok: false, error: "We couldn't save that just now. Please call us instead." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, reference });
}
