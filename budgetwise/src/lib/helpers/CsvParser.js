import { categorizeTransaction } from "./CategorizeTransactions";

/**
 * Parses a CSV string into a list of transaction objects.
 * It handles different delimiters (comma, tab, semicolon) and tries to
 * figure out which column is which.
 */

export function parseTransactionsCSV(csvText) {
  if (!csvText) return [];

  // --- Split lines safely ---
  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim() !== "");

  if (lines.length === 0) return [];

  // --- Auto-detect delimiter (tab, comma, or semicolon) ---
  const firstLine = lines[0];
  const delimiter = firstLine.includes("\t")
    ? "\t"
    : firstLine.includes(";")
      ? ";"
      : ",";

  // --- Parse line ---
  function parseCSVLine(line) {
    // no quoted cells in your format, simple split works fine
    return line.split(delimiter).map((x) => x.trim());
  }

  // --- Optional: if the first row looks like a header, skip it ---
  const firstRow = parseCSVLine(firstLine);
  const hasHeader = /date|desc|withdraw|deposit|balance/i.test(
    firstRow.join("")
  );
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const cleanNumber = (str) =>
    parseFloat((str || "").replace(/[^0-9.-]/g, "")) || 0;

  // --- Parse rows ---
  return dataLines.map((line, i) => {
    const [date, description, withdraw, deposit, balance] = parseCSVLine(line);

    const withdrawAmt = cleanNumber(withdraw);
    const depositAmt = cleanNumber(deposit);
    const balanceAmt = cleanNumber(balance);

    let amount = 0;
    let direction = "OUTFLOW";

    if (depositAmt > 0 && withdrawAmt === 0) {
      amount = depositAmt;
      direction = "CREDIT";
    } else if (withdrawAmt > 0 && depositAmt === 0) {
      amount = -withdrawAmt;
      direction = "DEBIT";
    }

    const category = categorizeTransaction(description);

    return {
      id: (i + 1).toString(),
      transaction_date: date,
      description,
      amount,
      direction,
      iso_currency_code: "CAD",
      account_type: "depository",
      category,
      balance: balanceAmt,
    };
  });
}
