import "server-only";
import { getSupabase, supabaseConfigured } from "@/lib/supabase/server";

/**
 * Admin authentication, backed by Supabase Auth.
 *
 * The session lives in Supabase's own httpOnly cookies, which means the same
 * identity is what Postgres sees: every query the console makes runs as this
 * user, and Row Level Security decides what it may touch. There is no separate
 * app-level credential any more.
 *
 * Operators are ordinary Supabase users. Create them in
 * Dashboard -> Authentication -> Users. Signup is not exposed anywhere in the
 * app, so the only accounts that exist are ones you add deliberately.
 */

export type AdminSession = { email: string; userId: string };

export async function signIn(email: string, password: string) {
  if (!supabaseConfigured) {
    return { ok: false as const, error: "Supabase is not configured on this deployment." };
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error || !data.user) {
    // Supabase already rate-limits this endpoint, and its message does not
    // reveal whether the address exists.
    return { ok: false as const, error: error?.message ?? "Those credentials don't match an account." };
  }

  return { ok: true as const };
}

export async function getSession(): Promise<AdminSession | null> {
  if (!supabaseConfigured) return null;

  const supabase = await getSupabase();
  // getUser() revalidates against the auth server rather than trusting the
  // cookie contents, which is what makes this safe to gate the console on.
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;
  return { email: data.user.email ?? "", userId: data.user.id };
}

export async function signOut() {
  if (!supabaseConfigured) return;
  const supabase = await getSupabase();
  await supabase.auth.signOut();
}
