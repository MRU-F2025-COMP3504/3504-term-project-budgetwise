import { NextResponse } from 'next/server';
import { getTransactions } from '../../../BackEnd/api/transactions';

// GET /api/transactions
export async function GET() {
  try {
    const { Transactions } = await getTransactions();
    return NextResponse.json({ Transactions });
  } catch (err) {
    console.error('❌ Error fetching transactions:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/transactions

// UPDATE /api/transactions
