import { NextResponse } from 'next/server';
import { getStatements } from '../../../BackEnd/api/statements';

// GET /api/statements
export async function GET() {
  try {
    const { Transactions } = await getStatements();
    return NextResponse.json({ Transactions });
  } catch (err) {
    console.error('❌ Error processing statements:', err);
    const status = err.message?.toLowerCase().includes('auth') ? 401 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

// POST /api/statements

// UPDATE /api/statements