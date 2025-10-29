import supabase from "../../helpers/databaseConnector";

// Core handler logic for fetching transactions
export async function getTransactions() {
  const { data: Transactions, error } = await supabase
    .from("Transactions")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return { Transactions };
}
