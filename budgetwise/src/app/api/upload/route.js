import { NextResponse } from 'next/server';
import supabase from '@/helpers/databaseConnector';
import { ParseCSV } from '@/helpers/StatementProcessor';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = `Bankusers/${file.name}`;


    // Use service role key for server-side auth
    const { error: uploadError } = await supabase.storage
      .from('BankStatements')
      .upload(filePath, buffer, { upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: userData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'test1@gmail.com',
      password: '12345',
    });

    if (loginError || !userData.user) {
      return NextResponse.json({ error: loginError?.message || 'Login failed' }, { status: 401 });
    }

    const { error: insertError } = await supabase
      .from('Statements')
      .insert([
        { file_path: filePath, user_id: userData.user.id },
      ])
      .select();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, filename: file.name });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
