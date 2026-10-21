import { ParseError } from '../../src/ingest/errors.js'
import { readOfficeFile } from '../../src/ingest/office.js'
import { fixture, textFile } from '../helpers/files.js'

const table = '| Shape | Sides |\n| --- | --- |\n| Triangle | 3 |'

test('docx keeps headings, paragraphs and a table as Markdown', async () => {
  const { pages } = await readOfficeFile(await fixture('sample.docx'), 'docx')
  expect(pages).toHaveLength(1)
  expect(pages[0].text).toBe(`# Triangles\n\nA triangle has three sides.\n\n${table}`)
})

test('pptx returns one page for each slide with the notes', async () => {
  const { pages } = await readOfficeFile(await fixture('sample.pptx'), 'pptx')
  expect(pages.map((p) => p.page)).toEqual([1, 2])
  expect(pages[0].label).toBe('שקופית 1')
  expect(pages[0].text).toContain('Slide one title')
  expect(pages[0].text).toContain('First bullet')
  expect(pages[0].text).toContain('Remember this note')
  expect(pages[0].text).not.toMatch(/^1$/m)
  expect(pages[1].text).toBe('Slide two title')
})

test('xlsx returns one page for each sheet and caps the rows', async () => {
  const { pages, warnings } = await readOfficeFile(await fixture('sample.xlsx'), 'xlsx')
  expect(pages.map((p) => p.label)).toEqual(['גיליון: Grades', 'גיליון: Notes'])
  const lines = pages[0].text.split('\n')
  expect(lines[0]).toBe('| Name | Score |')
  expect(lines[2]).toBe('| Dana | 1 |')
  expect(lines[3]).toBe('| Avi | 2 |')
  expect(lines).toHaveLength(2 + 200)
  expect(pages[1].text).toContain('| Remember | 42 |')
  expect(warnings).toEqual([{ code: 'rows_capped', params: { shown: 200, total: 250 } }])
})

test('epub returns the chapters in the order of the spine', async () => {
  const { pages } = await readOfficeFile(await fixture('sample.epub'), 'epub')
  expect(pages.map((p) => p.text)).toEqual([
    '# Chapter One\n\nFirst chapter text.',
    '# Chapter Two\n\nSecond chapter text.',
  ])
  expect(pages[0].label).toBe('פרק 1')
})

test('odf keeps headings, paragraphs and a table', async () => {
  const { pages } = await readOfficeFile(await fixture('sample.odt'), 'odf')
  expect(pages[0].text).toBe(`# Triangles\n\nA triangle has three sides.\n\n${table}`)
})

test('a file that is not a zip throws a corrupt ParseError', async () => {
  const bad = textFile('this is not a zip', 'bad.docx', '')
  await expect(readOfficeFile(bad, 'docx')).rejects.toBeInstanceOf(ParseError)
  await expect(readOfficeFile(bad, 'docx')).rejects.toMatchObject({ code: 'corrupt' })
  await expect(readOfficeFile(bad, 'pptx')).rejects.toMatchObject({ code: 'corrupt' })
  await expect(readOfficeFile(bad, 'xlsx')).rejects.toMatchObject({ code: 'corrupt' })
  await expect(readOfficeFile(bad, 'epub')).rejects.toMatchObject({ code: 'corrupt' })
  await expect(readOfficeFile(bad, 'odf')).rejects.toMatchObject({ code: 'corrupt' })
})

test('a zip that is not the right kind of document throws a corrupt ParseError', async () => {
  await expect(readOfficeFile(await fixture('sample.xlsx'), 'docx')).rejects.toMatchObject({ code: 'corrupt' })
})
