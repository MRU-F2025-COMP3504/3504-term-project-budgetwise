import { NextResponse } from 'next/server';
import supabase from '../../../helpers/databaseConnector';

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

// UPDATE /api/transactions
