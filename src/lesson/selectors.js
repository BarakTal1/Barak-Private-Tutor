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
