import { scorePage } from '../../src/ingest/quality.js'

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
