import { MAX_TEXT_PAGES } from '../../shared/limits.js'
import { ParseError } from './errors.js'
import { pageLabel } from './labels.js'
import { scorePdfPage } from './quality.js'
import { PDF_DPI, PDF_MAX_IMAGE_SIDE, toJpegDataUrl } from './render.js'

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
    const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
    return { doc, pdfjs }
  } catch (err) {
    if (err?.name === 'PasswordException') throw new ParseError('locked', 'The PDF is password protected.')
    throw new ParseError('corrupt', 'The file is not a valid PDF.')
  }
}

const POINTS_PER_INCH = 72

const renderPage = (page) => () => {
  const base = page.getViewport({ scale: 1 })
  const dpiScale = PDF_DPI / POINTS_PER_INCH
  return toJpegDataUrl(
    base.width * dpiScale,
    base.height * dpiScale,
    async (context, width) => {
      const viewport = page.getViewport({ scale: width / base.width })
      await page.render({ canvasContext: context, viewport }).promise
    },
    { maxSide: PDF_MAX_IMAGE_SIDE },
  )
}

const multiply = ([a1, b1, c1, d1, e1, f1], [a2, b2, c2, d2, e2, f2]) => [
  a2 * a1 + b2 * c1,
  a2 * b1 + b2 * d1,
  c2 * a1 + d2 * c1,
  c2 * b1 + d2 * d1,
  e2 * a1 + f2 * c1 + e1,
  e2 * b1 + f2 * d1 + f1,
]

// The share of the page that pictures cover, from 0 to 1. A scan is one picture that fills the page.
// A picture is drawn in a unit square, so its area is the area that the current matrix gives to that square.
async function imageCoverage(page, OPS) {
  const [left, bottom, right, top] = page.view
  const pageArea = (right - left) * (top - bottom)
  if (!pageArea) return 0
  const { fnArray, argsArray } = await page.getOperatorList()
  const pictures = new Set([OPS.paintImageXObject, OPS.paintInlineImageXObject, OPS.paintImageMaskXObject])
  const saved = []
  let matrix = [1, 0, 0, 1, 0, 0]
  let area = 0
  fnArray.forEach((op, index) => {
    const args = argsArray[index]
    if (op === OPS.save) saved.push(matrix)
    else if (op === OPS.restore) matrix = saved.pop() ?? matrix
    else if (op === OPS.transform) matrix = multiply(matrix, args)
    else if (op === OPS.paintFormXObjectBegin) {
      saved.push(matrix)
      if (args?.[0]) matrix = multiply(matrix, args[0])
    } else if (op === OPS.paintFormXObjectEnd) matrix = saved.pop() ?? matrix
    else if (pictures.has(op)) area += Math.abs(matrix[0] * matrix[3] - matrix[1] * matrix[2])
  })
  return Math.min(1, area / pageArea)
}

// Reads the text of up to MAX_TEXT_PAGES pages. `render` of a page gives its picture,
// for the pages whose text cannot be trusted (scans, broken fonts, reversed Hebrew).
export async function readPdf(file, { onProgress } = {}) {
  const { doc, pdfjs } = await openDocument(file)
  const count = Math.min(doc.numPages, MAX_TEXT_PAGES)
  const pages = []
  for (let number = 1; number <= count; number++) {
    const page = await doc.getPage(number)
    const content = await page.getTextContent()
    const text = content.items.map((item) => item.str + (item.hasEOL ? '\n' : '')).join('').trim()
    const { needsVision, check } = scorePdfPage(text, await imageCoverage(page, pdfjs.OPS))
    pages.push({
      page: number,
      label: pageLabel(number),
      text,
      needsVision,
      ...(check && { check }),
      render: renderPage(page),
    })
    onProgress?.(number, count)
  }
  return { pages, totalPages: doc.numPages }
}
