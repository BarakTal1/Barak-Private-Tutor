import JSZip from 'jszip'
import { ParseError } from './errors.js'
import { htmlToMarkdown } from './html.js'
import { chapterLabel, sheetLabel, slideLabel } from './labels.js'
import { rowsToMarkdown } from './table.js'

const corrupt = (what) => new ParseError('corrupt', `The file is not a valid ${what} file.`)

async function openZip(file, what) {
  try {
    return await JSZip.loadAsync(await file.arrayBuffer())
  } catch {
    throw corrupt(what)
  }
}

async function readXml(zip, path, what) {
  const entry = zip.file(path)
  if (!entry) throw corrupt(what)
  const doc = new DOMParser().parseFromString(await entry.async('string'), 'application/xml')
  if (doc.getElementsByTagName('parsererror').length) throw corrupt(what)
  return doc
}

const byTag = (node, tag) => [...node.getElementsByTagName(tag)]

// Path of `href` as seen from the folder `base` inside a zip file.
const resolvePath = (base, href) =>
  decodeURIComponent(new URL(href, `http://zip/${base}`).pathname.slice(1))

const folderOf = (path) => path.slice(0, path.lastIndexOf('/') + 1)

const textPage = (file, text) => (text.trim() ? [{ page: null, label: file.name, text: text.trim() }] : [])

// docx: mammoth converts the document to HTML, then the HTML becomes Markdown.
async function readDocx(file) {
  const zip = await openZip(file, 'Word')
  if (!zip.file('word/document.xml')) throw corrupt('Word')
  const { default: mammoth } = await import('mammoth/mammoth.browser.js')
  const { value } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() })
  return { pages: textPage(file, htmlToMarkdown(value)), warnings: [] }
}

const paragraphLines = (doc) =>
  byTag(doc, 'a:p')
    .map((p) => byTag(p, 'a:t').map((t) => t.textContent).join(''))
    .filter((line) => line.trim())

async function readPptx(file) {
  const zip = await openZip(file, 'PowerPoint')
  const slides = Object.keys(zip.files)
    .map((path) => /^ppt\/slides\/slide(\d+)\.xml$/.exec(path))
    .filter(Boolean)
    .map((match) => ({ number: Number(match[1]), path: match[0] }))
    .sort((a, b) => a.number - b.number)
  if (!slides.length) throw corrupt('PowerPoint')
  const pages = []
  for (const { number, path } of slides) {
    const lines = paragraphLines(await readXml(zip, path, 'PowerPoint'))
    const rels = zip.file(`ppt/slides/_rels/slide${number}.xml.rels`)
    if (rels) {
      const relsDoc = new DOMParser().parseFromString(await rels.async('string'), 'application/xml')
      const notes = byTag(relsDoc, 'Relationship').find((r) => /notesSlide/.test(r.getAttribute('Type')))
      if (notes) {
        const notesPath = resolvePath('ppt/slides/', notes.getAttribute('Target'))
        // The slide number on a notes page is a field of digits, not a note.
        const noteLines = paragraphLines(await readXml(zip, notesPath, 'PowerPoint')).filter((l) => !/^\d+$/.test(l.trim()))
        if (noteLines.length) lines.push('', ...noteLines)
      }
    }
    const text = lines.join('\n').trim()
    if (text) pages.push({ page: number, label: slideLabel(number), text })
  }
  return { pages, warnings: [] }
}

const columnIndex = (ref) =>
  [...ref.replace(/\d+/g, '')].reduce((sum, ch) => sum * 26 + ch.charCodeAt(0) - 64, 0) - 1

async function readXlsx(file) {
  const zip = await openZip(file, 'Excel')
  const workbook = await readXml(zip, 'xl/workbook.xml', 'Excel')
  const rels = await readXml(zip, 'xl/_rels/workbook.xml.rels', 'Excel')
  const targets = Object.fromEntries(byTag(rels, 'Relationship').map((r) => [r.getAttribute('Id'), r.getAttribute('Target')]))
  const shared = zip.file('xl/sharedStrings.xml')
    ? byTag(await readXml(zip, 'xl/sharedStrings.xml', 'Excel'), 'si').map((si) => byTag(si, 't').map((t) => t.textContent).join(''))
    : []
  const pages = []
  const warnings = []
  for (const [index, sheet] of byTag(workbook, 'sheet').entries()) {
    const target = targets[sheet.getAttribute('r:id')]
    if (!target) throw corrupt('Excel')
    const doc = await readXml(zip, resolvePath('xl/', target), 'Excel')
    const rows = byTag(doc, 'row').map((row) => {
      const cells = []
      for (const cell of byTag(row, 'c')) {
        const type = cell.getAttribute('t')
        const value = cell.getElementsByTagName('v')[0]?.textContent ?? ''
        cells[columnIndex(cell.getAttribute('r'))] =
          type === 's' ? shared[Number(value)] : type === 'inlineStr' ? byTag(cell, 't').map((t) => t.textContent).join('') : value
      }
      return Array.from(cells, (cell) => cell ?? '')
    })
    const table = rowsToMarkdown(rows)
    warnings.push(...table.warnings)
    if (table.text) pages.push({ page: index + 1, label: sheetLabel(sheet.getAttribute('name')), text: table.text })
  }
  return { pages, warnings }
}

async function readEpub(file) {
  const zip = await openZip(file, 'EPUB')
  const container = await readXml(zip, 'META-INF/container.xml', 'EPUB')
  const opfPath = byTag(container, 'rootfile')[0]?.getAttribute('full-path')
  if (!opfPath) throw corrupt('EPUB')
  const opf = await readXml(zip, opfPath, 'EPUB')
  const hrefs = Object.fromEntries(byTag(opf, 'item').map((item) => [item.getAttribute('id'), item.getAttribute('href')]))
  const pages = []
  for (const itemref of byTag(opf, 'itemref')) {
    const href = hrefs[itemref.getAttribute('idref')]
    const entry = href && zip.file(resolvePath(folderOf(opfPath), href))
    if (!entry) continue
    const text = htmlToMarkdown(await entry.async('string'))
    if (text) pages.push({ page: pages.length + 1, label: chapterLabel(pages.length + 1), text })
  }
  return { pages, warnings: [] }
}

function odfText(node) {
  let text = ''
  for (const child of node.childNodes) {
    if (child.nodeType === 3) text += child.textContent
    else if (child.nodeName === 'text:s') text += ' '.repeat(Number(child.getAttribute('text:c') || 1))
    else if (child.nodeName === 'text:tab') text += '\t'
    else if (child.nodeName === 'text:line-break') text += '\n'
    else text += odfText(child)
  }
  return text
}

function odfTableRows(table) {
  return byTag(table, 'table:table-row').map((row) => {
    const cells = []
    for (const cell of [...row.children].filter((c) => c.nodeName === 'table:table-cell')) {
      const text = byTag(cell, 'text:p').map(odfText).join(' ')
      const repeat = Number(cell.getAttribute('table:number-columns-repeated') || 1)
      for (let i = 0; i < Math.min(repeat, 30 - cells.length); i++) cells.push(text)
    }
    return cells
  })
}

function odfBlocks(node, warnings) {
  const blocks = []
  for (const child of node.children) {
    if (child.nodeName === 'text:h') {
      blocks.push(`${'#'.repeat(Number(child.getAttribute('text:outline-level') || 1))} ${odfText(child).trim()}`)
    } else if (child.nodeName === 'text:p') {
      if (odfText(child).trim()) blocks.push(odfText(child).trim())
    } else if (child.nodeName === 'text:list') {
      blocks.push(byTag(child, 'text:p').map((p) => `- ${odfText(p).trim()}`).join('\n'))
    } else if (child.nodeName === 'table:table') {
      const table = rowsToMarkdown(odfTableRows(child))
      warnings.push(...table.warnings)
      if (table.text) blocks.push(table.text)
    } else blocks.push(...odfBlocks(child, warnings))
  }
  return blocks
}

async function readOdf(file) {
  const zip = await openZip(file, 'OpenDocument')
  const doc = await readXml(zip, 'content.xml', 'OpenDocument')
  const body = byTag(doc, 'office:body')[0]?.firstElementChild
  if (!body) throw corrupt('OpenDocument')
  const warnings = []
  if (body.nodeName === 'office:presentation') {
    const pages = byTag(body, 'draw:page')
      .map((slide, index) => ({
        page: index + 1,
        label: slideLabel(index + 1),
        text: byTag(slide, 'text:p').map((p) => odfText(p).trim()).filter(Boolean).join('\n'),
      }))
      .filter((page) => page.text)
    return { pages, warnings }
  }
  if (body.nodeName === 'office:spreadsheet') {
    const pages = []
    for (const [index, table] of byTag(body, 'table:table').entries()) {
      const markdown = rowsToMarkdown(odfTableRows(table))
      warnings.push(...markdown.warnings)
      if (markdown.text) pages.push({ page: index + 1, label: sheetLabel(table.getAttribute('table:name')), text: markdown.text })
    }
    return { pages, warnings }
  }
  return { pages: textPage(file, odfBlocks(body, warnings).join('\n\n')), warnings }
}

const READERS = { docx: readDocx, pptx: readPptx, xlsx: readXlsx, epub: readEpub, odf: readOdf }

// `kind` is the kind from detectKind: docx, pptx, xlsx, epub or odf.
export const readOfficeFile = (file, kind) => READERS[kind](file)
