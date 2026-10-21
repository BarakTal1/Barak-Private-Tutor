import { act, render, screen } from '@testing-library/react'
import { useReducedMotion } from '../../src/ui/motion.js'
import { mockMotionPreference } from '../helpers/motion.js'

function Probe() {
  return <p>{useReducedMotion() ? 'reduced' : 'full'}</p>
}

afterEach(() => vi.unstubAllGlobals())

test('useReducedMotion follows matchMedia and updates when it changes', () => {
  const media = mockMotionPreference(false)
  render(<Probe />)
  expect(screen.getByText('full')).toBeInTheDocument()
  act(() => media.set(true))
  expect(screen.getByText('reduced')).toBeInTheDocument()
  act(() => media.set(false))
  expect(screen.getByText('full')).toBeInTheDocument()
})

test('starts reduced when the system asks for it', () => {
  mockMotionPreference(true)
  render(<Probe />)
  expect(screen.getByText('reduced')).toBeInTheDocument()
})

test('is not reduced when matchMedia does not exist', () => {
  vi.stubGlobal('matchMedia', undefined)
  render(<Probe />)
  expect(screen.getByText('full')).toBeInTheDocument()
})

test('stops listening when the component goes away', () => {
  const media = mockMotionPreference(false)
  const { unmount } = render(<Probe />)
  expect(media.listeners.size).toBe(1)
  unmount()
  expect(media.listeners.size).toBe(0)
})
