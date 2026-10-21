import { HttpError, readCall, sendError } from '../server/http.js'
import { complete } from '../server/llm.js'
import { buildTranscribeMessages } from '../server/prompts.js'
import { VISION_BATCH_PAGES } from '../shared/limits.js'

// A request can hold 4.5 MB on the host. Two images of at most 1 MB each stay far below it.
const MAX_IMAGE_CHARS = 1_500_000

function readPages(value) {
  if (!Array.isArray(value) || !value.length) {
    throw new HttpError(400, 'bad_request', 'Send at least one page image.')
  }
  if (value.length > VISION_BATCH_PAGES) {
    throw new HttpError(413, 'too_large', `Send at most ${VISION_BATCH_PAGES} pages in one request.`)
  }
  return value.map(({ page, image }) => {
    if (!Number.isInteger(page) || typeof image !== 'string' || !image.startsWith('data:image/')) {
      throw new HttpError(400, 'bad_request', 'Each page needs a number and an image as a data URL.')
    }
    if (image.length > MAX_IMAGE_CHARS) throw new HttpError(413, 'too_large', 'A page image is too large.')
    return { page, image }
  })
}

// Some models wrap the text in a code fence. The fence is not part of the page.
const unfence = (text) => text.trim().replace(/^```[a-z]*\n([\s\S]*?)\n?```$/i, '$1').trim()

export default async function handler(req, res) {
  let key
  try {
    if (req.method !== 'POST') throw new HttpError(405, 'bad_request', 'Use POST.')
    const call = readCall(req)
    key = call.key
    const pages = readPages(call.body.pages)
    const results = await Promise.all(
      pages.map(async ({ page, image }) => {
        const text = await complete({ key, provider: call.provider, messages: buildTranscribeMessages(image) })
        return { page, text: unfence(text) }
      }),
    )
    res.status(200).json({ pages: results })
  } catch (err) {
    sendError(res, err, key)
  }
}
