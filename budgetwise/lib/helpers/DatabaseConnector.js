/**
 * Supabase Client Configuration
 *
 * This module initializes and exports the Supabase client instance
 * used throughout the application. It automatically loads the Supabase
 * URL and API key from environment variables, supporting both
 * browser (`NEXT_PUBLIC_*`) and server (`SUPABASE_*`) runtime contexts.
 *
 * Environment Variables Required:
 * - `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`
 * - `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `SUPABASE_KEY`
 *
 * Throws an error if these environment variables are not found, ensuring
 * that the client cannot be created without proper configuration.
 *
 * Usage:
 * ```js
 * import supabase from '@/lib/supabase';
 * const { data, error } = await supabase.from('table').select('*');
 * ```
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are missing');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
