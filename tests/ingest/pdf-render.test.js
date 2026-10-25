import { readPdf } from '../../src/ingest/pdf.js'
import { toJpegDataUrl, PDF_DPI, PDF_MAX_IMAGE_SIDE } from '../../src/ingest/render.js'
import { fixture } from '../helpers/files.js'

vi.mock('../../src/ingest/render.js', async (importOriginal) => ({
  ...(await importOriginal()),
  toJpegDataUrl: vi.fn(async () => 'data:image/jpeg;base64,PAGE'),
}))

const open = async (name) => readPdf(await fixture(name, 'application/pdf'))

beforeEach(() => toJpegDataUrl.mockClear())

test('a pdf page is drawn at about 150 dpi', async () => {
  const { pages } = await open('scan.pdf')
  await pages[0].render()
  const [width, height] = toJpegDataUrl.mock.calls[0]
  // The test pdf is A4: about 595 by 842 points, and 72 points are one inch.
  expect(width).toBeCloseTo((595.28 * PDF_DPI) / 72, -1)
  expect(height).toBeCloseTo((841.89 * PDF_DPI) / 72, -1)
})

test('a pdf page may be bigger than the size limit of a plain image', async () => {
  const { pages } = await open('scan.pdf')
  await pages[0].render()
  const options = toJpegDataUrl.mock.calls[0][3]
  expect(options.maxSide).toBe(PDF_MAX_IMAGE_SIDE)
  expect(PDF_MAX_IMAGE_SIDE).toBeGreaterThan(1200)
})
