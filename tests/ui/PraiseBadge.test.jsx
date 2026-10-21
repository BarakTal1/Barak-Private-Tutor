import { render, screen } from '@testing-library/react'
import PraiseBadge from '../../src/ui/PraiseBadge.jsx'
import { mockMotionPreference } from '../helpers/motion.js'

afterEach(() => vi.unstubAllGlobals())

test('shows the phrase in a status region', () => {
  mockMotionPreference(false)
  render(<PraiseBadge text="כל הכבוד!" />)
  expect(screen.getByRole('status')).toHaveTextContent('כל הכבוד!')
})

test('with full motion it pops in and throws confetti', () => {
  mockMotionPreference(false)
  const { container } = render(<PraiseBadge text="מעולה!" />)
  expect(screen.getByRole('status').className).toMatch(/pop/)
  expect(container.querySelector('[data-confetti]')).toBeInTheDocument()
})

test('with reduced motion it only fades in and has no confetti', () => {
  mockMotionPreference(true)
  const { container } = render(<PraiseBadge text="מעולה!" />)
  const { className } = screen.getByRole('status')
  expect(className).not.toMatch(/pop/)
  expect(className).toMatch(/fade-in/)
  expect(container.querySelector('[data-confetti]')).toBeNull()
})

test('uses the warm celebration color and a star, not color alone', () => {
  mockMotionPreference(false)
  const { container } = render(<PraiseBadge text="בול!" />)
  expect(screen.getByRole('status').className).toMatch(/bg-acc/)
  expect(container.querySelector('svg')).toBeInTheDocument()
})
