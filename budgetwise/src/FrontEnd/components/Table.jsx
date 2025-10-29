export default function Table({ columns, rows, keyField = 'id', emptyText = 'No data' }) {
  return (
    <div className="bw-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-surface-2)] text-left">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium text-[var(--color-text-muted)]">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows && rows.length > 0 ? (
              rows.map((row, idx) => (
                <tr key={row[keyField] ?? idx} className="border-t border-white/10">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-center text-[var(--color-text-muted)]" colSpan={columns.length}>
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
