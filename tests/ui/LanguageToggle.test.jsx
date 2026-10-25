import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { streamTurn } from '../../src/ai/client.js'
import App from '../../src/App.jsx'
import { en } from '../../src/ui/en.js'
import { he } from '../../src/ui/he.js'
import { useLanguage } from '../../src/ui/i18n.jsx'
import { renderLesson, renderScreen } from '../helpers/render.jsx'

vi.mock('../../src/ai/client.js', async (importOriginal) => ({
  ...(await importOriginal()),
  streamTurn: vi.fn(),
}))

const group = () => screen.getByRole('group', { name: he.language.toggleLabel })
const pressed = (name) => within(group()).getByRole('button', { name }).getAttribute('aria-pressed')

beforeEach(() => streamTurn.mockReset())

test('the toggle shows both language names and marks the current one pressed', () => {
  renderScreen(<App />)
  expect(pressed('עברית')).toBe('true')
  expect(pressed('English')).toBe('false')
})

test('pressing English changes the screen, the direction and the saved choice', async () => {
  renderScreen(<App />)
  await userEvent.click(within(group()).getByRole('button', { name: 'English' }))
  expect(screen.getByText(en.setup.fileStep)).toBeInTheDocument()
  expect(screen.queryByText(he.setup.fileStep)).not.toBeInTheDocument()
  expect(document.documentElement.dir).toBe('ltr')
  expect(document.documentElement.lang).toBe('en')
  expect(localStorage.getItem('tmtf.lang.v1')).toBe('en')
  expect(within(screen.getByRole('group', { name: en.language.toggleLabel })).getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
})

test('pressing Hebrew again brings Hebrew and right to left back', async () => {
  renderScreen(<App />)
  await userEvent.click(within(group()).getByRole('button', { name: 'English' }))
  await userEvent.click(within(screen.getByRole('group', { name: en.language.toggleLabel })).getByRole('button', { name: 'עברית' }))
  expect(screen.getByText(he.setup.fileStep)).toBeInTheDocument()
  expect(document.documentElement.dir).toBe('rtl')
})

test('the settings panel has the toggle too', async () => {
  renderScreen(<App />)
  await userEvent.click(screen.getByRole('button', { name: he.setup.settings }))
  const dialog = screen.getByRole('dialog')
  expect(within(dialog).getByRole('group', { name: he.language.toggleLabel })).toBeInTheDocument()
})

test('the language stays after a reload', async () => {
  const view = renderScreen(<App />)
  await userEvent.click(within(group()).getByRole('button', { name: 'English' }))
  view.unmount()
  renderScreen(<App />, { reset: false })
  expect(screen.getByText(en.setup.fileStep)).toBeInTheDocument()
})

test('a switch during a lesson changes the interface and keeps the messages of the lesson', async () => {
  streamTurn.mockImplementationOnce(async ({ onText }) => {
    onText('Welcome! Let us start.')
    return { verdict: 'partial', advance: false }
  })
  const ref = {}
  function Probe() {
    ref.language = useLanguage()
    return null
  }
  renderLesson(
    <>
      <App />
      <Probe />
    </>,
  )
  await screen.findByText('Welcome! Let us start.')
  expect(screen.getByRole('button', { name: he.lesson.hint })).toBeInTheDocument()
  act(() => ref.language.setLanguage('en'))
  expect(screen.getByRole('button', { name: en.lesson.hint })).toBeInTheDocument()
  expect(screen.getByText('Welcome! Let us start.')).toBeInTheDocument()
})
