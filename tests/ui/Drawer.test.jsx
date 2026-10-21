import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Drawer from '../../src/ui/Drawer.jsx'
import { he } from '../../src/ui/he.js'

const open = (props = {}) => {
  const onClose = vi.fn()
  render(
    <>
      <button>opener</button>
      <Drawer title="כותרת" onClose={onClose} {...props}>
        <input aria-label="שדה" />
      </Drawer>
    </>,
  )
  return onClose
}

test('is a modal dialog named by its title', () => {
  open()
  const dialog = screen.getByRole('dialog', { name: 'כותרת' })
  expect(dialog).toHaveAttribute('aria-modal', 'true')
})

test('closes with Escape', async () => {
  const onClose = open()
  await userEvent.keyboard('{Escape}')
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('closes with the close button and with a click on the dark area, but not with a click inside', async () => {
  const onClose = open()
  await userEvent.click(screen.getByLabelText('שדה'))
  expect(onClose).not.toHaveBeenCalled()
  await userEvent.click(screen.getByRole('button', { name: he.common.close }))
  expect(onClose).toHaveBeenCalledTimes(1)
  await userEvent.click(document.querySelector('[data-overlay]'))
  expect(onClose).toHaveBeenCalledTimes(2)
})

test('moves the focus into the dialog and gives it back when it closes', () => {
  const opener = document.createElement('button')
  document.body.append(opener)
  opener.focus()
  const { unmount } = render(<Drawer title="x" onClose={() => {}}><input aria-label="שדה" /></Drawer>)
  expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true)
  unmount()
  expect(document.activeElement).toBe(opener)
  opener.remove()
})

test('a new onClose function on every render does not move the focus again', async () => {
  function Host() {
    return <Drawer title="x" onClose={() => {}}><input aria-label="שדה" /></Drawer>
  }
  const { rerender } = render(<Host />)
  await userEvent.type(screen.getByLabelText('שדה'), 'ab')
  rerender(<Host />)
  expect(screen.getByLabelText('שדה')).toHaveFocus()
})

test('opens from the start side by default and from the end side when asked', () => {
  const { unmount } = render(<Drawer title="x" side="start" onClose={() => {}}>a</Drawer>)
  expect(screen.getByRole('dialog').className).toMatch(/\bstart-0\b/)
  unmount()
  const sheet = render(<Drawer title="x" side="start" sheet onClose={() => {}}>a</Drawer>)
  expect(screen.getByRole('dialog').className).toMatch(/md:start-0/)
  sheet.unmount()
  render(<Drawer title="x" side="end" onClose={() => {}}>a</Drawer>)
  expect(screen.getByRole('dialog').className).toMatch(/\bend-0\b/)
})

test('is a bottom sheet on a phone when it is a sheet', () => {
  render(<Drawer title="x" sheet onClose={() => {}}>a</Drawer>)
  expect(screen.getByRole('dialog').className).toMatch(/bottom-0/)
})
