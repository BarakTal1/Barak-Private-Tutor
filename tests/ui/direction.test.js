import { directionOf } from '../../src/ui/direction.js'

test.each(['Hebrew', 'עברית', 'he', 'HE', 'Arabic', 'ערבית', 'ar', 'Persian', 'Farsi', 'Urdu', 'עברית (Hebrew)'])(
  '%s is right to left',
  (language) => expect(directionOf(language)).toBe('rtl'),
)

test.each(['French', 'צרפתית', 'English', 'אנגלית', 'Spanish', 'fr', 'de'])('%s is left to right', (language) => {
  expect(directionOf(language)).toBe('ltr')
})

test('an empty or missing language lets each block decide', () => {
  expect(directionOf('')).toBe('auto')
  expect(directionOf('  ')).toBe('auto')
  expect(directionOf(undefined)).toBe('auto')
})
