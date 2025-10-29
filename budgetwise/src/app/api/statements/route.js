import { NextResponse } from 'next/server';
import supabase from '../../../helpers/databaseConnector';

// GET /api/statements
export async function GET() {
  try {
    // Demo auth – replace with real session handling
    const { data: userData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'test1@gmail.com',
      password: '12345',
    });

    if (loginError) {
      return NextResponse.json({ error: loginError.message }, { status: 401 });
    }

    const { data: Transactions, error } = await supabase
      .from('Statements')
      .select('*')
      .eq('user_id', userData.user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ Transactions });
  } catch (err) {
    console.error('❌ Error processing statements:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/statements

// UPDATE /api/statements