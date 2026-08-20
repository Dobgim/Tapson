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
    // Uploaded photos win. Only fall back to the bundled artwork naming for
    // the seeded units, which have no Storage objects behind them.
    images:
      seed.images && seed.images.length
        ? seed.images
        : [1, 2, 3].map((n) => `/images/products/${seed.id}-${n}.webp`),
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
  // No .select() here. Reading a lead back requires the staff-only SELECT
  // policy, and this runs as the anonymous visitor submitting the form — the
  // read would be refused and take the whole insert down with it. Everything
  // the caller needs is already in hand.
  const { error } = await supabase.from("leads").insert(input);

  if (error) {
    console.error("[store] createLead:", error.message);
    return null;
  }
  return {
    ...input,
    id: `lead-${Date.now()}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };
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

// -------------------------------------------------------------------- orders

export type OrderStatus = "awaiting_payment" | "paid" | "fulfilled" | "cancelled";

export type Order = {
  id: string;
  reference: string;
  productId: string | null;
  productTitle: string;
  productImage: string | null;
  stockNumber: string | null;
  unitPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  delivery: string;
  address: string;
  paymentMethod: string;
  notes: string;
  status: OrderStatus;
  createdAt: string;
};

type OrderRow = {
  id: string;
  reference: string;
  product_id: string | null;
  product_title: string;
  product_image: string | null;
  stock_number: string | null;
  unit_price: string | number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery: string;
  address: string;
  payment_method: string;
  notes: string;
  status: OrderStatus;
  created_at: string;
};

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    reference: row.reference,
    productId: row.product_id,
    productTitle: row.product_title,
    productImage: row.product_image,
    stockNumber: row.stock_number,
    unitPrice: num(row.unit_price),
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    delivery: row.delivery,
    address: row.address,
    paymentMethod: row.payment_method,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function createOrder(input: {
  reference: string;
  productId: string | null;
  productTitle: string;
  productImage: string | null;
  stockNumber: string | null;
  unitPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  delivery: string;
  address: string;
  paymentMethod: string;
  notes: string;
}): Promise<Order | null> {
  if (!supabaseConfigured) return null;

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      reference: input.reference,
      product_id: input.productId,
      product_title: input.productTitle,
      product_image: input.productImage,
      stock_number: input.stockNumber,
      unit_price: input.unitPrice,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone,
      delivery: input.delivery,
      address: input.address,
      payment_method: input.paymentMethod,
      notes: input.notes,
    });

  if (error) {
    console.error("[store] createOrder:", error.message);
    return null;
  }
  // Built from the input rather than read back, for the same reason as
  // createLead: an order is staff-only to read, and this runs as the
  // anonymous customer placing it.
  return {
    id: input.reference,
    reference: input.reference,
    productId: input.productId,
    productTitle: input.productTitle,
    productImage: input.productImage,
    stockNumber: input.stockNumber,
    unitPrice: input.unitPrice,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    delivery: input.delivery,
    address: input.address,
    paymentMethod: input.paymentMethod,
    notes: input.notes,
    status: "awaiting_payment",
    createdAt: new Date().toISOString(),
  };
}

export async function listOrders(): Promise<Order[]> {
  if (!supabaseConfigured) return [];

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[store] listOrders:", error.message);
    return [];
  }
  return (data as OrderRow[]).map(toOrder);
}

export async function setOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  const supabase = await getSupabase();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const supabase = await getSupabase();
  const { error } = await supabase.from("orders").delete().eq("id", id);
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
