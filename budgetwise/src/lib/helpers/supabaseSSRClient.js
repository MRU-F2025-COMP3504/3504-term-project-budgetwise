import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Returns a Supabase client for the server (API routes, Server Components).
 * It automatically handles cookies to keep the user logged in.
 */
export async function getSupabaseServerClient() {
  // Next.js 15: cookies() is async
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!url || !anonKey) {
    throw new Error(
      `Supabase env vars missing. url=${!!url} anonKey=${!!anonKey}`
    );
  }

  return createServerClient(url, anonKey, {
    cookies: {
      get(name) {
        try {
          return cookieStore.get(name)?.value;
        } catch (_) {
          return undefined;
        }
      },
      set(name, value, options) {
        try {
          // RequestCookies.set signature: set({ name, value, ...options })
          cookieStore.set({ name, value, ...options });
        } catch (_) {
          // ignore mutation errors (may occur in edge middleware restrictions)
        }
      },
      remove(name, options) {
        try {
          // Use delete for removal
          cookieStore.delete({ name, ...options });
        } catch (_) {
          // fallback: overwrite with maxAge 0 if delete unavailable
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          } catch (_) {}
        }
      },
    },
  });
}
