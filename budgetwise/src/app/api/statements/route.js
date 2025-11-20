import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../lib/helpers/SupabaseServerClient';

/**
 * GET /api/statements
 * Returns all uploaded statements for authenticated user.
 * Response shape: { statements: Statement[] }
 */
import {
  getFileFromRequest,
  parseCSVFile,
  uploadFileToStorage,
  insertStatementRecord,
  insertTransactions,
} from '../../../../lib/helpers/uploadHelper';

// GET /api/statements
export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const s = createServerSupabaseClient(token);

    const { data: { user }, error: userErr } = await s.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: statements, error } = await s
      .from('Statements')
      .select('*')
      .eq('user_id', user.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ statements });
  } catch (err) {
    console.error('❌ Error processing statements:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const s = createServerSupabaseClient(token);

    const { data: { user }, error: userErr } = await s.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const file = await getFileFromRequest(req);
    const parsedTransactions = await parseCSVFile(file);
    const fileData = await uploadFileToStorage(s, file, user.id);
    const statement = await insertStatementRecord(s, fileData, user.id);
    await insertTransactions(s, parsedTransactions, user.id, statement.id);

    return NextResponse.json({
      message: "✅ File uploaded successfully",
      statement: {
        fileName: fileData.fileName,
        filePath: fileData.filePath,
        publicUrl: fileData.publicUrl,
        transactionsImported: parsedTransactions.length,
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