import { act, render } from '@testing-library/react'
import Confetti from '../../src/ui/Confetti.jsx'
import { mockMotionPreference } from '../helpers/motion.js'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

test('renders the number of particles it was asked for', () => {
  mockMotionPreference(false)
  const { container } = render(<Confetti count={24} durationMs={700} />)
  expect(container.querySelectorAll('[data-particle]')).toHaveLength(24)
})

test('is hidden from screen readers and does not take clicks', () => {
  mockMotionPreference(false)
  const { container } = render(<Confetti count={5} durationMs={700} />)
  const root = container.querySelector('[data-confetti]')
  expect(root).toHaveAttribute('aria-hidden', 'true')
  expect(root.className).toMatch(/pointer-events-none/)
})

test('removes itself after the duration and calls onDone once', () => {
  mockMotionPreference(false)
  const onDone = vi.fn()
  const { container } = render(<Confetti count={5} durationMs={700} onDone={onDone} />)
  act(() => vi.advanceTimersByTime(699))
  expect(container.querySelector('[data-confetti]')).toBeInTheDocument()
  expect(onDone).not.toHaveBeenCalled()
  act(() => vi.advanceTimersByTime(1))
  expect(container.querySelector('[data-confetti]')).toBeNull()
  expect(onDone).toHaveBeenCalledTimes(1)
})

test('renders nothing with reduced motion, and still calls onDone', () => {
  mockMotionPreference(true)
  const onDone = vi.fn()
  const { container } = render(<Confetti count={24} durationMs={700} onDone={onDone} />)
  expect(container.querySelector('[data-confetti]')).toBeNull()
  act(() => vi.advanceTimersByTime(700))
  expect(onDone).toHaveBeenCalledTimes(1)
})

test('the particles are always the same for the same count', () => {
  mockMotionPreference(false)
  const first = render(<Confetti count={6} durationMs={700} />).container.innerHTML
  const second = render(<Confetti count={6} durationMs={700} />).container.innerHTML
  expect(second).toBe(first)
})
