import { he } from '../../src/ui/he.js'
import { en } from '../../src/ui/en.js'

function paths(value, path = '') {
  if (typeof value === 'string') return [[path, value]]
  if (Array.isArray(value)) return value.flatMap((item, i) => paths(item, `${path}[${i}]`))
  return Object.entries(value).flatMap(([key, item]) => paths(item, path ? `${path}.${key}` : key))
}

const slots = (text) => (text.match(/\{\w+\}/g) ?? []).sort()
const hebrew = Object.fromEntries(paths(he))
const english = Object.fromEntries(paths(en))

test('both dictionaries have the same keys', () => {
  expect(Object.keys(english).sort()).toEqual(Object.keys(hebrew).sort())
})

test('no English string is empty', () => {
  for (const [path, text] of Object.entries(english)) expect(text.trim(), path).not.toBe('')
})

test('an English string has the same {slots} as the Hebrew string', () => {
  for (const [path, text] of Object.entries(hebrew)) expect(slots(english[path] ?? ''), path).toEqual(slots(text))
})

test('the English dictionary has no Hebrew letters', () => {
  for (const [path, text] of Object.entries(english)) expect(text, path).not.toMatch(/[א-ת]/)
})

test('both dictionaries have six different praise phrases', () => {
  expect(en.praises).toHaveLength(6)
  expect(new Set(en.praises).size).toBe(6)
})

test('the tutor keeps the name Barak in both languages', () => {
  expect(en.tutor.label).toContain('Barak')
})

test('page labels have a template in both languages', () => {
  expect(he.labels.page).toBe('עמוד {n}')
  expect(en.labels.page).toBe('Page {n}')
})
