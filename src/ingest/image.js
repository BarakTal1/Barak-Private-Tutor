import { ParseError } from './errors.js'
import { toJpegDataUrl } from './render.js'

const corrupt = () => new ParseError('corrupt', 'The image cannot be read.')

async function toJpeg(file) {
  try {
    const { default: heic2any } = await import('heic2any')
    const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 })
    return Array.isArray(converted) ? converted[0] : converted
  } catch {
    throw corrupt()
  }
}

// An image is one page with no text. It always needs the vision model.
// `kind` is the kind from detectKind. A heic photo from an iPhone becomes a jpeg first.
export async function readImage(file, kind) {
  const blob = kind === 'heic' ? await toJpeg(file) : file
  let bitmap
  try {
    bitmap = await createImageBitmap(blob)
  } catch {
    throw corrupt()
  }
  const render = () =>
    toJpegDataUrl(bitmap.width, bitmap.height, (context, width, height) =>
      context.drawImage(bitmap, 0, 0, width, height),
    )
  return { pages: [{ page: 1, label: file.name, text: '', needsVision: true, render }] }
}
