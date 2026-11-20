// Shared CSV serialiser.
// RFC 4180 quoting plus formula-injection neutralisation (ASVS 5.0.0 1.2.10).

const FORMULA_TRIGGERS = ['=', '+', '-', '@', '\t', '\r', '\0'];

function neutraliseFormula(value) {
  return FORMULA_TRIGGERS.some((ch) => value.startsWith(ch)) ? `'${value}` : value;
}

function escapeCell(raw) {
  if (raw === null || raw === undefined) return '';
  const value = neutraliseFormula(String(raw));
  return /[",\r\n']/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/**
 * Serialises rows to CSV using only the listed columns, in order.
 */
function toCsv(rows, columns) {
  const header = columns.map(escapeCell).join(',');
  const body = rows.map((row) => columns.map((col) => escapeCell(row[col])).join(','));
  return [header, ...body].join('\r\n') + '\r\n';
}

module.exports = { toCsv, escapeCell };
