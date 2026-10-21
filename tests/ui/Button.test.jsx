import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../../src/ui/Button.jsx'

test('a click calls onClick', async () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>המשך</Button>)
  await userEvent.click(screen.getByRole('button', { name: 'המשך' }))
  expect(onClick).toHaveBeenCalledTimes(1)
})

test('Enter and Space activate the button', async () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>שליחה</Button>)
  screen.getByRole('button').focus()
  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard(' ')
  expect(onClick).toHaveBeenCalledTimes(2)
})

test('a disabled button with a reason shows the reason and aria-describedby', () => {
  render(<Button disabled reason="הוסיפו מפתח API">המשך</Button>)
  const button = screen.getByRole('button', { name: 'המשך' })
  expect(button).toBeDisabled()
  const reason = screen.getByText('הוסיפו מפתח API')
  expect(button.getAttribute('aria-describedby')).toBe(reason.id)
})

test('a disabled button does not call onClick', async () => {
  const onClick = vi.fn()
  render(<Button disabled onClick={onClick}>המשך</Button>)
  await userEvent.click(screen.getByRole('button'))
  expect(onClick).not.toHaveBeenCalled()
})

test('the reason is hidden when the button is enabled', () => {
  render(<Button reason="לא מוצג">המשך</Button>)
  expect(screen.queryByText('לא מוצג')).not.toBeInTheDocument()
  expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby')
})

test('a loading button blocks clicks and shows a spinner', async () => {
  const onClick = vi.fn()
  render(<Button loading onClick={onClick}>המשך</Button>)
  const button = screen.getByRole('button')
  expect(button).toHaveAttribute('aria-busy', 'true')
  expect(screen.getByRole('status')).toBeInTheDocument()
  await userEvent.click(button)
  expect(onClick).not.toHaveBeenCalled()
})

test('the variant changes the look and the type is button by default', () => {
  const { rerender } = render(<Button variant="primary">א</Button>)
  const primary = screen.getByRole('button').className
  rerender(<Button variant="secondary">א</Button>)
  expect(screen.getByRole('button').className).not.toBe(primary)
  expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
})
