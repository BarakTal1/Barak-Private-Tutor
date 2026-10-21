import {
  applyControl,
  createProgress,
  isComplete,
  recordAnswer,
  recordHint,
  shouldForceExplain,
} from '../../src/lesson/progress.js'
import { MAX_ATTEMPTS } from '../../shared/limits.js'

const progress = () => createProgress({ steps: [{}, {}, {}] })
const correct = { verdict: 'correct', advance: true }
const wrong = { verdict: 'wrong', advance: false }

test('createProgress starts on the first step', () => {
  const p = progress()
  expect(p.currentStepIndex).toBe(0)
  expect(p.steps.map((s) => s.status)).toEqual(['teaching', 'pending', 'pending'])
})

test('a student answer counts as one attempt', () => {
  expect(recordAnswer(progress()).steps[0].attempts).toBe(1)
})

test('after MAX_ATTEMPTS attempts the explanation is forced', () => {
  let p = progress()
  for (let i = 0; i < MAX_ATTEMPTS - 1; i++) p = recordAnswer(p)
  expect(shouldForceExplain(p)).toBe(false)
  p = recordAnswer(p)
  expect(shouldForceExplain(p)).toBe(true)
})

test('a forced turn makes the step done and moves on even when the control says no', () => {
  let p = progress()
  for (let i = 0; i < MAX_ATTEMPTS; i++) p = recordAnswer(p)
  p = applyControl(p, wrong, { forced: true })
  expect(p.steps[0].status).toBe('done')
  expect(p.currentStepIndex).toBe(1)
})

test('a correct control with advance moves to the next step with fresh counters', () => {
  const p = applyControl(recordAnswer(progress()), correct, { forced: false })
  expect(p.currentStepIndex).toBe(1)
  expect(p.steps[0].status).toBe('done')
  expect(p.steps[1]).toEqual({ status: 'teaching', attempts: 0, hintLevel: 0 })
})

test('a null control does not advance', () => {
  const before = recordAnswer(progress())
  expect(applyControl(before, null, { forced: false })).toEqual(before)
})

test('a wrong verdict does not advance', () => {
  const before = recordAnswer(progress())
  expect(applyControl(before, wrong, { forced: false })).toEqual(before)
})

test('finishing the last step completes the lesson and stays on the last step', () => {
  let p = progress()
  for (let i = 0; i < 3; i++) p = applyControl(p, correct, { forced: false })
  expect(isComplete(p)).toBe(true)
  expect(p.currentStepIndex).toBe(2)
  expect(p.steps.every((s) => s.status === 'done')).toBe(true)
})

test('recordHint raises the level to at most 2 and adds no attempt', () => {
  let p = recordHint(recordHint(recordHint(progress())))
  expect(p.steps[0].hintLevel).toBe(2)
  expect(p.steps[0].attempts).toBe(0)
})
