// Builds the small sample files that the parser tests read. Run: node tests/fixtures/make.mjs
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import JSZip from 'jszip'

const here = dirname(fileURLToPath(import.meta.url))
const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'

async function zip(name, files) {
  const archive = new JSZip()
  for (const [path, content] of Object.entries(files)) archive.file(path, content)
  await writeFile(join(here, name), await archive.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }))
}

const hebrew = 'שלום עולם. זהו שיעור על משולשים.\nהמורים מסבירים לתלמידים.\n'
await writeFile(join(here, 'hebrew.txt'), hebrew)
// windows-1255 maps the Hebrew letters U+05D0..U+05EA to the bytes 0xE0..0xFA.
const cp1255 = [...hebrew].map((ch) => {
  const code = ch.codePointAt(0)
  return code >= 0x05d0 && code <= 0x05ea ? code - 0x05d0 + 0xe0 : code
})
await writeFile(join(here, 'hebrew-1255.txt'), Buffer.from(cp1255))
await writeFile(join(here, 'table.csv'), 'name,score\nDana,90\n"Cohen, Avi",85\n')

const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
const PKG_REL = 'http://schemas.openxmlformats.org/package/2006/relationships'
const rels = (items) =>
  `${XML}<Relationships xmlns="${PKG_REL}">${items.map(([id, type, target]) => `<Relationship Id="${id}" Type="${REL}/${type}" Target="${target}"/>`).join('')}</Relationships>`
const types = (overrides) =>
  `${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${overrides}</Types>`

// docx: a heading, a paragraph and a 2x2 table
const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"'
const para = (text, style) => `<w:p>${style ? `<w:pPr><w:pStyle w:val="${style}"/></w:pPr>` : ''}<w:r><w:t>${text}</w:t></w:r></w:p>`
const cell = (text) => `<w:tc>${para(text)}</w:tc>`
await zip('sample.docx', {
  '[Content_Types].xml': types(
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>',
  ),
  '_rels/.rels': rels([['rId1', 'officeDocument', 'word/document.xml']]),
  'word/_rels/document.xml.rels': rels([['rId1', 'styles', 'styles.xml']]),
  'word/styles.xml': `${XML}<w:styles ${W}><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/></w:style></w:styles>`,
  'word/document.xml': `${XML}<w:document ${W}><w:body>${para('Triangles', 'Heading1')}${para('A triangle has three sides.')}<w:tbl><w:tr>${cell('Shape')}${cell('Sides')}</w:tr><w:tr>${cell('Triangle')}${cell('3')}</w:tr></w:tbl></w:body></w:document>`,
})

// pptx: two slides, the first has speaker notes
const A = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"'
const shape = (...lines) => `<p:sp><p:txBody>${lines.map((line) => `<a:p><a:r><a:t>${line}</a:t></a:r></a:p>`).join('')}</p:txBody></p:sp>`
const slide = (...lines) => `${XML}<p:sld ${A}><p:cSld><p:spTree>${shape(...lines)}</p:spTree></p:cSld></p:sld>`
await zip('sample.pptx', {
  '[Content_Types].xml': types(''),
  '_rels/.rels': rels([['rId1', 'officeDocument', 'ppt/presentation.xml']]),
  'ppt/slides/slide1.xml': slide('Slide one title', 'First bullet'),
  'ppt/slides/slide2.xml': slide('Slide two title'),
  'ppt/slides/_rels/slide1.xml.rels': rels([['rId1', 'notesSlide', '../notesSlides/notesSlide1.xml']]),
  'ppt/notesSlides/notesSlide1.xml': `${XML}<p:notes ${A}><p:cSld><p:spTree>${shape('Remember this note', '1')}</p:spTree></p:cSld></p:notes>`,
})

// xlsx: a 250-row sheet with shared strings, and a second sheet with an inline string
const S = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
const rows = Array.from({ length: 250 }, (_, i) => `<row r="${i + 2}"><c r="A${i + 2}" t="s"><v>${1 + (i % 2)}</v></c><c r="B${i + 2}"><v>${i + 1}</v></c></row>`).join('')
await zip('sample.xlsx', {
  '[Content_Types].xml': types(''),
  '_rels/.rels': rels([['rId1', 'officeDocument', 'xl/workbook.xml']]),
  'xl/workbook.xml': `${XML}<workbook ${S} xmlns:r="${REL}"><sheets><sheet name="Grades" sheetId="1" r:id="rId1"/><sheet name="Notes" sheetId="2" r:id="rId2"/></sheets></workbook>`,
  'xl/_rels/workbook.xml.rels': rels([['rId1', 'worksheet', 'worksheets/sheet1.xml'], ['rId2', 'worksheet', 'worksheets/sheet2.xml']]),
  'xl/sharedStrings.xml': `${XML}<sst ${S}><si><t>Name</t></si><si><t>Dana</t></si><si><t>Avi</t></si></sst>`,
  'xl/worksheets/sheet1.xml': `${XML}<worksheet ${S}><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="inlineStr"><is><t>Score</t></is></c></row>${rows}</sheetData></worksheet>`,
  'xl/worksheets/sheet2.xml': `${XML}<worksheet ${S}><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Remember</t></is></c><c r="B1"><v>42</v></c></row></sheetData></worksheet>`,
})

// epub: two chapters in the order of the spine
const xhtml = (title, body) => `${XML}<html xmlns="http://www.w3.org/1999/xhtml"><head><title>${title}</title></head><body><h1>${title}</h1><p>${body}</p></body></html>`
await zip('sample.epub', {
  mimetype: 'application/epub+zip',
  'META-INF/container.xml': `${XML}<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`,
  'OEBPS/content.opf': `${XML}<package xmlns="http://www.idpf.org/2007/opf" version="3.0"><manifest><item id="b" href="ch2.xhtml" media-type="application/xhtml+xml"/><item id="a" href="ch1.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="a"/><itemref idref="b"/></spine></package>`,
  'OEBPS/ch1.xhtml': xhtml('Chapter One', 'First chapter text.'),
  'OEBPS/ch2.xhtml': xhtml('Chapter Two', 'Second chapter text.'),
})

// odt: a heading, a paragraph and a 2x2 table
const O = 'xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"'
const odfCell = (text) => `<table:table-cell><text:p>${text}</text:p></table:table-cell>`
await zip('sample.odt', {
  mimetype: 'application/vnd.oasis.opendocument.text',
  'content.xml': `${XML}<office:document-content ${O}><office:body><office:text><text:h text:outline-level="1">Triangles</text:h><text:p>A triangle has three sides.</text:p><table:table><table:table-row>${odfCell('Shape')}${odfCell('Sides')}</table:table-row><table:table-row>${odfCell('Triangle')}${odfCell('3')}</table:table-row></table:table></office:text></office:body></office:document-content>`,
})

console.log('fixtures written to', here)
