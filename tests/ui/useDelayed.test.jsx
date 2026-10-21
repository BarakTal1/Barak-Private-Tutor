import { act, render, screen } from '@testing-library/react'
import { useDelayed } from '../../src/ui/useDelayed.js'

function Probe({ active, ms = 4000 }) {
  return <p>{useDelayed(active, ms) ? 'late' : 'early'}</p>
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

test('turns true after the delay while active', () => {
  render(<Probe active />)
  expect(screen.getByText('early')).toBeInTheDocument()
  act(() => vi.advanceTimersByTime(3999))
  expect(screen.getByText('early')).toBeInTheDocument()
  act(() => vi.advanceTimersByTime(1))
  expect(screen.getByText('late')).toBeInTheDocument()
})

test('never turns true when it stops before the delay and resets for the next time', () => {
  const { rerender } = render(<Probe active />)
  act(() => vi.advanceTimersByTime(2000))
  rerender(<Probe active={false} />)
  act(() => vi.advanceTimersByTime(10000))
  expect(screen.getByText('early')).toBeInTheDocument()
  rerender(<Probe active />)
  act(() => vi.advanceTimersByTime(3999))
  expect(screen.getByText('early')).toBeInTheDocument()
})

test('goes back to false when active ends after the delay', () => {
  const { rerender } = render(<Probe active />)
  act(() => vi.advanceTimersByTime(4000))
  expect(screen.getByText('late')).toBeInTheDocument()
  rerender(<Probe active={false} />)
  expect(screen.getByText('early')).toBeInTheDocument()
})
