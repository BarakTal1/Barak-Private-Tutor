import { render, screen } from '@testing-library/react'
import TutorCharacter from '../../src/ui/TutorCharacter.jsx'
import { he } from '../../src/ui/he.js'
import { mockMotionPreference } from '../helpers/motion.js'

const MOODS = ['talk', 'think', 'cheer', 'encourage', 'lean', 'sleepy', 'dance', 'still']

afterEach(() => vi.unstubAllGlobals())

test.each(MOODS)('renders the %s mood with a Hebrew aria-label', (mood) => {
  mockMotionPreference(false)
  render(<TutorCharacter mood={mood} />)
  const image = screen.getByRole('img')
  expect(image).toHaveAttribute('aria-label', `ברק, המורה: ${he.tutor.moods[mood]}`)
  expect(image).toHaveAttribute('data-tutor', mood)
})

test('the default mood is talk and the default size is 48', () => {
  mockMotionPreference(false)
  render(<TutorCharacter />)
  const image = screen.getByRole('img')
  expect(image).toHaveAttribute('data-tutor', 'talk')
  expect(image).toHaveAttribute('width', '48')
})

test('every mood has a Hebrew label', () => {
  expect(Object.keys(he.tutor.moods).sort()).toEqual([...MOODS].sort())
})

test('with full motion the character moves', () => {
  mockMotionPreference(false)
  render(<TutorCharacter mood="cheer" />)
  expect(screen.getByRole('img')).toHaveAttribute('data-motion', 'on')
})

test('with reduced motion no element has an animation', () => {
  mockMotionPreference(true)
  const { container } = render(<TutorCharacter mood="dance" />)
  expect(screen.getByRole('img')).toHaveAttribute('data-motion', 'off')
  for (const element of container.querySelectorAll('*')) {
    expect(element.style.animation ?? '').toMatch(/^(none)?$/)
  }
})

test('a cheering character has sparkles and a thinking character has dots', () => {
  mockMotionPreference(false)
  const cheer = render(<TutorCharacter mood="cheer" />)
  expect(cheer.container.querySelectorAll('[data-part="sparkle"]')).toHaveLength(3)
  cheer.unmount()
  const think = render(<TutorCharacter mood="think" />)
  expect(think.container.querySelectorAll('[data-part="dot"]')).toHaveLength(3)
})
