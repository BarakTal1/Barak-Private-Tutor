import { ParseError } from './errors.js'

export const MAX_IMAGE_SIDE = 1200
// A pdf page is drawn at this resolution. The size of a page in a pdf is in points (72 to the inch),
// so a scan would be drawn at 72 dpi and small print would not be readable. A page at 150 dpi is
// about 1750 pixels high.
export const PDF_DPI = 150
export const PDF_MAX_IMAGE_SIDE = 1800
export const MAX_DATA_URL_CHARS = 1_000_000

const ATTEMPTS = 4
const START_QUALITY = 0.6
const MIN_QUALITY = 0.3

// Draws a page into a canvas and returns it as a small jpeg data URL. A request to the server
// can hold about 4.5 MB, so each image stays under MAX_DATA_URL_CHARS. When it is too big,
// the image is drawn again at a smaller size and quality.
// `draw(context, width, height)` paints the page. `maxSide` is the longest side that may be sent.
export async function toJpegDataUrl(width, height, draw, { maxSide = MAX_IMAGE_SIDE } = {}) {
  let scale = Math.min(1, maxSide / Math.max(width, height))
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(width * scale))
    canvas.height = Math.max(1, Math.round(height * scale))
    const context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    await draw(context, canvas.width, canvas.height)
    const url = canvas.toDataURL('image/jpeg', Math.max(MIN_QUALITY, START_QUALITY - attempt * 0.1))
    if (url.length <= MAX_DATA_URL_CHARS) return url
    scale *= 0.75
  }
  throw new ParseError('corrupt', 'The page image is too large to send.')
}
