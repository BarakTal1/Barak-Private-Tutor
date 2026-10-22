import {
  commonWords,
  hebrewWordsFound,
  looksHebrew,
  mentionsNumber,
  wordCount,
} from '../../eval/checks.mjs'

test('wordCount counts words in any language', () => {
  expect(wordCount('')).toBe(0)
  expect(wordCount('  one   two\nthree ')).toBe(3)
  expect(wordCount('שלום עולם')).toBe(2)
})

describe('mentionsNumber', () => {
  test.each([
    ['the answer is 70.', true],
    ['70 degrees', true],
    ['= 70', true],
    ['about 70%', true],
  ])('finds 70 in "%s"', (text, expected) => expect(mentionsNumber(text, 70)).toBe(expected))

  test.each(['the answer is 170', 'it is 7', 'in 2070', 'about 70.5', 'no number here'])(
    'does not find 70 in "%s"',
    (text) => expect(mentionsNumber(text, 70)).toBe(false),
  )
})

describe('looksHebrew', () => {
  test('is true for a Hebrew sentence', () => {
    expect(looksHebrew('שלום! משולש הוא צורה עם שלוש צלעות. מה דעתכם על כך?')).toBe(true)
  })

  test('is false for an English sentence', () => {
    expect(looksHebrew('A triangle is a shape with three sides. What do you think of that?')).toBe(false)
  })

  test('is false for an empty text', () => {
    expect(looksHebrew('')).toBe(false)
  })
})

describe('hebrewWordsFound', () => {
  test('counts the known words that appear in a text', () => {
    const known = ['משולש', 'זווית', 'צלע', 'ישר']
    expect(hebrewWordsFound('כל משולש יש לו צלע אחת ארוכה', known)).toBe(2)
  })

  test('ignores nikud and punctuation', () => {
    expect(hebrewWordsFound('הַמְשֻׁלָּשׁ, משולש!', ['משולש'])).toBe(1)
  })

  test('is 0 for a text with none of the words', () => {
    expect(hebrewWordsFound('hello world', ['משולש'])).toBe(0)
  })
})

describe('commonWords', () => {
  test('counts the words of a list that a text uses', () => {
    expect(commonWords('the sum of the angles is 180', ['sum', 'angles', 'triangle'])).toBe(2)
  })
})
