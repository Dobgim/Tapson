"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn, signOut, getSession } from "./auth";
import * as store from "./store";
import type { LeadStatus, OrderStatus } from "./store";
import type { CategorySlug } from "@/data/categories";
import type { Condition, ProductSeed } from "@/data/products";

export type FormState = { error?: string; ok?: boolean } | null;

/** Every mutation goes through this so no action is reachable unauthenticated. */
async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Enter both your email and password." };

  const result = await signIn(email, password);
  if (!result.ok) return { error: result.error };

  redirect("/admin");
}

export async function logoutAction() {
  await signOut();
  redirect("/admin/login");
}

/** The uploader posts a JSON array of public Storage URLs. */
function parseImages(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((u) => typeof u === "string" && u) : [];
  } catch {
    return [];
  }
}

function toSeed(formData: FormData, id: string): ProductSeed {
  const num = (k: string) => Number(String(formData.get(k) ?? "").replace(/[^0-9.]/g, "")) || 0;
  const str = (k: string) => String(formData.get(k) ?? "").trim();
  const usageValue = num("usageValue");

  return {
    id,
    year: num("year"),
    make: str("make"),
    model: str("model"),
    trim: str("trim") || undefined,
    category: str("category") as CategorySlug,
    condition: str("condition") as Condition,
    price: num("price"),
    msrp: num("msrp") || undefined,
    usage: usageValue
      ? { value: usageValue, unit: str("usageUnit") === "hrs" ? "hrs" : "mi" }
      : undefined,
    locationId: str("locationId"),
    stockNumber: str("stockNumber"),
    color: str("color"),
    description: str("description"),
    specifications: str("specifications")
      .split("\n")
      .map((line) => line.split("|"))
      .filter((parts) => parts.length >= 2 && parts[0].trim())
      .map((parts) => ({ label: parts[0].trim(), value: parts.slice(1).join("|").trim() })),
    features: str("features")
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean),
    images: parseImages(formData.get("images")),
    featured: formData.get("featured") === "on",
    special: formData.get("special") === "on",
  };
}

/** URL-safe id derived from the unit itself, kept unique against the store. */
async function deriveId(formData: FormData) {
  const base =
    [formData.get("make"), formData.get("model"), formData.get("year")]
      .map((v) => String(v ?? ""))
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "unit";

  const existing = await store.listProducts();
  const taken = new Set(existing.map((p) => p.id));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export async function createProductAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const make = String(formData.get("make") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  if (!make || !model) return { error: "Make and model are both required." };
  if (!Number(formData.get("price"))) return { error: "Enter a price above zero." };

  const id = await deriveId(formData);
  try {
    await store.createProduct(toSeed(formData, id));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not save that unit." };
  }

  revalidatePath("/admin/inventory");
  revalidatePath("/inventory");
  redirect(`/admin/inventory?created=${id}`);
}

export async function updateProductAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing unit id." };
  if (!Number(formData.get("price"))) return { error: "Enter a price above zero." };

  try {
    const updated = await store.updateProduct(id, toSeed(formData, id));
    if (!updated) return { error: "That unit no longer exists." };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not save your changes." };
  }

  revalidatePath("/admin/inventory");
  revalidatePath(`/inventory/${id}`);
  redirect(`/admin/inventory?updated=${id}`);
}

export async function deleteProductAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (id) {
    try {
      await store.deleteProduct(id);
    } catch (err) {
      console.error("[admin] deleteProduct:", err);
    }
    revalidatePath("/admin/inventory");
    revalidatePath("/inventory");
  }
  redirect(`/admin/inventory?deleted=${id}`);
}

export async function setLeadStatusAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as LeadStatus;
  if (id && status) {
    try {
      await store.setLeadStatus(id, status);
    } catch (err) {
      console.error("[admin] setLeadStatus:", err);
    }
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
  }
}

export async function setOrderStatusAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  if (id && status) {
    try {
      await store.setOrderStatus(id, status);
    } catch (err) {
      console.error("[admin] setOrderStatus:", err);
    }
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
  }
}

export async function deleteOrderAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (id) {
    try {
      await store.deleteOrder(id);
    } catch (err) {
      console.error("[admin] deleteOrder:", err);
    }
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
  }
}

export async function deleteLeadAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (id) {
    try {
      await store.deleteLead(id);
    } catch (err) {
      console.error("[admin] deleteLead:", err);
    }
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
  }
}
