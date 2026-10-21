import { readImage } from '../../src/ingest/image.js'
import { ParseError } from '../../src/ingest/errors.js'
import { MAX_DATA_URL_CHARS, MAX_IMAGE_SIDE } from '../../src/ingest/render.js'

vi.mock('heic2any', () => ({ default: vi.fn(async () => new Blob(['jpeg-bytes'], { type: 'image/jpeg' })) }))

let context
let drawn

const png = (name = 'scan.png') => new File(['png-bytes'], name, { type: 'image/png' })
const bitmap = (width, height) => ({ width, height })

beforeEach(() => {
  drawn = []
  context = { fillStyle: '', fillRect: vi.fn(), drawImage: vi.fn((...args) => drawn.push(args)) }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context)
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,AAAA')
  vi.stubGlobal('createImageBitmap', vi.fn(async () => bitmap(1000, 500)))
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test('a png returns one page that needs vision', async () => {
  const { pages } = await readImage(png('page.png'), 'png')
  expect(pages).toHaveLength(1)
  expect(pages[0]).toMatchObject({ page: 1, label: 'page.png', text: '', needsVision: true })
  expect(typeof pages[0].render).toBe('function')
})

test('render returns a data URL under the size limit for a 4000x3000 input', async () => {
  createImageBitmap.mockResolvedValue(bitmap(4000, 3000))
  const { pages } = await readImage(png(), 'png')
  const url = await pages[0].render()
  expect(url).toMatch(/^data:image\/jpeg;base64,/)
  expect(url.length).toBeLessThanOrEqual(MAX_DATA_URL_CHARS)
  const [, , , width, height] = drawn[0]
  expect(Math.max(width, height)).toBeLessThanOrEqual(MAX_IMAGE_SIDE)
})

test('a heic file is converted to jpeg before it is decoded', async () => {
  const { default: heic2any } = await import('heic2any')
  await readImage(new File(['heic-bytes'], 'photo.heic'), 'heic')
  expect(heic2any).toHaveBeenCalledWith(expect.objectContaining({ toType: 'image/jpeg' }))
  const decoded = createImageBitmap.mock.calls[0][0]
  expect(decoded.type).toBe('image/jpeg')
})

test('an image that cannot be decoded throws a corrupt ParseError', async () => {
  createImageBitmap.mockRejectedValue(new Error('bad image'))
  await expect(readImage(png(), 'png')).rejects.toBeInstanceOf(ParseError)
  await expect(readImage(png(), 'png')).rejects.toMatchObject({ code: 'corrupt' })
})

test('a heic file that cannot be converted throws a corrupt ParseError', async () => {
  const { default: heic2any } = await import('heic2any')
  heic2any.mockRejectedValueOnce(new Error('bad heic'))
  await expect(readImage(new File(['x'], 'p.heic'), 'heic')).rejects.toMatchObject({ code: 'corrupt' })
})
