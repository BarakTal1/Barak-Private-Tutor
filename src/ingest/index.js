import { MAX_FILE_BYTES, MAX_VISION_PAGES, VISION_BATCH_PAGES } from '../../shared/limits.js'
import { ParseError } from './errors.js'
import { readImage } from './image.js'
import { detectKind } from './kind.js'
import { readOfficeFile } from './office.js'
import { chunkPassages } from './passages.js'
import { readPdf } from './pdf.js'
import { readTextFile } from './text.js'

const VERY_SHORT_CHARS = 50

function readPages(file, { tier, kind }, onProgress) {
  if (tier === 'text') return readTextFile(file, kind)
  if (tier === 'office') return readOfficeFile(file, kind)
  if (tier === 'image') return readImage(file, kind)
  return readPdf(file, { onProgress: (done, total) => onProgress({ stage: 'reading', done, total }) })
}

const skipped = (note) => ({ method: 'skipped', note })

// Pages whose text can be trusted use it. The other pages are drawn and sent to the vision model.
// Every page ends as text, vision, skipped or failed, so the report can tell the teacher what happened.
async function routePages(entries, { provider, transcribe, onProgress }) {
  const results = new Map()
  const warnings = []
  const poor = []
  for (const entry of entries) {
    if (entry.needsVision) poor.push(entry)
    else results.set(entry.number, { method: 'text', text: entry.text })
  }
  const numbers = (list) => list.map((entry) => entry.number)

  if (!provider.vision) {
    for (const entry of poor) results.set(entry.number, skipped('vision_off'))
    if (poor.length) warnings.push({ code: 'vision_off', params: { pages: numbers(poor) } })
    return { results, warnings }
  }

  const toSend = poor.slice(0, MAX_VISION_PAGES)
  const overLimit = poor.slice(MAX_VISION_PAGES)
  for (const entry of overLimit) results.set(entry.number, skipped('vision_capped'))
  if (overLimit.length) {
    warnings.push({ code: 'vision_capped', params: { limit: MAX_VISION_PAGES, skipped: overLimit.length } })
  }

  for (let start = 0; start < toSend.length; start += VISION_BATCH_PAGES) {
    const batch = toSend.slice(start, start + VISION_BATCH_PAGES)
    onProgress({ stage: 'vision', done: start, total: toSend.length })
    const drawn = []
    for (const entry of batch) {
      try {
        drawn.push({ page: entry.number, image: await entry.render() })
      } catch (err) {
        if (!(err instanceof ParseError)) throw err
        results.set(entry.number, { method: 'failed', note: 'render' })
      }
    }
    if (!drawn.length) continue
    let answers
    try {
      answers = await transcribe(drawn)
    } catch (err) {
      if (err?.code !== 'no_vision') throw err
      const rest = toSend.slice(start).filter((entry) => !results.has(entry.number))
      for (const entry of rest) results.set(entry.number, skipped('no_vision_model'))
      warnings.push({ code: 'no_vision_model', params: { pages: numbers(rest) } })
      break
    }
    for (const { page } of drawn) {
      const text = answers.find((answer) => answer.page === page)?.text ?? ''
      results.set(page, text.trim() ? { method: 'vision', text } : { method: 'failed', note: 'empty' })
    }
  }
  onProgress({ stage: 'vision', done: toSend.length, total: toSend.length })
  return { results, warnings }
}

// Checks a file by its size and its name, without reading it. Returns the kind of the file,
// or throws the ParseError that ingestFile would throw. The UI uses it the moment a file is chosen.
export function checkFile(file) {
  if (file.size > MAX_FILE_BYTES) {
    throw new ParseError('too_large', 'The file is too large.', { limit: MAX_FILE_BYTES })
  }
  const detected = detectKind(file)
  if (detected.tier === 'message') {
    throw new ParseError('unsupported', 'This file type is not supported.', { reason: detected.reason })
  }
  return detected
}

// The one entry point of the ingestion layer: a file becomes numbered passages and a report.
// `transcribe(pages)` asks the model to read page images. It is passed in so this layer
// does not depend on the network code.
export async function ingestFile(file, { provider, transcribe, onProgress = () => {} }) {
  const detected = checkFile(file)

  onProgress({ stage: 'reading', done: 0, total: 1 })
  const { pages, warnings: parserWarnings = [], totalPages } = await readPages(file, detected, onProgress)
  if (!pages.length) throw new ParseError('empty', 'The file has no text.')
  const entries = pages.map((page, index) => ({ ...page, number: page.page ?? index + 1 }))

  const { results, warnings: visionWarnings } = await routePages(entries, { provider, transcribe, onProgress })
  const warnings = [...parserWarnings]
  if (totalPages > pages.length) warnings.push({ code: 'pages_capped', params: { read: pages.length, total: totalPages } })
  warnings.push(...visionWarnings)

  const readable = entries
    .filter((entry) => results.get(entry.number).text)
    .map((entry) => ({
      page: entry.page,
      label: entry.label,
      text: results.get(entry.number).text,
      source: results.get(entry.number).method === 'vision' ? 'vision' : 'text',
    }))
  const passages = chunkPassages(readable)
  if (!passages.length) {
    throw new ParseError('nothing_readable', 'No page of the file could be read.', {
      visionOff: !provider.vision,
    })
  }
  const chars = passages.reduce((sum, passage) => sum + passage.text.length, 0)
  if (chars < VERY_SHORT_CHARS) warnings.push({ code: 'very_short', params: { chars } })

  return {
    fileName: file.name,
    passages,
    pages: entries.map(({ number }) => {
      const { method, note } = results.get(number)
      return note ? { page: number, method, note } : { page: number, method }
    }),
    warnings,
  }
}
