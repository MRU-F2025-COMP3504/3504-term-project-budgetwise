import { NextResponse } from 'next/server';
import supabase from '../../../../../lib/helpers/DatabaseConnector';

// GET /api/transactions
export async function GET() {
  try {
    const { data: Transactions, error } = await supabase
      .from('Transactions')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ Transactions });
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
