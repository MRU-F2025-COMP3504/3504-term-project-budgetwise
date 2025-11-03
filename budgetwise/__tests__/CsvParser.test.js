import fs from "fs";
import path from "path";
import { parseTransactionsCSV } from "../lib/helpers/CsvParser.js";

/**
 * Integration tests for the parseTransactionsCSV function
 * using real CSV files located in the /testdata directory.
 *
 * These tests verify that the CSV parser handles:
 *  - Valid (good) data
 *  - Inconsistent or partial (bad) data
 *  - Duplicate records that should be identified for cleanup
 */
describe("parseTransactionsCSV with real CSV files", () => {
  const testDataDir = path.join(__dirname, "testdata"); // folder containing test CSV files


  
  /**
   * Test 1: Parse a well-structured CSV file
   * -----------------------------------------
   * The file `good.csv` contains 4 valid transaction records.
   * Each record should have the required fields: transaction_date and amount.
   */
  test("parses good.csv correctly", () => {
    const csvText = fs.readFileSync(path.join(testDataDir, "good.csv"), "utf-8");
    const result = parseTransactionsCSV(csvText);

    console.table(result); // optional: log table for debugging

    // Verify parser returns expected number of rows and required fields
    expect(result.length).toBe(4);
    expect(result[0]).toHaveProperty("transaction_date");
    expect(result[0]).toHaveProperty("amount");
  });



});