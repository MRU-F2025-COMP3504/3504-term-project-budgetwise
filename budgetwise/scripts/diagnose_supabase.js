const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
console.log("Loading env from:", envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("Error loading .env.local:", result.error);
} else {
  console.log("Loaded env keys:", Object.keys(result.parsed));
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY;

if (!url || !key) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

async function checkTable(tableName) {
  const { data, error } = await supabase.from(tableName).select('*').limit(1);
  if (error) {
    console.log(`❌ Table '${tableName}': Error - ${error.message}`);
  } else {
    console.log(`✅ Table '${tableName}': Exists (Access OK)`);
  }
}

async function main() {
  console.log("Checking Supabase tables...");
  await checkTable('User_Profile');
  await checkTable('user_profile');
  await checkTable('Statements');
  await checkTable('statements');
  await checkTable('Transactions');
  await checkTable('transactions');
}

main();
