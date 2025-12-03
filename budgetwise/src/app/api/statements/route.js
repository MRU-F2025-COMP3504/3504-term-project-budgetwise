import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/helpers/supabaseSSRClient";

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
} from "@/lib/helpers/uploadHelper";

// GET /api/statements
export async function GET(req) {
  try {
    const s = await getSupabaseServerClient();

    // 1. Authenticate the user
    // We need to make sure the user is logged in to see their statements.
    const {
      data: { user },
      error: userErr,
    } = await s.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Fetch Statements
    // We grab all the statement records from the database for this user.
    const { data: statements, error } = await s
      .from("Statements")
      .select("*")
      .eq("user_id", user.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ statements });
  } catch (err) {
    console.error("Error processing statements:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const s = await getSupabaseServerClient();

    // 1. Authenticate the user
    const {
      data: { user },
      error: userErr,
    } = await s.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Process the File
    // We take the uploaded file, read it, and turn it into a list of transactions.
    const file = await getFileFromRequest(req);
    const parsedTransactions = await parseCSVFile(file);

    // 3. Save to Storage
    // We upload the actual file to Supabase Storage so we can download it later.
    const fileData = await uploadFileToStorage(s, file, user.id);

    // 4. Save to Database
    // We create a record in the 'Statements' table and then add all the transactions.
    const statement = await insertStatementRecord(s, fileData, user.id);
    await insertTransactions(s, parsedTransactions, user.id, statement.id);

    return NextResponse.json({
      message: "File uploaded successfully",
      statement: {
        fileName: fileData.fileName,
        filePath: fileData.filePath,
        publicUrl: fileData.publicUrl,
        transactionsImported: parsedTransactions.length,
      },
    });
  } catch (err) {
    console.error("Unhandled Error:", err);
    return NextResponse.json(
      { error: err.message || "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
