import "server-only";
import { estimatedPayment } from "@/lib/finance";
import { getSupabase, supabaseConfigured } from "@/lib/supabase/server";
import type { CategorySlug } from "@/data/categories";
import type { Condition, Product, ProductSeed } from "@/data/products";

/**
 * Data access, backed by Supabase Postgres.
 *
 * Reads run as the anonymous role on the storefront and as the signed-in
 * operator inside the console; writes only succeed for a signed-in user.
 * Row Level Security (see supabase/schema.sql) enforces that, not this file.
 */

export type LeadStatus = "new" | "contacted" | "won" | "closed";

export type Lead = {
  id: string;
  reference: string;
  kind: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
};

type ProductRow = {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  category: string;
  condition: Condition;
  price: string | number;
  msrp: string | number | null;
  usage_value: string | number | null;
  usage_unit: "mi" | "hrs" | null;
  location_id: string | null;
  stock_number: string | null;
  color: string | null;
  description: string | null;
  specifications: { label: string; value: string }[] | null;
  features: string[] | null;
  images: string[] | null;
  featured: boolean;
  special: boolean;
};

type LeadRow = {
  id: string;
  reference: string;
  kind: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: LeadStatus;
  created_at: string;
};

const num = (v: string | number | null | undefined) =>
  v === null || v === undefined ? 0 : typeof v === "number" ? v : Number(v);

/** Row -> the shape every storefront component already expects. */
function toProduct(row: ProductRow): Product {
  const price = num(row.price);
  const msrp = row.msrp === null ? undefined : num(row.msrp);
  const title = [row.year, row.make, row.model, row.trim].filter(Boolean).join(" ");
  const images =
    row.images && row.images.length
      ? row.images
      : [1, 2, 3].map((n) => `/images/products/${row.id}-${n}.webp`);

  return {
    id: row.id,
    year: row.year,
    make: row.make,
    model: row.model,
    trim: row.trim ?? undefined,
    category: row.category as CategorySlug,
    condition: row.condition,
    price,
    msrp,
    usage:
      row.usage_value === null || row.usage_unit === null
        ? undefined
        : { value: num(row.usage_value), unit: row.usage_unit },
    locationId: row.location_id ?? "",
    stockNumber: row.stock_number ?? "",
    color: row.color ?? "",
    description: row.description ?? "",
    specifications: row.specifications ?? [],
    features: row.features ?? [],
    featured: row.featured,
    special: row.special,
    slug: row.id,
    title,
    images,
    monthlyPayment: estimatedPayment(price),
    savings: msrp ? msrp - price : 0,
  };
}

/** ProductSeed -> row. `undefined` becomes NULL rather than being dropped. */
function toRow(seed: ProductSeed) {
  return {
    id: seed.id,
    year: seed.year,
    make: seed.make,
    model: seed.model,
    trim: seed.trim ?? null,
    category: seed.category,
    condition: seed.condition,
    price: seed.price,
    msrp: seed.msrp ?? null,
    usage_value: seed.usage?.value ?? null,
    usage_unit: seed.usage?.unit ?? null,
    location_id: seed.locationId || null,
    stock_number: seed.stockNumber || null,
    color: seed.color || null,
    description: seed.description ?? "",
    specifications: seed.specifications ?? [],
    features: seed.features ?? [],
    images: [1, 2, 3].map((n) => `/images/products/${seed.id}-${n}.webp`),
    featured: Boolean(seed.featured),
    special: Boolean(seed.special),
  };
}

function toLead(row: LeadRow): Lead {
  return {
    id: row.id,
    reference: row.reference,
    kind: row.kind,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

/**
 * The storefront must render even if Supabase is unreachable or the schema has
 * not been loaded yet, so reads fall back to the bundled seed data and log the
 * reason rather than throwing a 500 at a visitor.
 */
async function seedFallback(): Promise<Product[]> {
  const { products } = await import("@/data/products");
  return products;
}

// ------------------------------------------------------------------ products

export async function listProducts(): Promise<Product[]> {
  if (!supabaseConfigured) return seedFallback();

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[store] listProducts:", error.message);
    return seedFallback();
  }
  return (data as ProductRow[]).map(toProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!supabaseConfigured) {
    return (await seedFallback()).find((p) => p.id === id) ?? null;
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("[store] getProduct:", error.message);
    return (await seedFallback()).find((p) => p.id === id) ?? null;
  }
  return data ? toProduct(data as ProductRow) : null;
}

export async function createProduct(seed: ProductSeed): Promise<Product> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.from("products").insert(toRow(seed)).select().single();
  if (error) throw new Error(error.message);
  return toProduct(data as ProductRow);
}

export async function updateProduct(
  id: string,
  patch: Partial<ProductSeed>,
): Promise<Product | null> {
  const supabase = await getSupabase();
  const current = await getProduct(id);
  if (!current) return null;

  const merged = { ...current, ...patch, id } as ProductSeed;
  const { data, error } = await supabase
    .from("products")
    .update(toRow(merged))
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? toProduct(data as ProductRow) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = await getSupabase();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

// --------------------------------------------------------------------- leads

export async function listLeads(): Promise<Lead[]> {
  if (!supabaseConfigured) return [];

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[store] listLeads:", error.message);
    return [];
  }
  return (data as LeadRow[]).map(toLead);
}

export async function createLead(
  input: Omit<Lead, "id" | "status" | "createdAt">,
): Promise<Lead | null> {
  if (!supabaseConfigured) return null;

  const supabase = await getSupabase();
  const { data, error } = await supabase.from("leads").insert(input).select().single();

  if (error) {
    console.error("[store] createLead:", error.message);
    return null;
  }
  return toLead(data as LeadRow);
}

export async function setLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  const supabase = await getSupabase();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

export async function deleteLead(id: string): Promise<boolean> {
  const supabase = await getSupabase();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

// ------------------------------------------------------------------ overview

export async function overview() {
  const [products, leads] = await Promise.all([listProducts(), listLeads()]);
  const value = products.reduce((sum, p) => sum + p.price, 0);

  return {
    totalUnits: products.length,
    newUnits: products.filter((p) => p.condition === "New").length,
    usedUnits: products.filter((p) => p.condition === "Pre-Owned").length,
    onSpecial: products.filter((p) => p.special).length,
    inventoryValue: value,
    averagePrice: products.length ? Math.round(value / products.length) : 0,
    totalLeads: leads.length,
    newLeads: leads.filter((l) => l.status === "new").length,
    byCategory: Object.entries(
      products.reduce<Record<string, number>>((acc, p) => {
        acc[p.category] = (acc[p.category] ?? 0) + 1;
        return acc;
      }, {}),
    )
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count),
  };
}
