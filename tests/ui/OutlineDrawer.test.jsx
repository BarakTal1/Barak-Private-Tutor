import { render, screen, within } from '@testing-library/react'
import OutlineDrawer from '../../src/ui/OutlineDrawer.jsx'
import { he } from '../../src/ui/he.js'
import { plan } from '../helpers/lesson.js'

const progress = {
  currentStepIndex: 1,
  steps: [
    { status: 'done', attempts: 1, hintLevel: 0 },
    { status: 'checking', attempts: 1, hintLevel: 1 },
    { status: 'pending', attempts: 0, hintLevel: 0 },
  ],
}

test('lists every step with its title and its state', () => {
  render(<OutlineDrawer plan={plan} progress={progress} onClose={() => {}} />)
  const items = within(screen.getByRole('list')).getAllByRole('listitem')
  expect(items).toHaveLength(3)
  expect(items[0]).toHaveTextContent(`Sides${he.lesson.outlineDone}`)
  expect(items[1]).toHaveTextContent(`Hypotenuse${he.lesson.outlineCurrent}`)
  expect(items[2]).toHaveTextContent(`Pythagoras${he.lesson.outlineNext}`)
})

test('marks the current step for screen readers', () => {
  render(<OutlineDrawer plan={plan} progress={progress} onClose={() => {}} />)
  const items = screen.getAllByRole('listitem')
  expect(items[1]).toHaveAttribute('aria-current', 'step')
  expect(items[0]).not.toHaveAttribute('aria-current')
})

test('is a dialog named by the outline title', () => {
  render(<OutlineDrawer plan={plan} progress={progress} onClose={() => {}} />)
  expect(screen.getByRole('dialog', { name: he.lesson.outline })).toBeInTheDocument()
})

test('a step title in another language keeps its own direction', () => {
  render(<OutlineDrawer plan={plan} progress={progress} onClose={() => {}} />)
  expect(screen.getByText('Sides')).toHaveAttribute('dir', 'auto')
})
