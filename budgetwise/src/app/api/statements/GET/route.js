import { NextResponse } from 'next/server';
import supabase from '../../../../helpers/databaseConnector';

export async function GET() {
  try {

    const { data: userData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'test1@gmail.com',
    password: '12345',
    });

    if (loginError) {
      return NextResponse.json({ error: loginError.message }, { status: 401 });
    }

    let { data: Transactions, error } = await supabase
    .from('Statements')
    .select('*')
    .eq('user_id', userData.user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }



    return NextResponse.json({ Transactions});
  } catch (err) {
    console.error('❌ Error processing CSV:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
