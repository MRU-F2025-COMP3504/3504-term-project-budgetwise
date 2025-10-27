import { NextResponse } from 'next/server';
import supabase from '@/helpers/databaseConnector';

export async function POST(req) {
  try {
    const body = await req.json();

    const { data: userData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'test1@gmail.com',
    password: '12345',
    });

    let { data: Transactions, error } = await supabase
    .from('Transactions')
    .select('*')

    return NextResponse.json({ Transactions});
  } catch (err) {
    console.error('❌ Error processing CSV:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
