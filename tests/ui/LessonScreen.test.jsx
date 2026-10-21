import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApiClientError, streamTurn } from '../../src/ai/client.js'
import App from '../../src/App.jsx'
import { saveLesson } from '../../src/lesson/persist.js'
import { fmt, he } from '../../src/ui/he.js'
import { MAX_ATTEMPTS } from '../../shared/limits.js'
import { answer, lessonState, plan, tutorTurn } from '../helpers/lesson.js'
import { mockMotionPreference } from '../helpers/motion.js'
import { lessonRef, renderLesson, renderScreen } from '../helpers/render.jsx'

vi.mock('../../src/ai/client.js', async (importOriginal) => ({
  ...(await importOriginal()),
  streamTurn: vi.fn(),
}))

const correct = { verdict: 'correct', advance: true }
const wrong = { verdict: 'wrong', advance: false }
const partial = { verdict: 'partial', advance: false }
const offTopic = { verdict: 'off_topic', advance: false }

// The next turn: the tutor writes `text` and ends with `control`.
const say = (text, control = partial) =>
  streamTurn.mockImplementationOnce(async ({ onText }) => {
    onText(text)
    return control
  })

// A turn that the test finishes by hand.
function openTurn() {
  const turn = {}
  streamTurn.mockImplementationOnce(({ onText, signal }) => {
    turn.onText = onText
    turn.signal = signal
    return new Promise((resolve) => {
      turn.finish = resolve
      signal.addEventListener('abort', () => resolve(null))
    })
  })
  return turn
}

const box = () => screen.getByLabelText(he.lesson.inputLabel)
const sendButton = () => screen.getByRole('button', { name: he.lesson.send })
const payload = (call = 0) => streamTurn.mock.calls[call][0].payload
async function reply(text) {
  await userEvent.type(box(), text)
  await userEvent.click(sendButton())
}

beforeEach(() => {
  streamTurn.mockReset()
  mockMotionPreference(false)
  vi.stubGlobal('confirm', vi.fn(() => true))
})
afterEach(() => vi.unstubAllGlobals())

describe('starting the lesson', () => {
  test('the begin turn runs once on entry and shows the message of the tutor', async () => {
    say('Welcome! Let us start.')
    renderLesson(<App />)
    expect(await screen.findByText('Welcome! Let us start.')).toBeInTheDocument()
    expect(streamTurn).toHaveBeenCalledTimes(1)
    expect(payload()).toMatchObject({ studentMessage: null, request: 'answer', step: { id: 's1' }, progress: { stepIndex: 0, attempts: 0 } })
  })

  test('the begin turn runs once also in strict mode, where React mounts a screen twice', async () => {
    // Like the real stream, this one ends with null when its request is aborted.
    streamTurn.mockImplementation(({ onText, signal }) =>
      new Promise((resolve) => {
        signal.addEventListener('abort', () => resolve(null))
        setTimeout(() => {
          onText('Welcome!')
          resolve(partial)
        }, 0)
      }),
    )
    renderLesson(<App />, { strict: true })
    await screen.findByText('Welcome!')
    expect(streamTurn).toHaveBeenCalledTimes(1)
    expect(screen.queryByText(he.lesson.retryTurn)).not.toBeInTheDocument()
  })

  test('the header shows the step counter and the title of the step', async () => {
    say('Hi')
    renderLesson(<App />)
    expect(screen.getByText(fmt(he.lesson.stepCounter, { current: 1, total: 3 }))).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Sides' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: he.lesson.pathLabel })).toBeInTheDocument()
    await screen.findByText('Hi')
  })

  test('the chat is a log that is read politely', async () => {
    say('Hi')
    renderLesson(<App />)
    const log = screen.getByRole('log', { name: he.lesson.chatLabel })
    expect(log).toHaveAttribute('aria-live', 'polite')
    await within(log).findByText('Hi')
  })

  test('before the first word Barak thinks and the screen says so', async () => {
    const turn = openTurn()
    renderLesson(<App />)
    expect(await screen.findByText(he.lesson.thinking)).toBeInTheDocument()
    const log = screen.getByRole('log')
    expect(within(log).getByRole('img')).toHaveAttribute('data-tutor', 'think')
    act(() => turn.onText('Now I speak'))
    expect(await screen.findByText('Now I speak')).toBeInTheDocument()
    expect(within(log).getByRole('img')).toHaveAttribute('data-tutor', 'talk')
    act(() => turn.finish(partial))
  })

  test('after 4 seconds without a word it says the model is waking up', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    openTurn()
    renderLesson(<App />)
    expect(screen.queryByText(he.lesson.waking)).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(4000))
    expect(screen.getByText(he.lesson.waking)).toBeInTheDocument()
    vi.useRealTimers()
  })
})

describe('answering', () => {
  test('sending a message shows the student bubble and a streaming tutor bubble', async () => {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    const turn = openTurn()
    await reply('three')
    expect(screen.getByText('three')).toBeInTheDocument()
    expect(payload(1)).toMatchObject({ studentMessage: 'three', request: 'answer', progress: { attempts: 1 } })
    expect(payload(1).history).toEqual([{ role: 'tutor', text: 'Hello' }])
    act(() => turn.onText('Streaming...'))
    expect(await screen.findByText('Streaming...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: he.lesson.stop })).toBeInTheDocument()
    act(() => turn.finish(wrong))
    await waitFor(() => expect(screen.queryByRole('button', { name: he.lesson.stop })).not.toBeInTheDocument())
    expect(box()).toBeEnabled()
  })

  test('Stop keeps the partial text and gives the input back, and Continue asks again', async () => {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    const turn = openTurn()
    await reply('three')
    act(() => turn.onText('Half an ans'))
    await userEvent.click(await screen.findByRole('button', { name: he.lesson.stop }))
    expect(turn.signal.aborted).toBe(true)
    expect(await screen.findByText('Half an ans')).toBeInTheDocument()
    expect(screen.getByText(he.lesson.stopped)).toBeInTheDocument()
    expect(box()).toBeEnabled()
    say('A full answer', wrong)
    await userEvent.click(screen.getByRole('button', { name: he.lesson.continueAnswer }))
    expect(await screen.findByText('A full answer')).toBeInTheDocument()
    expect(screen.queryByText('Half an ans')).not.toBeInTheDocument()
    expect(payload(2)).toMatchObject({ studentMessage: 'three', progress: { attempts: 1 } })
  })

  test('a failed turn shows the banner with Retry, keeps the step, and Retry does not add an attempt', async () => {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    streamTurn.mockRejectedValueOnce(new ApiClientError('rate_limited', 'x'))
    await reply('three')
    expect(await screen.findByText(he.apiErrors.rate_limited.title)).toBeInTheDocument()
    expect(lessonRef.current.state.progress.currentStepIndex).toBe(0)
    expect(lessonRef.current.state.progress.steps[0].attempts).toBe(1)
    say('Try again later', wrong)
    await userEvent.click(screen.getByRole('button', { name: he.common.retry }))
    expect(await screen.findByText('Try again later')).toBeInTheDocument()
    expect(lessonRef.current.state.progress.steps[0].attempts).toBe(1)
    expect(payload(2)).toMatchObject({ studentMessage: 'three', progress: { attempts: 1 } })
    expect(screen.queryByText(he.apiErrors.rate_limited.title)).not.toBeInTheDocument()
  })

  test('a wrong key offers the settings', async () => {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    streamTurn.mockRejectedValueOnce(new ApiClientError('bad_key', 'x'))
    await reply('three')
    await userEvent.click(await screen.findByRole('button', { name: he.common.toSettings }))
    expect(screen.getByRole('dialog', { name: he.settings.title })).toBeInTheDocument()
  })

  test('a connection that drops is reported as a network error', async () => {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    streamTurn.mockRejectedValueOnce(new Error('boom'))
    await reply('three')
    expect(await screen.findByText(he.apiErrors.provider_error.title)).toBeInTheDocument()
  })
})

describe('feedback', () => {
  async function answerRight() {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    say('Yes, exactly!', correct)
    say('Next step starts', partial)
    await reply('three')
    await screen.findByText('Yes, exactly!')
  }

  test('a correct answer shows the praise badge and moves to the next step', async () => {
    await answerRight()
    const badges = screen.getAllByRole('status').filter((status) => he.praises.some((phrase) => status.textContent.includes(phrase)))
    expect(badges).toHaveLength(1)
    await screen.findByText(fmt(he.lesson.stepCounter, { current: 2, total: 3 }))
  })

  test('the next step starts by itself with its own passages', async () => {
    await answerRight()
    expect(await screen.findByText('Next step starts')).toBeInTheDocument()
    expect(streamTurn).toHaveBeenCalledTimes(3)
    expect(payload(2)).toMatchObject({ studentMessage: null, request: 'answer', step: { id: 's2' }, progress: { stepIndex: 1, attempts: 0 } })
  })

  test('the praise changes from one correct answer to the next', async () => {
    await answerRight()
    await screen.findByText('Next step starts')
    say('Right again!', correct)
    say('Last step starts', partial)
    await reply('hypotenuse')
    await screen.findByText('Right again!')
    const shown = he.praises.filter((phrase) => screen.queryByText(phrase))
    expect(shown).toHaveLength(2)
  })

  test('the step ribbon shows for a moment after a step is done', async () => {
    await answerRight()
    expect(await screen.findByText(he.lesson.stepDone)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(he.lesson.stepDone)).not.toBeInTheDocument(), { timeout: 2500 })
  })

  test('a wrong answer gets a yellow hint title and no red', async () => {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    say('Not quite, look at page 1', wrong)
    await reply('five')
    const bubble = (await screen.findByText('Not quite, look at page 1')).closest('[data-bubble]')
    expect(he.lesson.hintTitles.some((title) => within(bubble).queryByText(title))).toBe(true)
    expect(bubble.className).toMatch(/hint/)
    expect(bubble.className).not.toMatch(/err/)
    expect(lessonRef.current.state.progress.currentStepIndex).toBe(0)
  })

  test('after the last attempt the explanation is forced, the bubble is calm and the lesson moves on', async () => {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    for (let i = 1; i <= MAX_ATTEMPTS; i++) {
      say(`Explanation ${i}`, wrong)
      if (i === MAX_ATTEMPTS) say('Step two begins', partial)
      await reply(`guess ${i}`)
      await screen.findByText(`Explanation ${i}`)
    }
    expect(payload(MAX_ATTEMPTS).forceExplain).toBe(true)
    expect(payload(MAX_ATTEMPTS - 1).forceExplain).toBe(false)
    const bubble = screen.getByText(`Explanation ${MAX_ATTEMPTS}`).closest('[data-bubble]')
    expect(within(bubble).getByText(he.lesson.stuckTitle)).toBeInTheDocument()
    expect(bubble.className).toMatch(/info/)
    await screen.findByText(fmt(he.lesson.stepCounter, { current: 2, total: 3 }))
  })

  test('an off-topic message gets no mood and the question is saved', async () => {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    say('That is not in this lesson', offTopic)
    await reply('who won the match?')
    const bubble = (await screen.findByText('That is not in this lesson')).closest('[data-bubble]')
    expect(bubble.className).not.toMatch(/hint|info|ok/)
    expect(lessonRef.current.state.parkedQuestions).toEqual(['who won the match?'])
  })
})

describe('hints', () => {
  test('the hint button asks for a hint, shows the lamps and adds no attempt', async () => {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    say('Look at page one', partial)
    await userEvent.click(screen.getByRole('button', { name: he.lesson.hint }))
    expect(await screen.findByText('Look at page one')).toBeInTheDocument()
    expect(screen.getByText(he.lesson.hintAsked)).toBeInTheDocument()
    expect(payload(1)).toMatchObject({ request: 'hint', studentMessage: null, progress: { hintLevel: 1, attempts: 0 } })
    expect(screen.getByRole('img', { name: fmt(he.lesson.hintLevel, { level: 1, max: 2 }) })).toBeInTheDocument()
    expect(lessonRef.current.state.progress.steps[0].attempts).toBe(0)
  })

  test('at the last level the hint button is off and says why, and a quick second press does nothing twice', async () => {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    say('Hint one', partial)
    say('Hint two', partial)
    await userEvent.click(screen.getByRole('button', { name: he.lesson.hint }))
    await screen.findByText('Hint one')
    await userEvent.click(screen.getByRole('button', { name: he.lesson.hint }))
    await screen.findByText('Hint two')
    const button = screen.getByRole('button', { name: he.lesson.noMoreHints })
    expect(button).toBeDisabled()
    expect(lessonRef.current.state.progress.steps[0].hintLevel).toBe(2)
    expect(streamTurn).toHaveBeenCalledTimes(3)
  })
})

describe('the source', () => {
  test('the Source button opens the passages of the step and not of another step', async () => {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    await userEvent.click(screen.getByRole('button', { name: he.lesson.source }))
    const dialog = screen.getByRole('dialog', { name: he.lesson.source })
    expect(dialog).toHaveTextContent('A triangle has three sides.')
    expect(dialog).not.toHaveTextContent('hypotenuse')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('there is no Source button while the first word has not come', async () => {
    openTurn()
    renderLesson(<App />)
    await screen.findByText(he.lesson.thinking)
    expect(screen.queryByRole('button', { name: he.lesson.source })).not.toBeInTheDocument()
  })
})

describe('language and direction', () => {
  const french = { ...plan, language: 'French' }

  test('a French lesson bubble is left to right and the praise stays Hebrew', async () => {
    say('Bonjour ! Combien de côtés ?')
    renderLesson(<App />, { plan: french })
    const bubble = (await screen.findByText('Bonjour ! Combien de côtés ?')).closest('[data-bubble]')
    expect(bubble).toHaveAttribute('dir', 'ltr')
    say('Très bien !', correct)
    say('Suite', partial)
    await reply('trois')
    await screen.findByText('Très bien !')
    expect(he.praises.some((phrase) => screen.queryByText(phrase))).toBe(true)
  })

  test('a Hebrew lesson bubble is right to left', async () => {
    say('שלום! כמה צלעות יש למשולש?')
    renderLesson(<App />, { plan: { ...plan, language: 'עברית' } })
    const bubble = (await screen.findByText('שלום! כמה צלעות יש למשולש?')).closest('[data-bubble]')
    expect(bubble).toHaveAttribute('dir', 'rtl')
  })

  test('the tutor is on the start side and the student on the end side', async () => {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    say('Reply', partial)
    await reply('hi')
    await screen.findByText('Reply')
    expect(screen.getByText('Hello').closest('[data-role]').className).toMatch(/self-start/)
    expect(screen.getByText('hi').closest('[data-role]').className).toMatch(/self-end/)
  })
})

describe('motion', () => {
  test('with reduced motion there is no confetti and the badge does not pop', async () => {
    mockMotionPreference(true)
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    say('Yes!', correct)
    say('Next', partial)
    await reply('three')
    await screen.findByText('Yes!')
    expect(document.querySelector('[data-confetti]')).toBeNull()
    for (const status of screen.getAllByRole('status')) expect(status.className).not.toMatch(/pop/)
  })

  test('with full motion a correct answer throws confetti', async () => {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    say('Yes!', correct)
    say('Next', partial)
    await reply('three')
    await screen.findByText('Yes!')
    expect(document.querySelector('[data-confetti]')).toBeInTheDocument()
  })
})

describe('leaving and coming back', () => {
  test('Exit asks first and then ends the lesson', async () => {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    confirm.mockReturnValueOnce(false)
    await userEvent.click(screen.getByRole('button', { name: he.lesson.exit }))
    expect(confirm).toHaveBeenCalledWith(he.lesson.exitConfirm)
    expect(lessonRef.current.state.phase).toBe('lesson')
    await userEvent.click(screen.getByRole('button', { name: he.lesson.exit }))
    await waitFor(() => expect(lessonRef.current.state.phase).toBe('setup'))
  })

  test('Exit stops the turn that is running', async () => {
    const turn = openTurn()
    renderLesson(<App />)
    await screen.findByText(he.lesson.thinking)
    await userEvent.click(screen.getByRole('button', { name: he.lesson.exit }))
    expect(turn.signal.aborted).toBe(true)
  })

  test('the outline button opens the map of the lesson', async () => {
    say('Hello')
    renderLesson(<App />)
    await screen.findByText('Hello')
    await userEvent.click(screen.getByRole('button', { name: he.lesson.openOutline }))
    const dialog = screen.getByRole('dialog', { name: he.lesson.outline })
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(3)
  })

  test('a reload brings the lesson back and does not start the step again', async () => {
    const saved = tutorTurn(lessonState(), 'Welcome back', null)
    saveLesson(saved)
    renderScreen(<App />, { reset: false })
    expect(await screen.findByText('Welcome back')).toBeInTheDocument()
    expect(streamTurn).not.toHaveBeenCalled()
  })

  test('a reload during a stream brings the lesson back without the half answer and offers a retry', async () => {
    const midStream = answer(tutorTurn(lessonState(), 'Welcome', null), 'three')
    const streaming = { ...midStream, messages: [...midStream.messages, { id: 'm3', role: 'tutor', text: 'Half an ans', stepId: 's1', passageIds: ['p1'] }], streaming: true }
    saveLesson(streaming)
    renderScreen(<App />, { reset: false })
    expect(await screen.findByText(he.lesson.retryTurn)).toBeInTheDocument()
    expect(screen.queryByText('Half an ans')).not.toBeInTheDocument()
    expect(lessonRef.current.state.streaming).toBe(false)
    say('Fresh answer', wrong)
    await userEvent.click(screen.getByRole('button', { name: he.common.retry }))
    expect(await screen.findByText('Fresh answer')).toBeInTheDocument()
    expect(payload()).toMatchObject({ studentMessage: 'three', progress: { attempts: 1 } })
  })

  test('the screen follows the height of the keyboard on a phone', () => {
    const listeners = {}
    const viewport = { height: 500, addEventListener: (type, fn) => (listeners[type] = fn), removeEventListener: vi.fn() }
    vi.stubGlobal('visualViewport', viewport)
    openTurn()
    const { container } = renderLesson(<App />)
    const root = container.querySelector('[data-lesson]')
    expect(root.style.height).toBe('500px')
    viewport.height = 320
    act(() => listeners.resize())
    expect(root.style.height).toBe('320px')
  })
})
