export default function Table({ columns, rows, keyField = 'id', emptyText = 'No data' }) {
  const safeRows = Array.isArray(rows) ? rows : [];

  // Auto-generate columns from row keys if not provided
  const autoKeys = Array.from(
    safeRows.reduce((set, r) => {
      Object.keys(r || {}).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );

  const labelize = (key) =>
    key
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^\w|\s\w/g, (c) => c.toUpperCase());

  const isNumeric = (v) => typeof v === 'number' || (typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v)));
  const isDateish = (key, v) =>
    (typeof v === 'string' && !isNaN(Date.parse(v))) || /date|time|created|updated|period/i.test(key);
  const isCurrencyKey = (key) => /amount|total|balance|debit|credit/i.test(key);

  const currency = (n) => {
    const num = Number(n);
    return isNaN(num)
      ? String(n ?? '')
      : new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(num);
  };

  const colDefs = (columns && columns.length > 0
    ? columns
    : autoKeys.map((k) => ({ key: k, label: labelize(k) }))
  );

  const formatValue = (key, value) => {
    if (value == null) return '';
    if (isCurrencyKey(key) && isNumeric(value)) return currency(value);
    if (isDateish(key, value)) {
      try { return new Date(value).toLocaleString(); } catch { /* fallthrough */ }
    }
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="bw-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="bw-table min-w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-surface-2)] text-left">
              {colDefs.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium text-[var(--color-text-muted)] whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeRows.length > 0 ? (
              safeRows.map((row, idx) => (
                <tr key={row[keyField] ?? idx} className="border-t border-white/10 hover:bg-white/5">
                  {colDefs.map((col) => {
                    const raw = row[col.key];
                    const text = col.render ? col.render(raw, row) : formatValue(col.key, raw);
                    const rightAlign = isCurrencyKey(col.key) || isNumeric(raw);
                    const negative = isNumeric(raw) && Number(raw) < 0 && isCurrencyKey(col.key);
                    return (
                      <td
                        key={col.key}
                        className={`px-4 py-3 ${rightAlign ? 'text-right font-mono' : ''} ${negative ? 'text-[var(--color-danger)]' : ''}`}
                        title={typeof text === 'string' ? text : undefined}
                      >
                        {text}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-center text-[var(--color-text-muted)]" colSpan={colDefs.length}>
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
