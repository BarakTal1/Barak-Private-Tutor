import { scorePage, scorePdfPage, layerAgrees } from '../../src/ingest/quality.js'

const english =
  'A triangle is a shape with three straight sides and three angles. The sum of the angles is always 180 degrees.'
const hebrew =
  'משולש הוא צורה עם שלוש צלעות ישרות. הילדים לומדים שסכום הזוויות במשולשים הוא תמיד מאה ושמונים מעלות. המורים מסבירים לתלמידים כל משולש מכיל שלוש זוויות פנימיות. שלום לכולם וברוכים הבאים.'
const reverseWords = (text) => text.split(' ').map((word) => [...word].reverse().join('')).join(' ')

test('empty text needs vision', () => {
  expect(scorePage('')).toMatchObject({ needsVision: true, reason: 'empty' })
  expect(scorePage('  \n ')).toMatchObject({ needsVision: true, reason: 'empty' })
})

test('a few stray characters need vision', () => {
  expect(scorePage('12')).toMatchObject({ needsVision: true, reason: 'empty' })
})

test('normal English text is good', () => {
  const result = scorePage(english)
  expect(result.needsVision).toBe(false)
  expect(result.score).toBeGreaterThan(0.5)
})

test('text with many replacement characters needs vision', () => {
  const garbled = `${english.slice(0, 40)}${'�'.repeat(30)}${english.slice(40)}`
  expect(scorePage(garbled)).toMatchObject({ needsVision: true, reason: 'garbled' })
})

test('text full of private-use characters needs vision', () => {
  expect(scorePage(' '.repeat(30))).toMatchObject({ needsVision: true, reason: 'garbled' })
})

test('normal Hebrew text is good', () => {
  expect(scorePage(hebrew).needsVision).toBe(false)
})

test('Hebrew text with every word reversed needs vision', () => {
  expect(scorePage(reverseWords(hebrew))).toMatchObject({ needsVision: true, reason: 'reversed_rtl' })
})

test('Arabic in presentation forms needs vision', () => {
  const forms = 'ﻣﺮﺣﺒﺎ ﺑﻜﻢ ﻓﻲ ﺍﻟﺪﺭﺱ ﺍﻟﺠﺪﻳﺪ ﻭﺳﻮﻑ ﻧﺘﻌﻠﻢ ﺍﻟﻴﻮﻡ ﻋﻦ ﺍﻟﻤﺜﻠﺜﺎﺕ'
  expect(scorePage(forms)).toMatchObject({ needsVision: true, reason: 'presentation_forms' })
})

test('normal Arabic text is good', () => {
  expect(scorePage('مرحبا بكم في الدرس الجديد وسوف نتعلم اليوم عن المثلثات').needsVision).toBe(false)
})

test('math and numbers count as readable text', () => {
  expect(scorePage('3² + 4² = 9 + 16 = 25, so c = 5 and a² + b² = c²').needsVision).toBe(false)
})

describe('scorePdfPage', () => {
  test('a page with no picture is scored by its text alone', () => {
    expect(scorePdfPage(english, 0)).toEqual(scorePage(english))
    expect(scorePdfPage('', 0)).toMatchObject({ needsVision: true, reason: 'empty' })
  })

  test('a page that is one big picture with a short stamp needs vision', () => {
    const stamp = 'Scanned with CamScanner  2024-03-05'
    expect(scorePage(stamp).needsVision).toBe(false)
    expect(scorePdfPage(stamp, 0.95)).toMatchObject({ needsVision: true, reason: 'image_page' })
  })

  test('a small picture with a short text is not treated as a scan', () => {
    expect(scorePdfPage('Figure 1. A right triangle.', 0.1).needsVision).toBe(false)
  })

  test('a page that is one big picture with a long text layer is trusted but must be checked', () => {
    expect(scorePdfPage(english.repeat(3), 0.95)).toMatchObject({ needsVision: false, check: true })
  })

  test('a page of normal text with a medium picture is not checked', () => {
    expect(scorePdfPage(english.repeat(3), 0.3).check).toBeFalsy()
  })

  test('a big picture with a broken text layer still needs vision for the old reason', () => {
    expect(scorePdfPage(reverseWords(hebrew), 0.95)).toMatchObject({ needsVision: true, reason: 'reversed_rtl' })
  })
})

describe('layerAgrees', () => {
  const read = 'הפוטוסינתזה היא התהליך שבו צמחים הופכים אור שמש לאנרגיה כימית בתוך העלה'
  const wrong = 'הפוטוסינתיזה היה התהליך שכו צמחם הופכם אוד שמש לאנרגיה כימיה בתוך העלה'

  test('the same words agree, also with other spacing and punctuation', () => {
    expect(layerAgrees(read, `${read}.\n`.replace(/ /g, '  '))).toBe(true)
  })

  test('a few small differences still agree', () => {
    expect(layerAgrees(read, read.replace('אור', 'אורות'))).toBe(true)
  })

  test('a layer with most words wrong does not agree', () => {
    expect(layerAgrees(wrong, read)).toBe(false)
  })

  test('a layer about another subject does not agree', () => {
    expect(layerAgrees(english, read)).toBe(false)
  })

  test('an empty answer of the model does not decide anything and agrees', () => {
    expect(layerAgrees(read, '  ')).toBe(true)
  })
})
