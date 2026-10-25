import { DEFAULT_OPTIONS, DIFFICULTIES, LESSON_MINUTES, OPTION_LANGUAGES, normalizeOptions } from '../../shared/options.js'

test('the lists and the defaults match the design', () => {
  expect(LESSON_MINUTES).toEqual([5, 10, 15, 30])
  expect(DIFFICULTIES).toEqual(['easy', 'medium', 'challenging'])
  expect(OPTION_LANGUAGES).toEqual(['he', 'en'])
  expect(DEFAULT_OPTIONS).toEqual({ minutes: 15, difficulty: 'medium', language: null })
})

test.each([undefined, null, {}, 'text', 7, []])('%j gives the defaults', (raw) => {
  expect(normalizeOptions(raw)).toEqual(DEFAULT_OPTIONS)
})

test('a value that is not in a list becomes the default of that field', () => {
  expect(normalizeOptions({ minutes: 0, difficulty: 'hard', language: 'fr' })).toEqual(DEFAULT_OPTIONS)
  expect(normalizeOptions({ minutes: 9999 })).toEqual(DEFAULT_OPTIONS)
  expect(normalizeOptions({ minutes: '10' })).toEqual(DEFAULT_OPTIONS)
})

test('valid values pass through', () => {
  expect(normalizeOptions({ minutes: 30, difficulty: 'challenging', language: 'en' })).toEqual({
    minutes: 30,
    difficulty: 'challenging',
    language: 'en',
  })
})

test('one bad field does not spoil the good ones', () => {
  expect(normalizeOptions({ minutes: 5, difficulty: 'nope', language: 'he' })).toEqual({ minutes: 5, difficulty: 'medium', language: 'he' })
})
