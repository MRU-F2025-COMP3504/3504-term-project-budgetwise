import { parseTransactionsCSV } from "../lib/helpers/CsvParser.js";
import { categorizeTransaction } from "../lib/helpers/CategorizeTransactions.js";

jest.mock("../lib/helpers/CategorizeTransactions.js", () => ({
  categorizeTransaction: jest.fn(() => "MockCategory"),
}));

describe("parseTransactionsCSV - view output", () => {
  test("prints parsed transactions from fake CSV", () => {
    const fakeCsv = `date,description,withdraw,deposit,balance
2025-01-01,Paycheck,,3000,3000
2025-01-02,Coffee,5,,2995
2025-01-03,Transfer,,250,3245`;

    const result = parseTransactionsCSV(fakeCsv);

    console.log("✅ Parsed transactions:\n", result);

    // You can also verify the structure
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty("transaction_date");
    expect(result[0]).toHaveProperty("amount");
    expect(result[0]).toHaveProperty("category");
    expect(result[0]).toHaveProperty("balance");

  });
});
