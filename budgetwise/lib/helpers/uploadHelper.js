import supabase from "./DatabaseConnector";
import { parseTransactionsCSV } from "./CsvParser";
import { getCurrentUser } from "./AuthHelper";
import { get } from "http";

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
export async function authenticateUser() {
  return await getCurrentUser();
}

// Upload file to Supabase Storage
export async function uploadFileToStorage(file, userId) {
  const fileName = file.name.replace(/\s+/g, "_");
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("BankStatements")
    .upload(filePath, file, {
      contentType: "text/csv",
      upsert: true,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = await supabase.storage
    .from("BankStatements")
    .getPublicUrl(filePath);

  return {
    fileName,
    filePath,
    publicUrl: publicUrlData.publicUrl,
  };
}

// Insert record into "Statements" table
export async function insertStatementRecord(fileData, userId) {
  const { fileName, filePath, publicUrl } = fileData;

  const { data, error } = await supabase
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
  return data[0];
}

// Insert parsed transactions into "Transactions" table
export async function insertTransactions(transactions, userId, statementId) {
  const formatted = transactions.map((tx) => ({
    transaction_date: tx.transaction_date,
    description: tx.description,
    amount: tx.amount,
    type: tx.direction,
    category: tx.category,
    user_id: userId,
    statement_id: statementId,
  }));

  const { error } = await supabase.from("Transactions").insert(formatted);
  if (error) throw new Error(error.message);
}
