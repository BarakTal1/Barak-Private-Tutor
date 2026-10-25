import { ParseError } from './errors.js'
import { toJpegDataUrl } from './render.js'

const corrupt = () => new ParseError('corrupt', 'The image cannot be read.')

// Safari decodes a heic file itself. Chrome and Firefox cannot, so the file becomes a jpeg first.
// The converter is big, so it loads only when it is needed. It reads the newer files of the iPhone.
async function decodeHeic(file) {
  try {
    return await createImageBitmap(file)
  } catch {
    // The browser cannot read heic. Use the converter.
  }
  try {
    const { heicTo } = await import('heic-to')
    return await createImageBitmap(await heicTo({ blob: file, type: 'image/jpeg', quality: 0.8 }))
  } catch {
    throw corrupt()
  }
}

// An image is one page with no text. It always needs the vision model.
// `kind` is the kind from detectKind.
export async function readImage(file, kind) {
  let bitmap
  if (kind === 'heic') bitmap = await decodeHeic(file)
  else {
    try {
      bitmap = await createImageBitmap(file)
    } catch {
      throw corrupt()
    }
  }
  const render = () =>
    toJpegDataUrl(bitmap.width, bitmap.height, (context, width, height) =>
      context.drawImage(bitmap, 0, 0, width, height),
    )
  return { pages: [{ page: 1, label: file.name, text: '', needsVision: true, render }] }
}
