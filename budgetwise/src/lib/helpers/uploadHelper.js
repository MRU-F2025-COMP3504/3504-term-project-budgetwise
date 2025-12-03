import { parseTransactionsCSV } from "./CsvParser";

// Get file from the form data
export async function getFileFromRequest(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file) throw new Error("No file uploaded");
  return file;
}

// Parse CSV file into transaction data
export async function parseCSVFile(file) {
  const csvText = await file.text();
  return parseTransactionsCSV(csvText);
}

// Authenticate Supabase user
// Note: Authentication is handled in the API route, not here.

// 1. Upload File to Storage
// We save the actual CSV file to Supabase Storage (like an S3 bucket).
// We use the user's ID as a folder name to keep things organized.
export async function uploadFileToStorage(supabaseClient, file, userId) {
  const fileName = file.name.replace(/\s+/g, "_");
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("BankStatements")
    .upload(filePath, file, {
      contentType: "text/csv",
      upsert: true,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = await supabaseClient.storage
    .from("BankStatements")
    .getPublicUrl(filePath);

  return {
    fileName,
    filePath,
    publicUrl: publicUrlData.publicUrl,
  };
}

// Insert record into "Statements" table
export async function insertStatementRecord(supabaseClient, fileData, userId) {
  const { fileName, filePath, publicUrl } = fileData;

  const { data, error } = await supabaseClient
    .from("Statements")
    .insert([
      {
        file_name: fileName,
        file_path: filePath,
        user_id: userId,
        public_url: publicUrl,
      },
    ])
    .select();

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error(
      "Statement record created but no data returned. Check RLS policies."
    );
  }
  return data[0];
}

// Insert parsed transactions into "Transactions" table
export async function insertTransactions(
  supabaseClient,
  transactions,
  userId,
  statementId
) {
  const formatted = transactions.map((tx) => ({
    transaction_date: tx.transaction_date,
    description: tx.description,
    amount: tx.amount,
    type: tx.direction,
    category: tx.category,
    user_id: userId,
    statement_id: statementId,
  }));

  const { error } = await supabaseClient.from("Transactions").insert(formatted);
  if (error) throw new Error(error.message);
}
