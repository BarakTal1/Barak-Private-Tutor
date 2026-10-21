import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SourceSheet from '../../src/ui/SourceSheet.jsx'
import { he } from '../../src/ui/he.js'

const passages = [
  { id: 'p1', label: 'עמוד 2', page: 2, text: 'משולש הוא צורה עם **שלוש** צלעות.', source: 'text' },
  { id: 'p2', label: 'Page 3', page: 3, text: 'La somme des angles.', source: 'vision' },
]

test('shows the label and the text of each passage', () => {
  render(<SourceSheet passages={passages} onClose={() => {}} />)
  const dialog = screen.getByRole('dialog', { name: he.lesson.source })
  expect(dialog).toHaveTextContent('עמוד 2')
  expect(dialog).toHaveTextContent('Page 3')
  expect(dialog).toHaveTextContent('משולש הוא צורה עם')
  expect(dialog).toHaveTextContent('La somme des angles.')
})

test('shows the note that the passage keeps its own language and direction', () => {
  render(<SourceSheet passages={passages} onClose={() => {}} />)
  expect(screen.getByText(he.lesson.sourceNote)).toBeInTheDocument()
})

test('each passage keeps its own direction', () => {
  const { container } = render(<SourceSheet passages={passages} onClose={() => {}} />)
  const blocks = container.querySelectorAll('[data-passage]')
  expect(blocks).toHaveLength(2)
  for (const block of blocks) expect(block).toHaveAttribute('dir', 'auto')
})

test('formats the text of a passage as Markdown', () => {
  const { container } = render(<SourceSheet passages={passages} onClose={() => {}} />)
  expect(container.querySelector('strong')).toHaveTextContent('שלוש')
})

test('says so when there is no passage', () => {
  render(<SourceSheet passages={[]} onClose={() => {}} />)
  expect(screen.getByText(he.lesson.sourceEmpty)).toBeInTheDocument()
})

test('closes with Escape', async () => {
  const onClose = vi.fn()
  render(<SourceSheet passages={passages} onClose={onClose} />)
  await userEvent.keyboard('{Escape}')
  expect(onClose).toHaveBeenCalled()
})
