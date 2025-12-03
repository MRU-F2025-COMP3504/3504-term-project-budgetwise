import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/helpers/supabaseSSRClient";

/**
 * GET /api/transactions
 * Returns all transactions for the authenticated user.
 * Response shape: { transactions: Transaction[] }
 */
// GET /api/transactions
export async function GET(req) {
  try {
    const s = await getSupabaseServerClient();

    // 1. Authenticate the user
    // We need to make sure the user is logged in to see their transactions.
    const {
      data: { user },
      error: userErr,
    } = await s.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Fetch Transactions
    // We grab all the transactions for this user, ordered by date (newest first).
    // We also include the name of the statement file they came from.
    const { data: transactions, error } = await s
      .from("Transactions")
      .select("*, Statements(file_name)")
      .eq("user_id", user.id)
      .order("transaction_date", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ transactions });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
