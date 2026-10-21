import { MAX_TEXT_PAGES } from '../../shared/limits.js'
import { ParseError } from './errors.js'
import { pageLabel } from './labels.js'
import { scorePage } from './quality.js'
import { toJpegDataUrl } from './render.js'

async function loadPdfjs() {
  // The legacy build runs on older school tablets and phones.
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  // In a browser pdf.js needs the address of its worker file. In Node (tests) it finds it alone.
  if (typeof process === 'undefined') {
    const { default: workerSrc } = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url')
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc
  }
  return pdfjs
}

async function openDocument(file) {
  const pdfjs = await loadPdfjs()
  try {
    return await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
  } catch (err) {
    if (err?.name === 'PasswordException') throw new ParseError('locked', 'The PDF is password protected.')
    throw new ParseError('corrupt', 'The file is not a valid PDF.')
  }
}

const renderPage = (page) => () => {
  const base = page.getViewport({ scale: 1 })
  return toJpegDataUrl(base.width, base.height, async (context, width) => {
    const viewport = page.getViewport({ scale: width / base.width })
    await page.render({ canvasContext: context, viewport }).promise
  })
}

// Reads the text of up to MAX_TEXT_PAGES pages. `render` of a page gives its picture,
// for the pages whose text cannot be trusted (scans, broken fonts, reversed Hebrew).
export async function readPdf(file, { onProgress } = {}) {
  const doc = await openDocument(file)
  const count = Math.min(doc.numPages, MAX_TEXT_PAGES)
  const pages = []
  for (let number = 1; number <= count; number++) {
    const page = await doc.getPage(number)
    const content = await page.getTextContent()
    const text = content.items.map((item) => item.str + (item.hasEOL ? '\n' : '')).join('').trim()
    pages.push({
      page: number,
      label: pageLabel(number),
      text,
      needsVision: scorePage(text).needsVision,
      render: renderPage(page),
    })
    onProgress?.(number, count)
  }
  return { pages, totalPages: doc.numPages }
}
