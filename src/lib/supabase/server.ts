import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** False when the env vars are absent, so callers can degrade instead of throw. */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Request-scoped Supabase client.
 *
 * Auth state lives in cookies, so every query made through this client runs as
 * whoever is signed in — anonymous visitors on the storefront, the signed-in
 * operator inside the console. Row Level Security does the rest.
 *
 * `setAll` is wrapped in try/catch because Server Components are not allowed to
 * write cookies; in that context the middleware/route handler refreshes them.
 */
export async function getSupabase() {
  const store = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) {
            store.set(name, value, options);
          }
        } catch {
          // Read-only cookie context (Server Component) — safe to ignore.
        }
      },
    },
  });
}
