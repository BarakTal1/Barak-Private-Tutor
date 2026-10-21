import { toJpegDataUrl, MAX_DATA_URL_CHARS, MAX_IMAGE_SIDE } from '../../src/ingest/render.js'
import { ParseError } from '../../src/ingest/errors.js'

let context
let sizes

beforeEach(() => {
  sizes = []
  context = { fillStyle: '', fillRect: vi.fn() }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context)
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(function toDataURL() {
    sizes.push([this.width, this.height])
    return 'data:image/jpeg;base64,AAAA'
  })
})

afterEach(() => vi.restoreAllMocks())

test('scales the longest side down to MAX_IMAGE_SIDE and keeps the ratio', async () => {
  const draw = vi.fn()
  await toJpegDataUrl(4000, 3000, draw)
  expect(draw).toHaveBeenCalledWith(context, MAX_IMAGE_SIDE, 900)
})

test('does not scale a small image up', async () => {
  const draw = vi.fn()
  await toJpegDataUrl(300, 200, draw)
  expect(draw).toHaveBeenCalledWith(context, 300, 200)
})

test('paints the background white before it draws', async () => {
  const order = []
  context.fillRect = vi.fn(() => order.push('fill'))
  await toJpegDataUrl(100, 100, () => order.push('draw'))
  expect(order).toEqual(['fill', 'draw'])
  expect(context.fillStyle).toBe('#fff')
})

test('returns a jpeg data URL', async () => {
  await expect(toJpegDataUrl(100, 100, vi.fn())).resolves.toMatch(/^data:image\/jpeg;base64,/)
})

test('tries again at a smaller size when the image is too big', async () => {
  HTMLCanvasElement.prototype.toDataURL
    .mockReturnValueOnce('x'.repeat(MAX_DATA_URL_CHARS + 1))
    .mockReturnValueOnce('data:image/jpeg;base64,SMALL')
  const draw = vi.fn()
  await expect(toJpegDataUrl(2000, 1000, draw)).resolves.toBe('data:image/jpeg;base64,SMALL')
  expect(draw).toHaveBeenCalledTimes(2)
  expect(draw.mock.calls[1][1]).toBeLessThan(draw.mock.calls[0][1])
})

test('gives up with a ParseError when the image stays too big', async () => {
  HTMLCanvasElement.prototype.toDataURL.mockReturnValue('x'.repeat(MAX_DATA_URL_CHARS + 1))
  await expect(toJpegDataUrl(2000, 1000, vi.fn())).rejects.toBeInstanceOf(ParseError)
})
