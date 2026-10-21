import { ingestFile } from '../../src/ingest/index.js'
import { ParseError } from '../../src/ingest/errors.js'
import { MAX_FILE_BYTES, MAX_VISION_PAGES } from '../../shared/limits.js'
import { readPdf } from '../../src/ingest/pdf.js'
import { readImage } from '../../src/ingest/image.js'
import { textFile } from '../helpers/files.js'

vi.mock('../../src/ingest/pdf.js', () => ({ readPdf: vi.fn() }))
vi.mock('../../src/ingest/image.js', () => ({ readImage: vi.fn() }))

const vision = { baseUrl: 'https://api.example.com/v1', model: 'm', vision: true }
const noVision = { ...vision, vision: false }
const goodText = 'This page has plenty of readable text. It talks about triangles and their sides.'

const pdfFile = () => new File(['%PDF'], 'lesson.pdf', { type: 'application/pdf' })
const pdfPage = (number, { text = goodText, needsVision = false } = {}) => ({
  page: number,
  label: `עמוד ${number}`,
  text,
  needsVision,
  render: vi.fn(async () => `data:image/jpeg;base64,PAGE${number}`),
})
const scanned = (number) => pdfPage(number, { text: '', needsVision: true })
const transcribeAll = () =>
  vi.fn(async (pages) => pages.map(({ page }) => ({ page, text: `Transcribed text of page ${page}. It is long enough to count.` })))

const run = (file, overrides = {}) =>
  ingestFile(file, { provider: vision, transcribe: transcribeAll(), onProgress: vi.fn(), ...overrides })

beforeEach(() => {
  readPdf.mockReset()
  readImage.mockReset()
})

describe('text files', () => {
  test('a text file gives passages and a pages report with method text', async () => {
    const result = await run(textFile(goodText, 'notes.txt'))
    expect(result.fileName).toBe('notes.txt')
    expect(result.passages).toEqual([
      { id: 'p1', label: 'notes.txt', page: null, text: goodText, source: 'text' },
    ])
    expect(result.pages).toEqual([{ page: 1, method: 'text' }])
    expect(result.warnings).toEqual([])
  })

  test('warnings from the parser are kept', async () => {
    const csv = ['n,v', ...Array.from({ length: 300 }, (_, i) => `row${i},${i}`)].join('\n')
    const result = await run(textFile(csv, 'big.csv', 'text/csv'))
    expect(result.warnings).toContainEqual({ code: 'rows_capped', params: { shown: 200, total: 300 } })
  })

  test('an empty file throws an empty ParseError', async () => {
    await expect(run(textFile('  ', 'empty.txt'))).rejects.toMatchObject({ name: 'ParseError', code: 'empty' })
  })

  test('a very short result adds a warning', async () => {
    const result = await run(textFile('Short note about triangles.', 'short.txt'))
    expect(result.warnings).toContainEqual({ code: 'very_short', params: { chars: 27 } })
  })
})

describe('refused files', () => {
  test('a file over MAX_FILE_BYTES is refused before parsing', async () => {
    const big = { name: 'big.pdf', type: 'application/pdf', size: MAX_FILE_BYTES + 1 }
    await expect(run(big)).rejects.toMatchObject({ code: 'too_large', params: { limit: MAX_FILE_BYTES } })
    expect(readPdf).not.toHaveBeenCalled()
  })

  test('an unsupported kind throws unsupported with its reason', async () => {
    await expect(run(textFile('x', 'song.mp3', 'audio/mpeg'))).rejects.toMatchObject({
      code: 'unsupported',
      params: { reason: 'media' },
    })
    await expect(run(textFile('x', 'old.doc', ''))).rejects.toMatchObject({ params: { reason: 'legacy_office' } })
  })

  test('a parser error is passed on', async () => {
    readPdf.mockRejectedValue(new ParseError('locked', 'locked'))
    await expect(run(pdfFile())).rejects.toMatchObject({ code: 'locked' })
  })
})

describe('vision routing', () => {
  test('a pdf of good pages never calls transcribe', async () => {
    readPdf.mockResolvedValue({ pages: [pdfPage(1), pdfPage(2)], totalPages: 2 })
    const transcribe = transcribeAll()
    const result = await run(pdfFile(), { transcribe })
    expect(transcribe).not.toHaveBeenCalled()
    expect(result.pages).toEqual([{ page: 1, method: 'text' }, { page: 2, method: 'text' }])
  })

  test('poor pages are sent to transcribe in batches of 2', async () => {
    readPdf.mockResolvedValue({ pages: [scanned(1), scanned(2), scanned(3)], totalPages: 3 })
    const transcribe = transcribeAll()
    const result = await run(pdfFile(), { transcribe })
    expect(transcribe.mock.calls.map(([pages]) => pages.map((p) => p.page))).toEqual([[1, 2], [3]])
    expect(transcribe.mock.calls[0][0][0]).toEqual({ page: 1, image: 'data:image/jpeg;base64,PAGE1' })
    expect(result.pages.map((p) => p.method)).toEqual(['vision', 'vision', 'vision'])
    expect(result.passages[0]).toMatchObject({ source: 'vision', text: expect.stringContaining('Transcribed text of page 1') })
  })

  test('good and poor pages keep the page order', async () => {
    readPdf.mockResolvedValue({ pages: [pdfPage(1), scanned(2), pdfPage(3)], totalPages: 3 })
    const result = await run(pdfFile())
    expect(result.passages.map((p) => [p.page, p.source])).toEqual([[1, 'text'], [2, 'vision'], [3, 'text']])
  })

  test('with vision off an image-only pdf throws the nothing_readable ParseError', async () => {
    readPdf.mockResolvedValue({ pages: [scanned(1), scanned(2)], totalPages: 2 })
    await expect(run(pdfFile(), { provider: noVision })).rejects.toMatchObject({
      code: 'nothing_readable',
      params: { visionOff: true },
    })
  })

  test('with vision off a mixed pdf keeps good pages and warns about skipped pages', async () => {
    readPdf.mockResolvedValue({ pages: [pdfPage(1), scanned(2)], totalPages: 2 })
    const transcribe = transcribeAll()
    const result = await run(pdfFile(), { provider: noVision, transcribe })
    expect(transcribe).not.toHaveBeenCalled()
    expect(result.pages).toEqual([{ page: 1, method: 'text' }, { page: 2, method: 'skipped', note: 'vision_off' }])
    expect(result.warnings).toContainEqual({ code: 'vision_off', params: { pages: [2] } })
  })

  test('a page with broken text is not used when vision is off', async () => {
    readPdf.mockResolvedValue({ pages: [pdfPage(1), pdfPage(2, { text: 'garbled', needsVision: true })], totalPages: 2 })
    const result = await run(pdfFile(), { provider: noVision })
    expect(result.passages).toHaveLength(1)
  })

  test('more than MAX_VISION_PAGES scanned pages are skipped with a warning', async () => {
    const pages = Array.from({ length: MAX_VISION_PAGES + 3 }, (_, i) => scanned(i + 1))
    readPdf.mockResolvedValue({ pages, totalPages: pages.length })
    const transcribe = transcribeAll()
    const result = await run(pdfFile(), { transcribe })
    const sent = transcribe.mock.calls.flatMap(([batch]) => batch)
    expect(sent).toHaveLength(MAX_VISION_PAGES)
    expect(result.pages.filter((p) => p.method === 'skipped')).toHaveLength(3)
    expect(result.warnings).toContainEqual({ code: 'vision_capped', params: { limit: MAX_VISION_PAGES, skipped: 3 } })
  })

  test('a no_vision error skips the rest instead of failing', async () => {
    readPdf.mockResolvedValue({ pages: [pdfPage(1), scanned(2), scanned(3)], totalPages: 3 })
    const transcribe = vi.fn().mockRejectedValue(Object.assign(new Error('x'), { code: 'no_vision' }))
    const result = await run(pdfFile(), { transcribe })
    expect(result.passages).toHaveLength(1)
    expect(result.pages.map((p) => p.method)).toEqual(['text', 'skipped', 'skipped'])
    expect(result.warnings).toContainEqual({ code: 'no_vision_model', params: { pages: [2, 3] } })
  })

  test('a no_vision error with no readable page throws nothing_readable', async () => {
    readPdf.mockResolvedValue({ pages: [scanned(1)], totalPages: 1 })
    const transcribe = vi.fn().mockRejectedValue(Object.assign(new Error('x'), { code: 'no_vision' }))
    await expect(run(pdfFile(), { transcribe })).rejects.toMatchObject({ code: 'nothing_readable' })
  })

  test('another transcribe error, such as a bad key, is passed on', async () => {
    readPdf.mockResolvedValue({ pages: [scanned(1)], totalPages: 1 })
    const transcribe = vi.fn().mockRejectedValue(Object.assign(new Error('x'), { code: 'bad_key' }))
    await expect(run(pdfFile(), { transcribe })).rejects.toMatchObject({ code: 'bad_key' })
  })

  test('a page that cannot be drawn is marked failed and the others continue', async () => {
    const broken = scanned(1)
    broken.render.mockRejectedValue(new ParseError('corrupt', 'too big'))
    readPdf.mockResolvedValue({ pages: [broken, scanned(2)], totalPages: 2 })
    const result = await run(pdfFile())
    expect(result.pages.map((p) => p.method)).toEqual(['failed', 'vision'])
  })

  test('a page that the model returns empty is marked failed', async () => {
    readPdf.mockResolvedValue({ pages: [pdfPage(1), scanned(2)], totalPages: 2 })
    const transcribe = vi.fn(async () => [{ page: 2, text: '   ' }])
    const result = await run(pdfFile(), { transcribe })
    expect(result.pages[1]).toEqual({ page: 2, method: 'failed', note: 'empty' })
  })

  test('an image goes through the vision model', async () => {
    readImage.mockResolvedValue({ pages: [{ ...scanned(1), label: 'photo.jpg' }] })
    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' })
    const result = await run(file)
    expect(result.passages[0]).toMatchObject({ source: 'vision', label: 'photo.jpg' })
  })
})

describe('long pdf and progress', () => {
  test('a cut pdf adds a pages_capped warning', async () => {
    readPdf.mockResolvedValue({ pages: [pdfPage(1)], totalPages: 250 })
    const result = await run(pdfFile())
    expect(result.warnings).toContainEqual({ code: 'pages_capped', params: { read: 1, total: 250 } })
  })

  test('onProgress reports reading and vision steps', async () => {
    readPdf.mockImplementation(async (file, { onProgress }) => {
      onProgress(1, 1)
      return { pages: [scanned(1)], totalPages: 1 }
    })
    const onProgress = vi.fn()
    await run(pdfFile(), { onProgress })
    const stages = onProgress.mock.calls.map(([info]) => info.stage)
    expect(stages).toContain('reading')
    expect(stages).toContain('vision')
  })
})
