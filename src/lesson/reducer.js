import {
  MAX_HINT_LEVEL,
  applyControl,
  createProgress,
  isComplete,
  recordAnswer,
  recordHint,
  shouldForceExplain,
  undoAnswer,
} from './progress.js'

const MAX_PARKED_QUESTIONS = 3

export const initialState = () => ({
  phase: 'setup',
  fileName: '',
  teacherPrompt: '',
  ingest: null,
  plan: null,
  progress: null,
  messages: [],
  parkedQuestions: [],
  stats: { attempts: 0, hints: 0 },
  streaming: false,
  error: null,
})

const addMessage = (state, message) => ({
  ...state,
  messages: [...state.messages, { id: `m${state.messages.length + 1}`, passageIds: [], ...message }],
})

const currentStep = (state) => state.plan.steps[state.progress.currentStepIndex]
const lastOf = (state) => state.messages.at(-1)
const isOpenTutor = (message) => message?.role === 'tutor'

function replaceLast(state, change) {
  const messages = state.messages.slice(0, -1)
  return { ...state, messages: [...messages, { ...lastOf(state), ...change }] }
}

function dropEmptyTutor(state) {
  const last = lastOf(state)
  if (isOpenTutor(last) && !last.text) return { ...state, messages: state.messages.slice(0, -1) }
  return state
}

// What the student did just before the tutor message that is now closing.
function turnKind(messages) {
  const before = messages.at(-2)
  if (before?.role !== 'student') return 'begin'
  return before.kind === 'hint' ? 'hint' : 'answer'
}

function moodFor({ kind, control, forced }) {
  if (kind === 'hint') return 'hint'
  if (kind !== 'answer') return undefined
  if (control?.verdict === 'correct') return 'correct'
  if (forced) return 'stuck'
  if (control?.verdict === 'wrong' || control?.verdict === 'partial') return 'hint'
  return undefined
}

function finishTutor(state, control) {
  const kind = turnKind(state.messages)
  let next = { ...state, streaming: false }
  let forced = kind === 'answer' && shouldForceExplain(next.progress)
  if (kind === 'answer' && control?.verdict === 'off_topic') {
    const asked = state.messages.at(-2).text
    forced = false
    next = {
      ...next,
      progress: undoAnswer(next.progress),
      stats: { ...next.stats, attempts: Math.max(0, next.stats.attempts - 1) },
      parkedQuestions: [...next.parkedQuestions, asked].slice(0, MAX_PARKED_QUESTIONS),
    }
  }
  const mood = moodFor({ kind, control, forced })
  if (mood) next = replaceLast(next, { mood })
  if (kind === 'answer') {
    next = { ...next, progress: applyControl(next.progress, control, { forced }) }
    if (isComplete(next.progress)) next = { ...next, phase: 'done' }
  }
  return next
}

export function reducer(state, action) {
  switch (action.type) {
    case 'ingested':
      return {
        ...initialState(),
        phase: 'report',
        ingest: action.ingest,
        fileName: action.ingest.fileName,
        teacherPrompt: action.teacherPrompt,
      }
    case 'planReady':
      return {
        ...state,
        phase: 'lesson',
        plan: action.plan,
        progress: createProgress(action.plan),
        messages: [],
        parkedQuestions: [],
        stats: { attempts: 0, hints: 0 },
        error: null,
      }
    case 'studentSent':
      return addMessage(
        {
          ...state,
          error: null,
          progress: recordAnswer(state.progress),
          stats: { ...state.stats, attempts: state.stats.attempts + 1 },
        },
        { role: 'student', text: action.text, stepId: currentStep(state).id },
      )
    case 'hintRequested': {
      const level = state.progress.steps[state.progress.currentStepIndex].hintLevel
      if (state.streaming || level >= MAX_HINT_LEVEL) return state
      return addMessage(
        {
          ...state,
          error: null,
          progress: recordHint(state.progress),
          stats: { ...state.stats, hints: state.stats.hints + 1 },
        },
        { role: 'student', kind: 'hint', text: '', stepId: currentStep(state).id },
      )
    }
    case 'tutorStarted': {
      const step = state.plan.steps.find((s) => s.id === action.stepId)
      return addMessage(
        { ...state, streaming: true, error: null },
        { role: 'tutor', text: '', stepId: step.id, passageIds: step.passageIds },
      )
    }
    case 'tutorDelta':
      return isOpenTutor(lastOf(state)) ? replaceLast(state, { text: lastOf(state).text + action.text }) : state
    case 'tutorFinished':
      return isOpenTutor(lastOf(state)) ? finishTutor(state, action.control) : { ...state, streaming: false }
    case 'tutorStopped': {
      const stopped = { ...state, streaming: false }
      const last = lastOf(stopped)
      return state.streaming && isOpenTutor(last) && last.text ? replaceLast(stopped, { stopped: true }) : dropEmptyTutor(stopped)
    }
    case 'stoppedDiscarded':
      return lastOf(state)?.stopped ? { ...state, messages: state.messages.slice(0, -1) } : state
    case 'failed':
      return dropEmptyTutor({ ...state, streaming: false, error: action.error })
    case 'clearError':
      return { ...state, error: null }
    case 'reset':
      return initialState()
    default:
      return state
  }
}
