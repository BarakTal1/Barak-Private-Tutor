import { render, screen } from '@testing-library/react'
import ProgressPath from '../../src/ui/ProgressPath.jsx'
import { fmt, he } from '../../src/ui/he.js'
import { mockMotionPreference } from '../helpers/motion.js'

const steps = (...statuses) => statuses.map((status) => ({ status, attempts: 0, hintLevel: 0 }))

beforeEach(() => mockMotionPreference(false))
afterEach(() => vi.unstubAllGlobals())

test('is a progress bar with the step counter as its text', () => {
  render(<ProgressPath steps={steps('done', 'done', 'teaching', 'pending', 'pending')} currentIndex={2} />)
  const bar = screen.getByRole('progressbar', { name: he.lesson.pathLabel })
  expect(bar).toHaveAttribute('aria-valuemin', '1')
  expect(bar).toHaveAttribute('aria-valuemax', '5')
  expect(bar).toHaveAttribute('aria-valuenow', '3')
  expect(bar).toHaveAttribute('aria-valuetext', fmt(he.lesson.stepCounter, { current: 3, total: 5 }))
})

test('has one node for each step with its state in text for screen readers', () => {
  render(<ProgressPath steps={steps('done', 'teaching', 'pending')} currentIndex={1} />)
  const nodes = screen.getAllByRole('listitem')
  expect(nodes).toHaveLength(3)
  expect(nodes[0]).toHaveTextContent(he.lesson.outlineDone)
  expect(nodes[1]).toHaveTextContent(he.lesson.outlineCurrent)
  expect(nodes[2]).toHaveTextContent(he.lesson.outlineNext)
  expect(nodes[1]).toHaveAttribute('aria-current', 'step')
})

test('a done node has a star and the current node pulses', () => {
  const { container } = render(<ProgressPath steps={steps('done', 'teaching', 'pending')} currentIndex={1} />)
  const [done, current, next] = container.querySelectorAll('li')
  expect(done.querySelector('[data-star]')).toBeInTheDocument()
  expect(current.querySelector('[data-pulse]')).toBeInTheDocument()
  expect(next.querySelector('[data-star]')).toBeNull()
  expect(next.querySelector('[data-pulse]')).toBeNull()
})

test('the line between two done steps is full and the other lines are empty', () => {
  const { container } = render(<ProgressPath steps={steps('done', 'done', 'teaching', 'pending')} currentIndex={2} />)
  const fills = [...container.querySelectorAll('[data-fill]')].map((fill) => fill.style.width)
  expect(fills).toEqual(['100%', '100%', '0%'])
})

test('with reduced motion nothing pulses and the fill does not animate', () => {
  mockMotionPreference(true)
  const { container } = render(<ProgressPath steps={steps('done', 'teaching')} currentIndex={1} />)
  expect(container.querySelector('[data-pulse]')).toBeNull()
  expect(container.querySelector('[data-fill]').className).not.toMatch(/transition/)
})

test('a single step has a node and no line', () => {
  const { container } = render(<ProgressPath steps={steps('teaching')} currentIndex={0} />)
  expect(container.querySelectorAll('li')).toHaveLength(1)
  expect(container.querySelectorAll('[data-fill]')).toHaveLength(0)
})

test('a lesson with many steps stays inside its container', () => {
  const many = steps(...Array.from({ length: 30 }, (_, i) => (i < 5 ? 'done' : 'pending')))
  const { container } = render(<ProgressPath steps={many} currentIndex={5} />)
  expect(container.querySelectorAll('li')).toHaveLength(30)
  expect(container.firstChild.className).toMatch(/overflow-hidden|min-w-0/)
})
