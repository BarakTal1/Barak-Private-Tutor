// Small, deterministic checks that the scenarios use to judge a reply. They look at the text only.

const NIKUD = /[֑-ׇ]/g

const tokens = (text) => text.toLowerCase().replace(/[^\p{L}'\s]/gu, ' ').split(/\s+/).filter(Boolean)

export const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length

// True when the number appears as a number of its own: 70 is not in 170, 2070 or 70.5.
export const mentionsNumber = (text, number) => new RegExp(`(?<![\\d.])${number}(?!\\.?\\d)`).test(text)

// True when most of the letters are Hebrew letters.
export function looksHebrew(text) {
  const letters = text.match(/\p{L}/gu) ?? []
  const hebrew = letters.filter((letter) => /[א-ת]/.test(letter))
  return letters.length > 0 && hebrew.length / letters.length >= 0.7
}

// How many of the known words appear in a Hebrew text (a prefix such as "ה" is fine).
export function hebrewWordsFound(text, known) {
  const clean = text.replace(NIKUD, '').replace(/[^\p{L}\s]/gu, ' ')
  return known.filter((word) => clean.includes(word)).length
}

// How many words of the list the text uses.
export const commonWords = (text, list) => new Set(tokens(text).filter((word) => list.includes(word))).size
