import { createBrowserClient } from "@supabase/ssr";

// This client is for the browser (client-side React components).
// It uses public keys and is safe to use in `useEffect` or event handlers.

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are missing");
  }

  return createBrowserClient(url, anonKey);
}
