/**
 * Emits supabase/seed.sql from the in-repo seed data, by reading it back out
 * of the running dev server. Run once; the SQL it writes is what gets loaded
 * into Supabase.
 *
 * Usage: node scripts/gen-seed.mjs [baseUrl]
 */
import { writeFileSync, mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3200";
const res = await fetch(`${base}/api/seed-dump`);
if (!res.ok) throw new Error(`seed-dump returned ${res.status}`);
const { products, locations } = await res.json();

/** Single-quoted SQL literal, or NULL. */
const q = (v) => (v === undefined || v === null || v === "" ? "NULL" : `'${String(v).replace(/'/g, "''")}'`);
const n = (v) => (v === undefined || v === null || Number.isNaN(v) ? "NULL" : String(v));
const b = (v) => (v ? "true" : "false");
/** text[] literal. */
const arr = (items) =>
  items && items.length
    ? `ARRAY[${items.map((i) => q(i)).join(", ")}]::text[]`
    : `'{}'::text[]`;
/** jsonb literal. */
const json = (v) => `${q(JSON.stringify(v ?? []))}::jsonb`;

const lines = [];
lines.push("-- ===========================================================================");
lines.push("--  Repossessed Rides — seed data");
lines.push("--  Run AFTER schema.sql. Idempotent: re-running refreshes every row.");
lines.push("-- ===========================================================================");
lines.push("");

lines.push("-- ------------------------------------------------------- locations ----");
locations.forEach((l, i) => {
  lines.push(
    `insert into public.locations (id, name, street, city, region, postal_code, phone, phone_href, email, lat, lng, specialties, sort_order) values (` +
      [
        q(l.id), q(l.name), q(l.street), q(l.city), q(l.region), q(l.postalCode),
        q(l.phone), q(l.phoneHref), q(l.email),
        n(l.geo?.lat), n(l.geo?.lng), arr(l.specialties), n(i),
      ].join(", ") +
      `)\non conflict (id) do update set name = excluded.name, street = excluded.street, city = excluded.city, region = excluded.region, postal_code = excluded.postal_code, phone = excluded.phone, phone_href = excluded.phone_href, email = excluded.email, lat = excluded.lat, lng = excluded.lng, specialties = excluded.specialties, sort_order = excluded.sort_order;`,
  );
});
lines.push("");

lines.push("-- -------------------------------------------------------- products ----");
for (const p of products) {
  lines.push(
    `insert into public.products (id, year, make, model, trim, category, condition, price, msrp, usage_value, usage_unit, location_id, stock_number, color, description, specifications, features, images, featured, special) values (` +
      [
        q(p.id), n(p.year), q(p.make), q(p.model), q(p.trim), q(p.category),
        q(p.condition), n(p.price), n(p.msrp),
        n(p.usage?.value), q(p.usage?.unit),
        q(p.locationId), q(p.stockNumber), q(p.color), q(p.description),
        json(p.specifications), arr(p.features), arr(p.images),
        b(p.featured), b(p.special),
      ].join(", ") +
      `)\non conflict (id) do update set year = excluded.year, make = excluded.make, model = excluded.model, trim = excluded.trim, category = excluded.category, condition = excluded.condition, price = excluded.price, msrp = excluded.msrp, usage_value = excluded.usage_value, usage_unit = excluded.usage_unit, location_id = excluded.location_id, stock_number = excluded.stock_number, color = excluded.color, description = excluded.description, specifications = excluded.specifications, features = excluded.features, images = excluded.images, featured = excluded.featured, special = excluded.special;`,
  );
}
lines.push("");

mkdirSync("supabase", { recursive: true });
writeFileSync("supabase/seed.sql", lines.join("\n") + "\n", "utf8");
console.log(`seed.sql written — ${locations.length} locations, ${products.length} products`);
