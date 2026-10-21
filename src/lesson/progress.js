import { MAX_ATTEMPTS } from '../../shared/limits.js'

export const MAX_HINT_LEVEL = 2

const freshStep = (status) => ({ status, attempts: 0, hintLevel: 0 })

function updateCurrent(progress, change) {
  const steps = progress.steps.map((step, index) =>
    index === progress.currentStepIndex ? { ...step, ...change(step) } : step,
  )
  return { ...progress, steps }
}

export function createProgress(plan) {
  return {
    currentStepIndex: 0,
    steps: plan.steps.map((_, index) => freshStep(index === 0 ? 'teaching' : 'pending')),
  }
}

export const recordAnswer = (progress) =>
  updateCurrent(progress, (step) => ({ attempts: step.attempts + 1, status: 'checking' }))

export const undoAnswer = (progress) =>
  updateCurrent(progress, (step) => ({ attempts: Math.max(0, step.attempts - 1) }))

export const recordHint = (progress) =>
  updateCurrent(progress, (step) => ({ hintLevel: Math.min(MAX_HINT_LEVEL, step.hintLevel + 1) }))

export const shouldForceExplain = (progress) =>
  progress.steps[progress.currentStepIndex].attempts >= MAX_ATTEMPTS

export const isComplete = (progress) => progress.steps.every((step) => step.status === 'done')

// The attempt cap is enforced here, not by the model: a forced turn always ends the step.
export function applyControl(progress, control, { forced }) {
  const advance = forced || (control?.verdict === 'correct' && control.advance)
  if (!advance) return progress
  const done = updateCurrent(progress, () => ({ status: 'done' }))
  const next = done.currentStepIndex + 1
  if (next >= done.steps.length) return done
  return {
    currentStepIndex: next,
    steps: done.steps.map((step, index) => (index === next ? freshStep('teaching') : step)),
  }
}
