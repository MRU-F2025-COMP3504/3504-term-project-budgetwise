export function ParseCSV(csvString) {
  const lines = csvString.trim().split('\n');
  const headers = lines[0].split(',');

  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    const entry = {};
    headers.forEach((header, index) => {

      // Convert Amount and Balance to numbers
      if (header === 'Amount' || header === 'Balance') {
        entry[header] = parseFloat(values[index]);
      } else {
        entry[header] = values[index];
      }
    });
    return entry;
  });

  return data;
}
