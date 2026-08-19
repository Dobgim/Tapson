"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client, used for direct-to-Storage uploads.
 *
 * Uploading through the browser keeps large phone photos off the server
 * entirely — a Server Action would have to buffer every file in memory and
 * would run into request body limits on Vercel. The signed-in operator's
 * session travels with the request, so Storage RLS still applies.
 */
export function getBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export const PRODUCT_BUCKET = "product-images";
