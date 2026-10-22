import { pathOf, phaseOf } from '../src/route.js'

test('every phase has its own address and the address leads back to it', () => {
  for (const phase of ['setup', 'report', 'lesson', 'done']) expect(phaseOf(pathOf(phase))).toBe(phase)
  expect(new Set(['setup', 'report', 'lesson', 'done'].map(pathOf)).size).toBe(4)
})

test('an unknown address or a trailing slash is handled', () => {
  expect(phaseOf('/nothing')).toBe('setup')
  expect(phaseOf('/lesson/')).toBe('lesson')
})
