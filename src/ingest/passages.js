const DEFAULT_MAX_CHARS = 3000
const HEADING = /^#{1,6}\s/

// Blocks are separated by blank lines. A blank line inside a $$ formula does not end the block.
function toBlocks(text) {
  const blocks = []
  let lines = []
  let inMath = false
  const flush = () => {
    if (lines.length) blocks.push(lines.join('\n'))
    lines = []
  }
  for (const line of text.split('\n')) {
    if (!inMath && !line.trim()) {
      flush()
      continue
    }
    if (!inMath && HEADING.test(line)) flush()
    lines.push(line)
    if (line.split('$$').length % 2 === 0) inMath = !inMath
  }
  flush()
  return blocks
}

const isProtected = (block) => block.includes('$$') || block.split('\n').every((line) => line.trim().startsWith('|'))

function splitLong(block, maxChars) {
  const pieces = []
  let current = ''
  for (const sentence of block.split(/(?<=[.!?。؟])\s+/)) {
    for (let start = 0; start < sentence.length; start += maxChars) {
      const part = sentence.slice(start, start + maxChars)
      if (current && current.length + 1 + part.length > maxChars) {
        pieces.push(current)
        current = ''
      }
      current = current ? `${current} ${part}` : part
    }
  }
  if (current) pieces.push(current)
  return pieces
}

const splitBlock = (block, maxChars) =>
  block.length > maxChars && !isProtected(block) ? splitLong(block, maxChars) : [block]

function chunkText(text, maxChars) {
  const chunks = []
  let current = ''
  for (const block of toBlocks(text).flatMap((b) => splitBlock(b, maxChars))) {
    const startsSection = HEADING.test(block) && current.length >= maxChars / 3
    if (current && (current.length + 2 + block.length > maxChars || startsSection)) {
      chunks.push(current)
      current = ''
    }
    current = current ? `${current}\n\n${block}` : block
  }
  if (current) chunks.push(current)
  return chunks
}

// Tables and $$ formulas are never split, even when they are longer than `maxChars`.
export function chunkPassages(pages, { maxChars = DEFAULT_MAX_CHARS } = {}) {
  const passages = []
  for (const page of pages) {
    const chunks = chunkText(page.text.trim(), maxChars)
    chunks.forEach((text, index) => {
      passages.push({
        id: `p${passages.length + 1}`,
        label: chunks.length > 1 ? `${page.label} (${index + 1}/${chunks.length})` : page.label,
        page: page.page ?? null,
        text,
        source: page.source ?? 'text',
      })
    })
  }
  return passages
}
