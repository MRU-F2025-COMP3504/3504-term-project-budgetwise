import { NextResponse } from 'next/server';
import supabase from '@/helpers/databaseConnector';
import { ParseCSV } from '@/helpers/StatementProcessor';

export async function POST(req) {
  try {
    const body = await req.json();
    const { data: statements, error: statementsError } = await supabase
      .from('Statements')
      .select('*');

    if (statementsError) return NextResponse.json({comment: "somthing wrong",error: statementsError.message }, { status: 500 });

    if (!statements || statements.length === 0)
      return NextResponse.json({ message: 'No statements found' }, { status: 404 });

      const { data: userData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'test1@gmail.com',
      password: '12345',
    });

    const statement_id = statements[0].id;

    const formatted = body.map((t) => ({
      description: t.Description || null,
      Amount: t.Amount || null,
      Type: t.Type || null,
      user_id: userData.user.id || null,
      statement_id: statement_id || null,
    }));

    console.log('📄 Processing file:', body);
   const { data, error } = await supabase
      .from('Transactions')
      .insert(formatted)
      .select();

    return NextResponse.json({ james:"hi" });
  } catch (err) {
    console.error('❌ Error processing CSV:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
 async function addTransactions(transactions, userId, statementId) {
  // transactions: array of parsed CSV objects
  const formatted = transactions.map((t) => ({
    description: t.Description || null,
    Amount: t.Amount || null,
    Type: t.Type || null,
    user_id: userId || null,
    statement_id: statementId || null,
  }));

  const { data, error } = await supabase
    .from('Transactions')
    .insert(formatted)
    .select(); // return inserted rows

  if (error) {
    console.error('Error inserting transactions:', error);
    throw new Error(error.message);
  }

  console.log('Inserted transactions:', data.length);
  return data;
}