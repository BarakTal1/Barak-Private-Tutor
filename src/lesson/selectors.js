import { shouldForceExplain } from './progress.js'

const HISTORY_MESSAGES = 6
const HINT_LINE = 'Hint, please.'

export const currentStep = (state) => state.plan.steps[state.progress.currentStepIndex]

export const stepCounter = (state) => ({
  current: state.progress.currentStepIndex + 1,
  total: state.plan.steps.length,
})

export function passagesFor(state, message) {
  const ids = new Set(message.passageIds)
  return state.ingest.passages.filter((passage) => ids.has(passage.id))
}

// How many correct tutor messages came before this one. The praise phrase follows this number.
export function praiseFor(state, messageId) {
  const index = state.messages.findIndex((message) => message.id === messageId)
  return state.messages.slice(0, index).filter((message) => message.mood === 'correct').length
}

// What the server needs for one tutor turn. `studentText` is the answer of the student, or null.
// The state already holds that answer as its last message, so it is left out of the history.
export function turnInput(state, studentText, request = 'answer') {
  const step = currentStep(state)
  const stepProgress = state.progress.steps[state.progress.currentStepIndex]
  const last = state.messages.at(-1)
  const before = last?.role === 'student' ? state.messages.slice(0, -1) : state.messages
  const history = before
    .map((message) => ({ role: message.role, text: message.kind === 'hint' ? HINT_LINE : message.text }))
    .filter((message) => message.text)
    .slice(-HISTORY_MESSAGES)
  const { title, language, audience } = state.plan
  return {
    teacherPrompt: state.teacherPrompt,
    plan: { title, language, audience },
    step,
    passages: state.ingest.passages.filter((passage) => step.passageIds.includes(passage.id)),
    progress: {
      stepIndex: state.progress.currentStepIndex,
      total: state.plan.steps.length,
      attempts: stepProgress.attempts,
      hintLevel: stepProgress.hintLevel,
    },
    history,
    studentMessage: studentText,
    request,
    forceExplain: request === 'answer' && studentText != null && shouldForceExplain(state.progress),
  }
}

// For a tutor message that answers a hint request: how many hints the student has asked for on this step.
export function hintLevelFor(state, messageId) {
  const index = state.messages.findIndex((message) => message.id === messageId)
  const before = state.messages[index - 1]
  if (before?.role !== 'student' || before.kind !== 'hint') return 0
  return state.messages.slice(0, index).filter((m) => m.kind === 'hint' && m.stepId === before.stepId).length
}
