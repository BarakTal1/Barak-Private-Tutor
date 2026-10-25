import { readPdf } from '../../src/ingest/pdf.js'
import { MAX_TEXT_PAGES } from '../../shared/limits.js'
import { fixture } from '../helpers/files.js'

const open = async (name, options) => readPdf(await fixture(name, 'application/pdf'), options)

test('a text pdf returns pages with needsVision false', async () => {
  const { pages, totalPages } = await open('text.pdf')
  expect(totalPages).toBe(2)
  expect(pages.map((p) => [p.page, p.label, p.needsVision])).toEqual([
    [1, 'עמוד 1', false],
    [2, 'עמוד 2', false],
  ])
  expect(pages[0].text).toContain('A triangle has three sides.')
  expect(pages[1].text).toContain('Pythagoras')
  expect(typeof pages[0].render).toBe('function')
})

test('an image-only pdf marks every page needsVision', async () => {
  const { pages } = await open('scan.pdf')
  expect(pages).toHaveLength(2)
  for (const page of pages) expect(page).toMatchObject({ needsVision: true, text: '' })
})

test('a pdf with text and a picture page marks only the picture page', async () => {
  const { pages } = await open('mixed.pdf')
  expect(pages.map((p) => p.needsVision)).toEqual([false, true])
})

test('a locked pdf throws a locked ParseError', async () => {
  await expect(open('locked.pdf')).rejects.toMatchObject({ name: 'ParseError', code: 'locked' })
})

test('a file that is not a pdf throws a corrupt ParseError', async () => {
  const bad = new File(['this is not a pdf'], 'bad.pdf', { type: 'application/pdf' })
  await expect(readPdf(bad)).rejects.toMatchObject({ name: 'ParseError', code: 'corrupt' })
})

test('a pdf with 120 pages reads MAX_TEXT_PAGES pages and reports the real total', async () => {
  const { pages, totalPages } = await open('many.pdf')
  expect(totalPages).toBe(120)
  expect(pages).toHaveLength(MAX_TEXT_PAGES)
  expect(pages.at(-1).text).toContain(`page number ${MAX_TEXT_PAGES}`)
})

test('onProgress is called for each page', async () => {
  const onProgress = vi.fn()
  await open('text.pdf', { onProgress })
  expect(onProgress.mock.calls).toEqual([[1, 2], [2, 2]])
})

describe('scans with a text layer', () => {
  test('a full-page picture with only a short stamp needs vision', async () => {
    const { pages } = await open('scan-stamp.pdf')
    expect(pages[0].text).toContain('CamScanner')
    expect(pages[0].needsVision).toBe(true)
  })

  test('a full-page picture with a long text layer is trusted but marked for a check', async () => {
    const { pages } = await open('scan-ocr-layer.pdf')
    expect(pages[0]).toMatchObject({ needsVision: false, check: true })
  })

  test('a page of text has no check mark', async () => {
    const { pages } = await open('text.pdf')
    expect(pages.map((p) => Boolean(p.check))).toEqual([false, false])
  })

  test('the small picture of the old image-only test file does not change its result', async () => {
    const { pages } = await open('scan.pdf')
    expect(pages.every((p) => p.needsVision)).toBe(true)
  })
})
