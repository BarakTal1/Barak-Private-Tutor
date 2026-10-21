import {
  commonWords,
  hebrewWordsFound,
  looksFrench,
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

describe('looksFrench', () => {
  test('is true for a French sentence', () => {
    expect(looksFrench('Bonjour ! Un triangle est une figure avec trois côtés. Que pensez-vous de cela ?')).toBe(true)
  })

  test('is false for an English sentence', () => {
    expect(looksFrench('A triangle is a shape with three sides. What do you think of that?')).toBe(false)
  })

  test('is false for a French sentence that is followed by a long English one', () => {
    expect(looksFrench('Un triangle est une figure. The sum of the angles is 180 and that is the rule for the triangle.')).toBe(false)
  })

  test('is false for an empty text', () => {
    expect(looksFrench('')).toBe(false)
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
