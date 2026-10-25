const MIN_CHARS = 15
const GARBLED_SHARE = 0.05
const FULL_SCORE_CHARS = 100

const GARBLED = /[�-\u0000-\u0008\u000B\u000C\u000E-\u001F]/g
const ARABIC = /[؀-ۿﭐ-﷿ﹰ-﻿]/g
const ARABIC_FORMS = /[ﭐ-﷿ﹰ-﻿]/g
const HEBREW_WORD = /[א-ת]{3,}/g
const STARTS_WITH_FINAL_LETTER = /^[ךםןףץ]/

const count = (text, pattern) => (text.match(pattern) ?? []).length
const poor = (reason) => ({ score: 0.1, needsVision: true, reason })

// Tells if the text of a page can be trusted. A page that fails goes to the vision model.
export function scorePage(text) {
  const compact = text.replace(/\s/g, '')
  if (compact.length < MIN_CHARS) return { score: 0, needsVision: true, reason: 'empty' }

  const garbled = count(compact, GARBLED) / compact.length
  if (garbled > GARBLED_SHARE) return poor('garbled')

  // PDF extraction can return Arabic as separate display forms, in visual order.
  const arabic = count(compact, ARABIC)
  if (arabic >= 10 && count(compact, ARABIC_FORMS) / arabic > 0.5) return poor('presentation_forms')

  // In real Hebrew, final-form letters (ך ם ן ף ץ) only end a word. A word that starts
  // with one means the characters came out in reverse order.
  const hebrewWords = text.match(HEBREW_WORD) ?? []
  const reversed = hebrewWords.filter((word) => STARTS_WITH_FINAL_LETTER.test(word)).length
  if (reversed >= 2 && reversed / hebrewWords.length > 0.03) return poor('reversed_rtl')

  return { score: Math.min(1, compact.length / FULL_SCORE_CHARS) * (1 - garbled), needsVision: false, reason: 'ok' }
}

// A page that is mostly one picture is a scan. Its text, if any, is a layer that a scanner app added.
const SCAN_COVERAGE = 0.5
// A stamp or a page number is short. The text layer of a real scanned page is longer.
const SCAN_LAYER_CHARS = 150
const AGREE_SHARE = 0.6

// Like scorePage, for a pdf page. `imageCoverage` is the share of the page that pictures cover (0 to 1).
// A scan with a short text layer (a stamp, a page number) goes to vision, because the text is not the page.
// A scan with a long text layer is trusted, but `check` asks for a look at the picture to compare.
export function scorePdfPage(text, imageCoverage) {
  const result = scorePage(text)
  if (result.needsVision || imageCoverage < SCAN_COVERAGE) return result
  const chars = text.replace(/\s/g, '').length
  if (chars < SCAN_LAYER_CHARS) return poor('image_page')
  return { ...result, check: true }
}

const words = (text) =>
  new Set(
    text
      .toLowerCase()
      .replace(/[֑-ׇ]/g, '')
      .split(/[^\p{L}\p{N}]+/u)
      .filter((word) => word.length > 1),
  )

// Tells if the text layer of a scan has the same words as the text that the model read from the picture.
// Small differences are normal. An answer with no words decides nothing.
export function layerAgrees(layerText, visionText) {
  const layer = words(layerText)
  const vision = words(visionText)
  if (!vision.size) return true
  const shared = [...layer].filter((word) => vision.has(word)).length
  return (2 * shared) / (layer.size + vision.size) >= AGREE_SHARE
}
