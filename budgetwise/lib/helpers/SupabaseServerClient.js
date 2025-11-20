import { createClient } from '@supabase/supabase-js';

/**
 * Creates a per-request Supabase client that respects the caller's access token.
 * Use this in API routes to ensure Row Level Security (RLS) evaluates for
 * the authenticated user rather than the anonymous role.
 *
 * @param {string|null} accessToken - The Supabase JWT access token for the user
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createServerSupabaseClient(accessToken) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY;

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are missing');
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  });
}
