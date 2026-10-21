import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Composer from '../../src/ui/Composer.jsx'
import { fmt, he } from '../../src/ui/he.js'
import { MAX_STUDENT_CHARS } from '../../shared/limits.js'

const setup = (props = {}) => {
  const handlers = { onSend: vi.fn(), onStop: vi.fn(), onHint: vi.fn() }
  render(<Composer streaming={false} hintLevel={0} maxHints={2} {...handlers} {...props} />)
  return handlers
}
const box = () => screen.getByLabelText(he.lesson.inputLabel)
const send = () => screen.getByRole('button', { name: he.lesson.send })

test('Send is off for empty and whitespace text', async () => {
  setup()
  expect(send()).toBeDisabled()
  await userEvent.type(box(), '   ')
  expect(send()).toBeDisabled()
  await userEvent.type(box(), 'x')
  expect(send()).toBeEnabled()
})

test('sends the trimmed text and clears the box', async () => {
  const { onSend } = setup()
  await userEvent.type(box(), '  שלוש צלעות  ')
  await userEvent.click(send())
  expect(onSend).toHaveBeenCalledWith('שלוש צלעות')
  expect(box()).toHaveValue('')
})

test('Enter sends and Shift+Enter does not', async () => {
  const { onSend } = setup()
  await userEvent.type(box(), 'שלום{Shift>}{Enter}{/Shift}עולם')
  expect(onSend).not.toHaveBeenCalled()
  expect(box()).toHaveValue('שלום\nעולם')
  await userEvent.type(box(), '{Enter}')
  expect(onSend).toHaveBeenCalledWith('שלום\nעולם')
})

test('Enter during IME composition does not send', () => {
  const { onSend } = setup()
  fireEvent.change(box(), { target: { value: 'ni' } })
  fireEvent.keyDown(box(), { key: 'Enter', isComposing: true })
  expect(onSend).not.toHaveBeenCalled()
})

test('the counter appears over MAX_STUDENT_CHARS and Send is off', () => {
  setup()
  fireEvent.change(box(), { target: { value: 'a'.repeat(MAX_STUDENT_CHARS) } })
  expect(screen.queryByText(/מעל המגבלה/)).not.toBeInTheDocument()
  expect(send()).toBeEnabled()
  fireEvent.change(box(), { target: { value: 'a'.repeat(MAX_STUDENT_CHARS + 7) } })
  expect(screen.getByText(fmt(he.lesson.charsLeft, { count: 7 }))).toBeInTheDocument()
  expect(send()).toBeDisabled()
})

test('Send changes to Stop while streaming and Stop calls onStop', async () => {
  const { onStop } = setup({ streaming: true })
  expect(screen.queryByRole('button', { name: he.lesson.send })).not.toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: he.lesson.stop }))
  expect(onStop).toHaveBeenCalledTimes(1)
})

test('Enter while the tutor answers does not send and keeps the text', async () => {
  const { onSend } = setup({ streaming: true })
  await userEvent.type(box(), 'early answer{Enter}')
  expect(onSend).not.toHaveBeenCalled()
  expect(box()).toHaveValue('early answer')
})

test('the box stays usable while the tutor answers', async () => {
  setup({ streaming: true })
  await userEvent.type(box(), 'x')
  expect(box()).toHaveValue('x')
})

test('the box has a direction that follows the text and a Hebrew placeholder', () => {
  setup()
  expect(box()).toHaveAttribute('dir', 'auto')
  expect(box()).toHaveAttribute('placeholder', he.lesson.inputPlaceholder)
})

test('the hint button asks for a hint', async () => {
  const { onHint } = setup({ hintLevel: 1 })
  await userEvent.click(screen.getByRole('button', { name: he.lesson.hint }))
  expect(onHint).toHaveBeenCalledTimes(1)
})

test('at the last hint level the hint button is off and says why', async () => {
  const { onHint } = setup({ hintLevel: 2 })
  const button = screen.getByRole('button', { name: he.lesson.noMoreHints })
  expect(button).toBeDisabled()
  await userEvent.click(button)
  expect(onHint).not.toHaveBeenCalled()
})

test('the hint button is off while the tutor answers', () => {
  setup({ streaming: true })
  expect(screen.getByRole('button', { name: he.lesson.hint })).toBeDisabled()
})

test('everything can be switched off', async () => {
  const { onSend } = setup({ disabled: true })
  expect(box()).toBeDisabled()
  expect(send()).toBeDisabled()
  expect(screen.getByRole('button', { name: he.lesson.hint })).toBeDisabled()
  expect(onSend).not.toHaveBeenCalled()
})
