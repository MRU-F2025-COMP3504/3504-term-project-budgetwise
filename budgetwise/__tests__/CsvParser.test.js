import fs from "fs";
import path from "path";
import { parseTransactionsCSV } from "../lib/helpers/CsvParser.js";

describe("parseTransactionsCSV with real CSV files", () => {
  const testDataDir = path.join(__dirname, "testdata");

  test("parses good.csv correctly", () => {
    const csvText = fs.readFileSync(path.join(testDataDir, "good.csv"), "utf-8");
    const result = parseTransactionsCSV(csvText);
    console.table(result);
    expect(result.length).toBe(4);
    expect(result[0]).toHaveProperty("transaction_date");
    expect(result[0]).toHaveProperty("amount");
  });

  // somo one Do more test cases for different CSV files
 
});
