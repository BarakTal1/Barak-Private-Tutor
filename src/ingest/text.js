import { ParseError } from './errors.js'
import { htmlToMarkdown } from './html.js'
import { rowsToMarkdown } from './table.js'

const LEGACY_ENCODINGS = [
  { label: 'windows-1255', letters: /[א-ת]/g },
  { label: 'windows-1256', letters: /[ء-ي]/g },
]
const MAX_NUL_SHARE = 0.005

function decodeBytes(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder('utf-16le').decode(bytes)
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder('utf-16be').decode(bytes)
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    // Not UTF-8. Old Hebrew and Arabic school files often use a Windows code page.
    for (const { label, letters } of LEGACY_ENCODINGS) {
      const text = new TextDecoder(label).decode(bytes)
      const share = (text.match(letters) ?? []).length / Math.max(1, (text.match(/\p{L}/gu) ?? []).length)
      if (share > 0.3) return text
    }
    return new TextDecoder('windows-1252').decode(bytes)
  }
}

function decode(buffer) {
  const text = decodeBytes(new Uint8Array(buffer))
  const nulls = (text.match(/\u0000/g) ?? []).length
  if (nulls / Math.max(1, text.length) > MAX_NUL_SHARE) {
    throw new ParseError('corrupt', 'The file is not a text file.')
  }
  return text
}

function parseCsv(text) {
  const firstLine = text.split('\n', 1)[0]
  const delimiter = [',', '\t', ';'].reduce((best, d) =>
    firstLine.split(d).length > firstLine.split(best).length ? d : best,
  )
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') cell += text[i++]
      else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"') quoted = true
    else if (ch === delimiter) {
      row.push(cell)
      cell = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += ch
  }
  row.push(cell)
  rows.push(row)
  return rows
}

function prettyJson(text) {
  try {
    return JSON.stringify(JSON.parse(text), null, 2)
  } catch {
    return text
  }
}

// `kind` is the kind from detectKind: txt, md, csv, json, html, xml, tex or code.
export async function readTextFile(file, kind) {
  const text = decode(await file.arrayBuffer())
  let body = text
  let warnings = []
  if (kind === 'csv') ({ text: body, warnings } = rowsToMarkdown(parseCsv(text)))
  else if (kind === 'json') body = prettyJson(text)
  else if (kind === 'html') body = htmlToMarkdown(text)
  body = body.trim()
  if (!body) return { pages: [], warnings }
  return { pages: [{ page: null, label: file.name, text: body }], warnings }
}
