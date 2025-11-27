import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/helpers/supabaseSSRClient';

/**
 * GET /api/user/me
 * Simple health endpoint to verify auth wiring.
 * Returns 200 with { user } when authenticated, else 401.
 */
export async function GET(req) {
  try {
    const s = await getSupabaseServerClient();

    const { data: { user }, error } = await s.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
