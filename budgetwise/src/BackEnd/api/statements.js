import supabase from "../../helpers/databaseConnector";

// Core handler logic for fetching statements
export async function getStatements() {
  // NOTE: This demo uses a hard-coded sign-in. Replace with real auth/session.
  const { data: userData, error: loginError } = await supabase.auth.signInWithPassword({
    email: "test1@gmail.com",
    password: "12345",
  });

  if (loginError) {
    throw new Error(loginError.message);
  }

  const { data: Transactions, error } = await supabase
    .from("Statements")
    .select("*")
    .eq("user_id", userData.user.id);

  if (error) {
    throw new Error(error.message);
  }

  return { Transactions };
}
