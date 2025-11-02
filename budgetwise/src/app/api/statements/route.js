import { NextResponse } from 'next/server';
import supabase from '../../../../../lib/helpers/DatabaseConnector';
import {
  getFileFromRequest,
  parseCSVFile,
  authenticateUser,
  uploadFileToStorage,
  insertStatementRecord,
  insertTransactions,
} from '../../../../../lib/helpers/uploadHelper';
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

export async function POST(req) {
  try {
    const file = await getFileFromRequest(req);
    const parsedTransactions = await parseCSVFile(file);
    const user = await authenticateUser();
    const fileData = await uploadFileToStorage(file, user.id);
    const statement = await insertStatementRecord(fileData, user.id);
    await insertTransactions(parsedTransactions, user.id, statement.id);

    return NextResponse.json({
      message: "✅ File uploaded successfully",
      file: {
        name: fileData.fileName,
        path: fileData.filePath,
        transactions: parsedTransactions,
      },
    });
  } catch (err) {
    console.error("❌ Unhandled Error:", err);
    return NextResponse.json(
      { error: err.message || "Unexpected error occurred" },
      { status: 500 }
    );
  }
}