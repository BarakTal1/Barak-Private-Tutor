import { rowsToMarkdown } from './table.js'

const SKIP = new Set(['script', 'style', 'head', 'noscript', 'template'])
const BLOCK = new Set([
  'html', 'body', 'p', 'div', 'section', 'article', 'main', 'header', 'footer', 'aside', 'nav',
  'blockquote', 'pre', 'figure', 'figcaption', 'dl', 'dt', 'dd', 'address', 'form', 'fieldset',
])

// Text of an inline element. A browser collapses source whitespace, and so does this.
function inlineText(node) {
  let text = ''
  for (const child of node.childNodes) {
    if (child.nodeType === 3) text += child.textContent.replace(/\s+/g, ' ')
    else if (child.nodeType === 1 && !SKIP.has(child.tagName.toLowerCase())) {
      text += child.tagName.toLowerCase() === 'br' ? '\n' : inlineText(child)
    }
  }
  return text
}

const tidy = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim()

function listToMarkdown(list) {
  const ordered = list.tagName.toLowerCase() === 'ol'
  return [...list.children]
    .filter((item) => item.tagName.toLowerCase() === 'li')
    .map((item, index) => `${ordered ? `${index + 1}.` : '-'} ${tidy(inlineText(item)).replace(/\n/g, ' ')}`)
    .join('\n')
}

function tableToMarkdown(table) {
  const rows = [...table.querySelectorAll('tr')]
    .filter((row) => row.closest('table') === table)
    .map((row) => [...row.children].filter((c) => /^t[dh]$/i.test(c.tagName)).map((c) => tidy(inlineText(c))))
  return rowsToMarkdown(rows).text
}

function collectBlocks(element) {
  const blocks = []
  let inline = ''
  const flush = () => {
    const text = tidy(inline)
    if (text) blocks.push(text)
    inline = ''
  }
  for (const node of element.childNodes) {
    if (node.nodeType === 3) {
      inline += node.textContent.replace(/\s+/g, ' ')
      continue
    }
    if (node.nodeType !== 1) continue
    const tag = node.tagName.toLowerCase()
    if (SKIP.has(tag)) continue
    if (tag === 'br') inline += '\n'
    else if (/^h[1-6]$/.test(tag)) {
      flush()
      const title = tidy(inlineText(node))
      if (title) blocks.push(`${'#'.repeat(Number(tag[1]))} ${title}`)
    } else if (tag === 'table') {
      flush()
      const table = tableToMarkdown(node)
      if (table) blocks.push(table)
    } else if (tag === 'ul' || tag === 'ol') {
      flush()
      blocks.push(listToMarkdown(node))
    } else if (BLOCK.has(tag)) {
      flush()
      blocks.push(...collectBlocks(node))
    } else inline += inlineText(node)
  }
  flush()
  return blocks
}

export function htmlToMarkdown(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return collectBlocks(doc.body).join('\n\n')
}
