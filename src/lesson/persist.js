const STORAGE_KEY = 'tmtf.lesson.v1'
const SAVED_PHASES = ['lesson', 'done']

// A reload must never bring back a half-written tutor message or a stuck "streaming" state.
function settle(state) {
  const last = state.messages.at(-1)
  const messages = state.streaming && last?.role === 'tutor' ? state.messages.slice(0, -1) : state.messages
  return { ...state, messages, streaming: false, error: null }
}

export function clearLesson() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage can be blocked. The lesson then just does not survive a reload.
  }
}

export function saveLesson(state) {
  if (!SAVED_PHASES.includes(state.phase)) return clearLesson()
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(settle(state)))
  } catch {
    // Storage is full or blocked. The lesson then just does not survive a reload.
  }
}

export function loadLesson() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
    const valid =
      saved &&
      SAVED_PHASES.includes(saved.phase) &&
      Array.isArray(saved.plan?.steps) &&
      Array.isArray(saved.progress?.steps) &&
      Array.isArray(saved.ingest?.passages) &&
      Array.isArray(saved.messages)
    return valid ? settle(saved) : null
  } catch {
    return null
  }
}
