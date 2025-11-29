import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/helpers/supabaseSSRClient';

/**
 * GET /api/transactions
 * Returns all transactions for the authenticated user.
 * Response shape: { transactions: Transaction[] }
 */
// GET /api/transactions
export async function GET(req) {
  try {
    const s = await getSupabaseServerClient();

    const { data: { user }, error: userErr } = await s.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: transactions, error } = await s
      .from('Transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ transactions });
  } catch (err) {
    console.error('❌ Error fetching transactions:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/transactions
function POST(req) {
  return NextResponse.json({ message: "POST /api/transactions not yet implemented" }, { status: 501 });
}
// UPDATE /api/transactions
