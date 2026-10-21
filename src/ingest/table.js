export const MAX_TABLE_ROWS = 200
export const MAX_TABLE_COLUMNS = 30

const cellText = (value) => String(value ?? '').replace(/\s+/g, ' ').trim().replace(/\|/g, '\\|')

// Turns rows (the first row is the header) into a Markdown table.
// Long tables are cut, and the cut is reported so the teacher is told.
export function rowsToMarkdown(rows) {
  const filled = rows.filter((row) => row.some((cell) => cellText(cell)))
  if (!filled.length) return { text: '', warnings: [] }
  const warnings = []
  const total = filled.length - 1
  const shownRows = filled.slice(0, MAX_TABLE_ROWS + 1)
  if (total > MAX_TABLE_ROWS) warnings.push({ code: 'rows_capped', params: { shown: MAX_TABLE_ROWS, total } })
  const width = Math.max(...shownRows.map((row) => row.length))
  const columns = Math.min(width, MAX_TABLE_COLUMNS)
  if (width > MAX_TABLE_COLUMNS) warnings.push({ code: 'columns_capped', params: { shown: MAX_TABLE_COLUMNS, total: width } })
  const line = (row) => `| ${Array.from({ length: columns }, (_, i) => cellText(row[i])).join(' | ')} |`
  const [header, ...body] = shownRows
  const separator = `| ${Array.from({ length: columns }, () => '---').join(' | ')} |`
  return { text: [line(header), separator, ...body.map(line)].join('\n'), warnings }
}
