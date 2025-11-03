import fs from "fs";
import path from "path";
import { parseTransactionsCSV } from "../lib/helpers/CsvParser.js";
import { categorizeTransaction } from "../lib/helpers/CategorizeTransactions.js";

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

  test("handles bad.csv gracefully", () => {
    const csvText = fs.readFileSync(path.join(testDataDir, "bad.csv"), "utf-8");
    const result = parseTransactionsCSV(csvText);
    console.table(result);
    expect(Array.isArray(result)).toBe(true);
    expect(result[1]).toBeUndefined(); // bad line skipped
    expect(result.length).toBeGreaterThan(0); // skips bad lines
  });

  test("detects duplicates in duplicate.csv", () => {
    const csvText = fs.readFileSync(path.join(testDataDir, "duplicate.csv"), "utf-8");
    const result = parseTransactionsCSV(csvText);
    console.table(result);
    // Optional: add deduplication logic test if implemented
    expect(result.length).toBe(4); // or fewer if you filter duplicates
  });
});
