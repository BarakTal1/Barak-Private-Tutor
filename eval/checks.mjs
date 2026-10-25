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

export const questionCount = (text) => (text.match(/[?？]/g) ?? []).length

// The numbers of the list that the text mentions as numbers of their own.
export const leaks = (text, numbers) => numbers.filter((number) => mentionsNumber(text, number))

const NEGATIVE_START = /^(not (exactly|quite|really|right)|no[,.!\s]|that('s| is) not (quite )?(right|correct)|incorrect|wrong)/i
const POSITIVE_START = /^(yes|exactly|correct|that('s| is) (right|correct|exactly))/i

// True when a sentence that says "not exactly" is followed by a sentence that says "yes, exactly".
// A reply that says "right about X, but not quite Y" is fine, and so is a reply that is only positive or only negative.
export function contradictsItself(text) {
  const sentences = text.trim().split(/(?<=[.!?])\s+/).filter(Boolean)
  const negative = sentences.findIndex((sentence) => NEGATIVE_START.test(sentence))
  return negative !== -1 && sentences.slice(negative + 1).some((sentence) => POSITIVE_START.test(sentence))
}

const FRENCH = ['le', 'la', 'les', 'un', 'une', 'des', 'est', 'sont', 'vous', 'je', 'nous', 'de', 'du', 'et', 'que', 'qui', 'pour', 'dans', 'avec', 'ce', 'cette', 'tu', 'pas']
const ENGLISH = ['the', 'is', 'are', 'you', 'and', 'that', 'this', 'with', 'for', 'of', 'to', 'what', 'do']

// True when French function words clearly win over English ones.
export function looksFrench(text) {
  const words = tokens(text)
  const french = words.filter((word) => FRENCH.includes(word)).length
  const english = words.filter((word) => ENGLISH.includes(word)).length
  return french >= 3 && french / (french + english) >= 0.7
}

// Rules that every message of the tutor must follow, in every scenario.
// `turn` is { text, control }. It returns the rules that the message breaks.
export function invariantViolations({ text, control }) {
  const broken = []
  if (control == null) broken.push('no control line')
  if (wordCount(text) > 150) broken.push('over 150 words')
  if (questionCount(text) > 3) broken.push('more than 3 questions')
  return broken
}

const MASCULINE = ['אתה', 'לך', 'נסה', 'חשוב', 'ספר', 'תאר', 'כתוב', 'בוא', 'תגיד', 'תכתוב', 'שים', 'תן']

// True when a Hebrew text speaks to one boy ("אתה", "ספר לי"). A text for a class or a girl should use plural or neutral forms.
export function usesMasculineAddress(text) {
  const words = text.replace(NIKUD, '').split(/[^\p{L}]+/u)
  return words.some((word) => MASCULINE.includes(word))
}
