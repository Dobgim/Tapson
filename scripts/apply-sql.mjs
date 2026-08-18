/**
 * Applies SQL files to the linked Supabase project over a direct Postgres
 * connection.
 *
 * The connection string comes from supabase/.temp/pooler-url, written by
 * `supabase link`. Nothing here prints the credential.
 *
 * Usage: node scripts/apply-sql.mjs supabase/schema.sql [more.sql ...]
 */
import { readFileSync } from "node:fs";
import pg from "pg";

const files = process.argv.slice(2);
if (!files.length) {
  console.error("usage: node scripts/apply-sql.mjs <file.sql> [...]");
  process.exit(1);
}

let url;
try {
  url = readFileSync("supabase/.temp/pooler-url", "utf8").trim();
} catch {
  console.error("No supabase/.temp/pooler-url — run `supabase link` first.");
  process.exit(1);
}

if (/\[YOUR-PASSWORD\]|\[password\]/i.test(url)) {
  console.error("pooler-url holds a placeholder, not a real password.");
  process.exit(2);
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
  // The pooler can be slow to accept the first connection after idle.
  connectionTimeoutMillis: 30_000,
  statement_timeout: 120_000,
});

try {
  await client.connect();
  const who = await client.query("select current_database() db, current_user usr");
  console.log(`connected: ${who.rows[0].db} as ${who.rows[0].usr}`);
} catch (err) {
  console.error(`connect failed: ${err.message}`);
  process.exit(3);
}

let failed = false;
for (const file of files) {
  const sql = readFileSync(file, "utf8");
  process.stdout.write(`applying ${file} ... `);
  try {
    await client.query(sql);
    console.log("ok");
  } catch (err) {
    failed = true;
    console.log("FAILED");
    console.error(`   ${err.message}`);
    if (err.position) console.error(`   at character ${err.position}`);
    break;
  }
}

await client.end();
process.exit(failed ? 1 : 0);
