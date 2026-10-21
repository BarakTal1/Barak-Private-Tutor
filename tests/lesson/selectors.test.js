import { hintLevelFor, turnInput } from '../../src/lesson/selectors.js'
import { MAX_ATTEMPTS } from '../../shared/limits.js'
import { answer, ingest, lessonState, plan, run, tutorTurn } from '../helpers/lesson.js'

const wrong = { verdict: 'wrong', advance: false }

describe('turnInput', () => {
  test('describes the lesson, the current step and only the passages of that step', () => {
    const payload = turnInput(lessonState(), null)
    expect(payload).toMatchObject({
      teacherPrompt: 'Be Socratic',
      plan: { title: 'Triangles', language: 'English', audience: '7th grade' },
      step: plan.steps[0],
      passages: [ingest.passages[0]],
      progress: { stepIndex: 0, total: 3, attempts: 0, hintLevel: 0 },
      studentMessage: null,
      request: 'answer',
      forceExplain: false,
    })
  })

  test('the plan summary does not carry the steps', () => {
    expect(turnInput(lessonState(), null).plan).toEqual({ title: 'Triangles', language: 'English', audience: '7th grade' })
  })

  test('the begin turn of the next step sees the passages of the new step', () => {
    const state = tutorTurn(answer(lessonState()), 'Yes', { verdict: 'correct', advance: true })
    const payload = turnInput(state, null)
    expect(payload.step.id).toBe('s2')
    expect(payload.passages).toEqual([ingest.passages[1]])
    expect(payload.progress.stepIndex).toBe(1)
  })

  test('the student message is sent apart and left out of the history', () => {
    const state = answer(tutorTurn(lessonState(), 'Question?', null), 'three')
    const payload = turnInput(state, 'three')
    expect(payload.studentMessage).toBe('three')
    expect(payload.history).toEqual([{ role: 'tutor', text: 'Question?' }])
    expect(payload.progress.attempts).toBe(1)
  })

  test('the history keeps the last 6 messages in order', () => {
    let state = tutorTurn(lessonState(), 't0', null)
    for (let i = 1; i <= 5; i++) state = tutorTurn(answer(state, `s${i}`), `t${i}`, wrong)
    state = answer(state, 'last')
    const { history } = turnInput(state, 'last')
    expect(history).toHaveLength(6)
    expect(history.at(-1)).toEqual({ role: 'tutor', text: 't5' })
    expect(history[0]).toEqual({ role: 'student', text: 's3' })
  })

  test('the history leaves out messages with no text', () => {
    let state = run(lessonState(), { type: 'tutorStarted', stepId: 's1' }, { type: 'tutorStopped' })
    state = tutorTurn(state, 'Hello', null)
    expect(turnInput(answer(state, 'x'), 'x').history).toEqual([{ role: 'tutor', text: 'Hello' }])
  })

  test('a hint request is sent as a request, with no student message, and is left out of the history', () => {
    const state = run(tutorTurn(lessonState(), 'Question?', null), { type: 'hintRequested' })
    const payload = turnInput(state, null, 'hint')
    expect(payload).toMatchObject({ studentMessage: null, request: 'hint', progress: { hintLevel: 1, attempts: 0 } })
    expect(payload.history).toEqual([{ role: 'tutor', text: 'Question?' }])
  })

  test('an earlier hint request stays in the history as a line of text', () => {
    let state = tutorTurn(run(tutorTurn(lessonState(), 'Q?', null), { type: 'hintRequested' }), 'A hint', { verdict: 'partial', advance: false })
    state = answer(state, 'my guess')
    const { history } = turnInput(state, 'my guess')
    expect(history.map((m) => m.role)).toEqual(['tutor', 'student', 'tutor'])
    expect(history[1].text).toMatch(/hint/i)
  })

  test('the explanation is forced from the MAX_ATTEMPTS-th answer on, and only for an answer', () => {
    let state = lessonState()
    for (let i = 0; i < MAX_ATTEMPTS - 1; i++) state = tutorTurn(answer(state), 'No', wrong)
    state = answer(state, 'again')
    expect(state.progress.steps[0].attempts).toBe(MAX_ATTEMPTS)
    expect(turnInput(state, 'again').forceExplain).toBe(true)
    expect(turnInput(state, null, 'hint').forceExplain).toBe(false)
    expect(turnInput(state, null).forceExplain).toBe(false)
  })

  test('the explanation is not forced before the limit', () => {
    expect(turnInput(answer(lessonState()), 'x').forceExplain).toBe(false)
  })
})

describe('hintLevelFor', () => {
  const hint = { type: 'hintRequested' }

  test('counts the hint requests of the step up to a tutor message that follows one', () => {
    let state = tutorTurn(lessonState(), 'Q?', null)
    state = tutorTurn(run(state, hint), 'First hint', { verdict: 'partial', advance: false })
    state = tutorTurn(run(state, hint), 'Second hint', { verdict: 'partial', advance: false })
    const tutors = state.messages.filter((m) => m.role === 'tutor')
    expect(tutors.map((m) => hintLevelFor(state, m.id))).toEqual([0, 1, 2])
  })

  test('is 0 for a message that does not follow a hint request', () => {
    const state = tutorTurn(answer(tutorTurn(lessonState(), 'Q?', null)), 'No', wrong)
    for (const message of state.messages) expect(hintLevelFor(state, message.id)).toBe(0)
  })

  test('does not count hint requests of an earlier step', () => {
    let state = tutorTurn(run(tutorTurn(lessonState(), 'Q?', null), hint), 'Hint', { verdict: 'partial', advance: false })
    state = tutorTurn(answer(state), 'Yes', { verdict: 'correct', advance: true })
    state = tutorTurn(run(tutorTurn(state, 'Q2?', null), hint), 'Hint 2', { verdict: 'partial', advance: false })
    expect(hintLevelFor(state, state.messages.at(-1).id)).toBe(1)
  })
})
