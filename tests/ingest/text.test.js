import { readTextFile } from '../../src/ingest/text.js'
import { fixture, textFile } from '../helpers/files.js'

const read = (content, name, type) => readTextFile(textFile(content, name, type), name.split('.').pop())

test('reads a UTF-8 Hebrew txt without question marks', async () => {
  const { pages } = await readTextFile(await fixture('hebrew.txt'), 'txt')
  expect(pages).toHaveLength(1)
  expect(pages[0].text).toContain('שלום עולם')
  expect(pages[0].text).not.toContain('?')
})

test('decodes a windows-1255 file', async () => {
  const { pages } = await readTextFile(await fixture('hebrew-1255.txt'), 'txt')
  expect(pages[0].text).toContain('שלום עולם')
})

test('removes a UTF-8 byte order mark', async () => {
  const { pages } = await readTextFile(new File([new Uint8Array([0xef, 0xbb, 0xbf, 0x48, 0x69])], 'a.txt'), 'txt')
  expect(pages[0].text).toBe('Hi')
})

test('decodes UTF-16 with a byte order mark', async () => {
  const bytes = new Uint8Array([0xff, 0xfe, 0x48, 0x00, 0x69, 0x00])
  const { pages } = await readTextFile(new File([bytes], 'a.txt'), 'txt')
  expect(pages[0].text).toBe('Hi')
})

test('converts csv to a Markdown table', async () => {
  const { pages } = await readTextFile(await fixture('table.csv'), 'csv')
  expect(pages[0].text).toBe('| name | score |\n| --- | --- |\n| Dana | 90 |\n| Cohen, Avi | 85 |')
})

test('a csv with a quoted newline keeps it in one cell', async () => {
  const { pages } = await read('a,b\n"line one\nline two",2\n', 'x.csv')
  expect(pages[0].text).toContain('line one line two')
})

test('a csv with more than 200 rows is cut and reports it', async () => {
  const csv = ['n,v', ...Array.from({ length: 300 }, (_, i) => `r${i},${i}`)].join('\n')
  const { pages, warnings } = await read(csv, 'big.csv')
  expect(pages[0].text.split('\n')).toHaveLength(2 + 200)
  expect(warnings).toEqual([{ code: 'rows_capped', params: { shown: 200, total: 300 } }])
})

test('json is pretty printed and invalid json is kept as text', async () => {
  expect((await read('{"a":1}', 'x.json')).pages[0].text).toBe('{\n  "a": 1\n}')
  expect((await read('{oops', 'x.json')).pages[0].text).toBe('{oops')
})

test('html keeps headings and tables and drops scripts', async () => {
  const { pages } = await read('<h1>Title</h1><script>x()</script><p>Body</p>', 'x.html')
  expect(pages[0].text).toBe('# Title\n\nBody')
})

test('markdown, tex and code are kept as they are', async () => {
  expect((await read('# Hi\n\ntext', 'x.md')).pages[0].text).toBe('# Hi\n\ntext')
  expect((await read('$$x^2$$', 'x.tex')).pages[0].text).toBe('$$x^2$$')
})

test('the page label is the file name and there is no page number', async () => {
  const { pages } = await read('Hello', 'notes.txt')
  expect(pages[0]).toMatchObject({ page: null, label: 'notes.txt' })
})

test('an empty or whitespace file returns no pages', async () => {
  expect((await read('', 'a.txt')).pages).toEqual([])
  expect((await read('  \n\n ', 'a.txt')).pages).toEqual([])
})

test('a file that is not text throws a corrupt ParseError', async () => {
  const bytes = new Uint8Array(2000).map((_, i) => (i % 7 === 0 ? 0 : 1 + (i % 30)))
  await expect(readTextFile(new File([bytes], 'a.txt'), 'txt')).rejects.toMatchObject({ code: 'corrupt' })
})
