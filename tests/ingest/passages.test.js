import { chunkPassages } from '../../src/ingest/passages.js'

const paragraph = (n) => `Paragraph ${n}. ${'word '.repeat(100)}`.trim()
const page = (text, number = 1) => ({ page: number, label: `Page ${number}`, text })

test('an empty input gives no passages', () => {
  expect(chunkPassages([])).toEqual([])
  expect(chunkPassages([page('   \n\n  ')])).toEqual([])
})

test('a short page is one passage with the page number in the label', () => {
  const [passage] = chunkPassages([page('Hello world.', 2)])
  expect(passage).toEqual({ id: 'p1', label: 'Page 2', page: 2, text: 'Hello world.', source: 'text' })
})

test('splits long text into passages with ids p1..pN, none longer than maxChars', () => {
  const text = Array.from({ length: 10 }, (_, i) => paragraph(i)).join('\n\n')
  const passages = chunkPassages([page(text)], { maxChars: 1200 })
  expect(passages.length).toBeGreaterThan(3)
  expect(passages.map((p) => p.id)).toEqual(passages.map((_, i) => `p${i + 1}`))
  for (const passage of passages) expect(passage.text.length).toBeLessThanOrEqual(1200)
})

test('labels of a page that splits into several passages are numbered', () => {
  const text = Array.from({ length: 6 }, (_, i) => paragraph(i)).join('\n\n')
  const labels = chunkPassages([page(text, 4)], { maxChars: 1200 }).map((p) => p.label)
  expect(labels[0]).toBe(`Page 4 (1/${labels.length})`)
  expect(labels.at(-1)).toBe(`Page 4 (${labels.length}/${labels.length})`)
})

test('ids continue across pages', () => {
  const passages = chunkPassages([page('One.', 1), page('Two.', 2), page('Three.', 3)])
  expect(passages.map((p) => p.id)).toEqual(['p1', 'p2', 'p3'])
})

test('never splits a Markdown table', () => {
  const rows = ['| a | b |', '| --- | --- |', '| 1 | 2 |', '| 3 | 4 |', '| 5 | 6 |']
  const text = [paragraph(1), rows.join('\n'), paragraph(2)].join('\n\n')
  const passages = chunkPassages([page(text)], { maxChars: 400 })
  expect(passages.some((p) => rows.every((row) => p.text.includes(row)))).toBe(true)
})

test('never splits a $$ block even with a blank line inside', () => {
  const math = '$$\na^2 + b^2\n\n= c^2\n$$'
  const text = [paragraph(1), math, paragraph(2)].join('\n\n')
  const passages = chunkPassages([page(text)], { maxChars: 400 })
  expect(passages.some((p) => p.text.includes(math))).toBe(true)
})

test('a very long paragraph without blank lines is split on sentences', () => {
  const sentence = 'This is one sentence about triangles. '
  const passages = chunkPassages([page(sentence.repeat(100))], { maxChars: 500 })
  expect(passages.length).toBeGreaterThan(5)
  for (const passage of passages) expect(passage.text.length).toBeLessThanOrEqual(500)
})

test('a long text with no spaces or sentence ends is still cut to maxChars', () => {
  const passages = chunkPassages([page('x'.repeat(2500))], { maxChars: 1000 })
  expect(passages).toHaveLength(3)
  expect(passages.map((p) => p.text).join('')).toBe('x'.repeat(2500))
})

test('a heading starts a new passage once the current one has some text', () => {
  const text = `# One\n\n${paragraph(1)}\n\n# Two\n\n${paragraph(2)}`
  const passages = chunkPassages([page(text)], { maxChars: 1500 })
  expect(passages).toHaveLength(2)
  expect(passages[1].text.startsWith('# Two')).toBe(true)
})

test('keeps the source of a page that was read with vision', () => {
  const [passage] = chunkPassages([{ ...page('Scanned text.'), source: 'vision' }])
  expect(passage.source).toBe('vision')
})

test('Hebrew text is kept as it is', () => {
  const [passage] = chunkPassages([page('שלום עולם. זהו שיעור.')])
  expect(passage.text).toBe('שלום עולם. זהו שיעור.')
})
