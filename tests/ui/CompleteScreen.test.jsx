import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../src/App.jsx'
import { saveLesson } from '../../src/lesson/persist.js'
import { fmt, he } from '../../src/ui/he.js'
import { answer, lessonState, run, tutorTurn } from '../helpers/lesson.js'
import { mockMotionPreference } from '../helpers/motion.js'
import { lessonRef, renderScreen } from '../helpers/render.jsx'

const correct = { verdict: 'correct', advance: true }
const offTopic = { verdict: 'off_topic', advance: false }

// A lesson that is finished: every step answered right, one hint, one saved question.
function finishedLesson({ parked = false } = {}) {
  let state = tutorTurn(lessonState(), 'Welcome', null)
  state = tutorTurn(run(state, { type: 'hintRequested' }), 'Look at page 1', { verdict: 'partial', advance: false })
  if (parked) state = tutorTurn(answer(state, 'who won the match?'), 'Not in this lesson', offTopic)
  for (let i = 0; i < 3; i++) state = tutorTurn(answer(state, `answer ${i}`), `Great ${i}`, correct)
  return state
}

function renderComplete(options) {
  const state = finishedLesson(options)
  saveLesson(state)
  renderScreen(<App />, { reset: false })
  return state
}

beforeEach(() => {
  sessionStorage.clear()
  localStorage.clear()
  mockMotionPreference(false)
})
afterEach(() => vi.unstubAllGlobals())

test('a finished lesson opens the complete screen', () => {
  renderComplete()
  expect(lessonRef.current.state.phase).toBe('done')
  expect(screen.getByRole('heading', { level: 1, name: he.complete.title })).toBeInTheDocument()
})

test('Barak dances and there is confetti', () => {
  renderComplete()
  expect(screen.getByRole('img')).toHaveAttribute('data-tutor', 'dance')
  expect(document.querySelector('[data-confetti]')).toBeInTheDocument()
})

test('shows the number of steps, attempts and hints', () => {
  const state = renderComplete()
  expect(screen.getByText(fmt(he.complete.steps, { done: 3, total: 3 }))).toBeInTheDocument()
  const attempts = screen.getByText(he.complete.attempts).closest('div')
  const hints = screen.getByText(he.complete.hints).closest('div')
  expect(attempts).toHaveTextContent(String(state.stats.attempts))
  expect(hints).toHaveTextContent('1')
})

test('shows the recap built from the key points of the plan', () => {
  renderComplete()
  const recap = screen.getByRole('list', { name: he.complete.recapTitle })
  expect(within(recap).getAllByRole('listitem').map((item) => item.textContent)).toEqual([
    'three sides',
    'the hypotenuse',
    'squares add up',
  ])
})

test('shows the effort line', () => {
  renderComplete()
  expect(screen.getByText(he.complete.effort)).toBeInTheDocument()
})

test('shows no saved questions when there are none', () => {
  renderComplete()
  expect(screen.queryByText(he.complete.parkedTitle)).not.toBeInTheDocument()
})

test('shows a saved question and the line about the teacher', () => {
  renderComplete({ parked: true })
  expect(screen.getByText(he.complete.parkedTitle)).toBeInTheDocument()
  expect(screen.getByText('who won the match?')).toBeInTheDocument()
  expect(screen.getByText(he.complete.parkedBody)).toBeInTheDocument()
})

test('with reduced motion there is no confetti and Barak is still', () => {
  mockMotionPreference(true)
  renderComplete()
  expect(document.querySelector('[data-confetti]')).toBeNull()
  expect(screen.getByRole('img')).toHaveAttribute('data-motion', 'off')
  expect(document.querySelector('[data-rise]')).toBeNull()
})

test('the recap rises with a delay for each bullet when motion is on', () => {
  renderComplete()
  const bullets = [...document.querySelectorAll('[data-bullet]')]
  expect(bullets.map((bullet) => bullet.style.animationDelay)).toEqual(['0ms', '60ms', '120ms'])
})

test('"New lesson" ends the lesson and goes to the setup screen', async () => {
  renderComplete()
  await userEvent.click(screen.getByRole('button', { name: he.complete.newLesson }))
  expect(lessonRef.current.state.phase).toBe('setup')
  expect(sessionStorage.getItem('tmtf.lesson.v1')).toBeNull()
})

test('"View the chat" shows the messages with no input, and Back returns to the summary', async () => {
  renderComplete()
  await userEvent.click(screen.getByRole('button', { name: he.complete.viewChat }))
  expect(screen.getByText('Welcome')).toBeInTheDocument()
  expect(screen.getByText('Great 2')).toBeInTheDocument()
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: he.lesson.send })).not.toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: he.common.back }))
  expect(screen.getByRole('heading', { level: 1, name: he.complete.title })).toBeInTheDocument()
})

test('the Source button still works in the read-only chat', async () => {
  renderComplete()
  await userEvent.click(screen.getByRole('button', { name: he.complete.viewChat }))
  await userEvent.click(screen.getAllByRole('button', { name: he.lesson.source })[0])
  expect(screen.getByRole('dialog', { name: he.lesson.source })).toHaveTextContent('A triangle has three sides.')
})

test('the confetti stops by itself', () => {
  vi.useFakeTimers()
  renderComplete()
  expect(document.querySelector('[data-confetti]')).toBeInTheDocument()
  act(() => vi.advanceTimersByTime(2200))
  expect(document.querySelector('[data-confetti]')).toBeNull()
  vi.useRealTimers()
})
