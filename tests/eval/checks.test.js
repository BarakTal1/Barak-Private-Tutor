import {
  commonWords,
  contradictsItself,
  invariantViolations,
  leaks,
  looksFrench,
  usesMasculineAddress,
  questionCount,
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

describe('questionCount', () => {
  test.each([['', 0], ['No question.', 0], ['What now?', 1], ['Why? And how? Really?', 3], ['מה דעתכם?', 1]])(
    '"%s" has %i',
    (text, count) => expect(questionCount(text)).toBe(count),
  )
})

describe('leaks', () => {
  test('returns the numbers that the text mentions as numbers', () => {
    expect(leaks('50 + 60 = 110, so the third angle is 70.', [70, 110, 180])).toEqual([70, 110])
  })

  test('does not find a number inside a longer number', () => {
    expect(leaks('about 170 or 1100', [70, 110])).toEqual([])
  })
})

describe('contradictsItself', () => {
  test.each([
    'Not exactly. Let us try another way. Yes, exactly! That is the right idea.',
    'That is not quite right. Think again. Correct! You got it.',
  ])('is true for: %s', (text) => expect(contradictsItself(text)).toBe(true))

  test.each([
    'That is right about the 180. But not quite the rest, so what is left?',
    'Not exactly. Let us try a smaller question: how many sides?',
    'Yes, exactly! The angles add up to 180.',
    '',
  ])('is false for: %s', (text) => expect(contradictsItself(text)).toBe(false))
})

describe('looksFrench', () => {
  test('is true for a French tutor message', () => {
    expect(looksFrench('Bonjour ! Un triangle est une forme avec trois côtés. Que pensez-vous de la somme des angles dans un triangle ?')).toBe(true)
  })

  test('is false for English and for Hebrew', () => {
    expect(looksFrench('A triangle is a shape with three sides. What do you think of the sum of the angles?')).toBe(false)
    expect(looksFrench('משולש הוא צורה עם שלוש צלעות')).toBe(false)
  })
})

describe('invariantViolations', () => {
  const control = { verdict: 'partial', advance: false }

  test('a short message with one question and a control line has none', () => {
    expect(invariantViolations({ text: 'Good start. What do you think?', control })).toEqual([])
  })

  test('a message with no control line is reported', () => {
    expect(invariantViolations({ text: 'Hello.', control: null })).toEqual(['no control line'])
  })

  test('a very long message is reported', () => {
    expect(invariantViolations({ text: 'word '.repeat(160), control })).toEqual(['over 150 words'])
  })

  test('more than three questions are reported', () => {
    expect(invariantViolations({ text: 'A? B? C? D?', control })).toEqual(['more than 3 questions'])
  })
})

describe('usesMasculineAddress', () => {
  test.each([
    'אתה בטח מכיר משולש. ספר לי מה אתה חושב.',
    'נסה לצייר משולש ותגיד מה אתה רואה',
  ])('is true for: %s', (text) => expect(usesMasculineAddress(text)).toBe(true))

  test.each([
    'בואו נתחיל. נסו לצייר משולש ותגידו מה אתם רואים.',
    'מה לדעתכם יקרה לצורה?',
    'Hello, try to draw a triangle.',
    '',
  ])('is false for: %s', (text) => expect(usesMasculineAddress(text)).toBe(false))
})
