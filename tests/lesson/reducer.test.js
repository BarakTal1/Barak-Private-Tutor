import { initialState, reducer } from '../../src/lesson/reducer.js'
import { passagesFor, praiseFor, stepCounter } from '../../src/lesson/selectors.js'
import { MAX_ATTEMPTS } from '../../shared/limits.js'
import { answer, ingest, lessonState, plan, run, tutorTurn } from '../helpers/lesson.js'

const correct = { verdict: 'correct', advance: true }
const wrong = { verdict: 'wrong', advance: false }
const partial = { verdict: 'partial', advance: false }
const offTopic = { verdict: 'off_topic', advance: false }
const lastMessage = (state) => state.messages.at(-1)

describe('setup phases', () => {
  test('starts in the setup phase', () => {
    expect(initialState().phase).toBe('setup')
  })

  test('ingested moves to the report with the file name and prompt', () => {
    const state = reducer(initialState(), { type: 'ingested', ingest, teacherPrompt: 'Be kind' })
    expect(state).toMatchObject({ phase: 'report', fileName: 'triangles.pdf', teacherPrompt: 'Be kind' })
  })

  test('planReady starts the lesson on step 1', () => {
    const state = lessonState()
    expect(state.phase).toBe('lesson')
    expect(state.progress.currentStepIndex).toBe(0)
    expect(state.messages).toEqual([])
  })

  test('reset returns to the initial state', () => {
    expect(run(lessonState(), { type: 'reset' })).toEqual(initialState())
  })
})

describe('navigate (browser back and forward)', () => {
  test('back from the lesson to the report keeps the file', () => {
    const state = run(lessonState(), { type: 'navigate', phase: 'report' })
    expect(state).toMatchObject({ phase: 'report', fileName: 'triangles.pdf' })
  })

  test('forward to the lesson keeps the plan', () => {
    const state = run(lessonState(), { type: 'navigate', phase: 'report' }, { type: 'navigate', phase: 'lesson' })
    expect(state.phase).toBe('lesson')
  })

  test('back to the first screen starts again', () => {
    expect(run(lessonState(), { type: 'navigate', phase: 'setup' })).toEqual(initialState())
  })

  test('a screen without its data falls back to the first screen', () => {
    expect(run(initialState(), { type: 'navigate', phase: 'lesson' })).toEqual(initialState())
    expect(run(initialState(), { type: 'navigate', phase: 'report' })).toEqual(initialState())
    expect(run(lessonState(), { type: 'navigate', phase: 'done' }).phase).toBe('setup')
  })
})

describe('tutor turns', () => {
  test('stepCounter returns { current: 3, total: 7 }', () => {
    const seven = { ...plan, steps: Array.from({ length: 7 }, (_, i) => ({ ...plan.steps[0], id: `s${i}` })) }
    let state = run(initialState(), { type: 'ingested', ingest, teacherPrompt: '' }, { type: 'planReady', plan: seven })
    state = { ...state, progress: { ...state.progress, currentStepIndex: 2 } }
    expect(stepCounter(state)).toEqual({ current: 3, total: 7 })
  })

  test('a tutor message takes passageIds from its step, not from the model', () => {
    const state = run(lessonState(), { type: 'tutorStarted', stepId: 's2' })
    expect(lastMessage(state)).toMatchObject({ role: 'tutor', stepId: 's2', passageIds: ['p2'], text: '' })
    expect(state.streaming).toBe(true)
  })

  test('tutorDelta appends to the open tutor message', () => {
    const state = run(
      lessonState(),
      { type: 'tutorStarted', stepId: 's1' },
      { type: 'tutorDelta', text: 'Hel' },
      { type: 'tutorDelta', text: 'lo' },
    )
    expect(lastMessage(state).text).toBe('Hello')
  })

  test('passagesFor returns the passages of the message and not of another step', () => {
    const state = tutorTurn(lessonState(), 'Hi', null)
    expect(passagesFor(state, lastMessage(state)).map((p) => p.id)).toEqual(['p1'])
  })

  test('tutorStopped keeps the partial text and leaves progress unchanged', () => {
    const before = answer(lessonState())
    const state = run(before, { type: 'tutorStarted', stepId: 's1' }, { type: 'tutorDelta', text: 'Part' }, { type: 'tutorStopped' })
    expect(state.streaming).toBe(false)
    expect(lastMessage(state).text).toBe('Part')
    expect(state.progress).toEqual(before.progress)
  })

  test('tutorStopped marks the partial message as stopped', () => {
    const state = run(lessonState(), { type: 'tutorStarted', stepId: 's1' }, { type: 'tutorDelta', text: 'Part' }, { type: 'tutorStopped' })
    expect(lastMessage(state).stopped).toBe(true)
  })

  test('stoppedDiscarded removes the stopped tutor message and nothing else', () => {
    const before = answer(lessonState())
    const stopped = run(before, { type: 'tutorStarted', stepId: 's1' }, { type: 'tutorDelta', text: 'Part' }, { type: 'tutorStopped' })
    const state = run(stopped, { type: 'stoppedDiscarded' })
    expect(state.messages).toEqual(before.messages)
    expect(state.progress).toEqual(before.progress)
  })

  test('stoppedDiscarded does nothing when the last message was not stopped', () => {
    const state = tutorTurn(answer(lessonState()), 'Hello', null)
    expect(reducer(state, { type: 'stoppedDiscarded' })).toBe(state)
  })

  test('tutorStopped removes an empty tutor message', () => {
    const state = run(lessonState(), { type: 'tutorStarted', stepId: 's1' }, { type: 'tutorStopped' })
    expect(state.messages).toEqual([])
  })

  test('failed keeps messages and progress and sets the error', () => {
    const before = answer(lessonState())
    const error = { code: 'rate_limited', message: 'Slow down' }
    const state = run(before, { type: 'tutorStarted', stepId: 's1' }, { type: 'failed', error })
    expect(state.error).toEqual(error)
    expect(state.streaming).toBe(false)
    expect(state.messages).toEqual(before.messages)
    expect(state.progress).toEqual(before.progress)
    expect(run(state, { type: 'clearError' }).error).toBeNull()
  })

  test('a null control after an answer changes nothing but streaming', () => {
    const state = tutorTurn(answer(lessonState()), 'Hmm', null)
    expect(state.progress.currentStepIndex).toBe(0)
    expect(state.streaming).toBe(false)
    expect(lastMessage(state).mood).toBeUndefined()
  })
})

describe('answers, moods and praise', () => {
  test('a student answer adds a message and one attempt', () => {
    const state = answer(lessonState(), 'three')
    expect(lastMessage(state)).toMatchObject({ role: 'student', text: 'three', stepId: 's1' })
    expect(state.progress.steps[0].attempts).toBe(1)
    expect(state.stats.attempts).toBe(1)
  })

  test('a correct verdict sets mood correct and moves to the next step', () => {
    const state = tutorTurn(answer(lessonState()), 'Yes!', correct)
    expect(lastMessage(state).mood).toBe('correct')
    expect(state.progress.currentStepIndex).toBe(1)
  })

  test('a wrong or partial verdict sets mood hint and stays on the step', () => {
    for (const control of [wrong, partial]) {
      const state = tutorTurn(answer(lessonState()), 'Not quite', control)
      expect(lastMessage(state).mood).toBe('hint')
      expect(state.progress.currentStepIndex).toBe(0)
    }
  })

  test('a forced explanation sets mood stuck, ends the step and moves on', () => {
    let state = lessonState()
    for (let i = 0; i < MAX_ATTEMPTS; i++) state = tutorTurn(answer(state), 'Try again', wrong)
    expect(lastMessage(state).mood).toBe('stuck')
    expect(state.progress.steps[0].status).toBe('done')
    expect(state.progress.currentStepIndex).toBe(1)
  })

  test('a begin turn sets no mood', () => {
    expect(lastMessage(tutorTurn(lessonState(), 'Welcome', { verdict: 'partial', advance: false })).mood).toBeUndefined()
  })

  test('praiseFor counts the correct tutor messages before this one', () => {
    let state = tutorTurn(answer(lessonState()), 'Yes', correct)
    state = tutorTurn(answer(state), 'Right again', correct)
    const [first, second] = state.messages.filter((m) => m.mood === 'correct')
    expect(praiseFor(state, first.id)).toBe(0)
    expect(praiseFor(state, second.id)).toBe(1)
  })

  test('the lesson is done after the last step is correct', () => {
    let state = lessonState()
    for (let i = 0; i < 3; i++) state = tutorTurn(answer(state), 'Yes', correct)
    expect(state.phase).toBe('done')
    expect(state.progress.currentStepIndex).toBe(2)
  })
})

describe('a new answer after a turn that failed', () => {
  test('replaces the unanswered answer and counts one attempt', () => {
    let state = answer(lessonState(), 'first try')
    state = run(state, { type: 'tutorStarted', stepId: 's1' }, { type: 'failed', error: { code: 'network', message: 'x' } })
    state = answer(state, 'second try')
    expect(state.messages.filter((m) => m.role === 'student').map((m) => m.text)).toEqual(['second try'])
    expect(state.progress.steps[0].attempts).toBe(1)
    expect(state.stats.attempts).toBe(1)
    expect(state.error).toBeNull()
  })

  test('does not replace an answer that the tutor has answered', () => {
    let state = tutorTurn(answer(lessonState(), 'first'), 'No', wrong)
    state = answer(state, 'second')
    expect(state.messages.filter((m) => m.role === 'student')).toHaveLength(2)
    expect(state.progress.steps[0].attempts).toBe(2)
  })

  test('does not replace a hint request', () => {
    let state = run(lessonState(), { type: 'hintRequested' })
    state = answer(state, 'my guess')
    expect(state.messages.map((m) => m.kind ?? m.role)).toEqual(['hint', 'student'])
  })
})

describe('hints', () => {
  const hint = { type: 'hintRequested' }

  test('hintRequested adds a hint message, raises the level and adds no attempt', () => {
    const state = run(lessonState(), hint)
    expect(lastMessage(state)).toMatchObject({ role: 'student', kind: 'hint' })
    expect(state.progress.steps[0]).toMatchObject({ hintLevel: 1, attempts: 0 })
    expect(state.stats.hints).toBe(1)
  })

  test('a third hint request does nothing', () => {
    const two = run(lessonState(), hint, hint)
    const three = reducer(two, hint)
    expect(three).toBe(two)
    expect(two.progress.steps[0].hintLevel).toBe(2)
  })

  test('a hint turn sets mood hint and never ends the step', () => {
    const state = tutorTurn(run(lessonState(), hint), 'Look at page 1', partial)
    expect(lastMessage(state).mood).toBe('hint')
    expect(state.progress.currentStepIndex).toBe(0)
  })

  test('a forced explanation does not trigger after a hint when the attempts reached the limit', () => {
    let state = lessonState()
    state = { ...state, progress: { ...state.progress, steps: state.progress.steps.map((s, i) => (i === 0 ? { ...s, attempts: MAX_ATTEMPTS } : s)) } }
    state = tutorTurn(run(state, hint), 'A hint', partial)
    expect(state.progress.currentStepIndex).toBe(0)
  })
})

describe('off topic', () => {
  test('an off_topic verdict saves the student text and gives the attempt back', () => {
    const state = tutorTurn(answer(lessonState(), 'who won the match?'), 'Not in this lesson', offTopic)
    expect(state.parkedQuestions).toEqual(['who won the match?'])
    expect(state.progress.steps[0].attempts).toBe(0)
    expect(state.stats.attempts).toBe(0)
    expect(lastMessage(state).mood).toBeUndefined()
  })

  test('only the first 3 saved questions are kept', () => {
    let state = lessonState()
    for (const q of ['q1', 'q2', 'q3', 'q4']) state = tutorTurn(answer(state, q), 'Later', offTopic)
    expect(state.parkedQuestions).toEqual(['q1', 'q2', 'q3'])
  })
})
