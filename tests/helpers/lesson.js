import { initialState, reducer } from '../../src/lesson/reducer.js'

export const ingest = {
  fileName: 'triangles.pdf',
  passages: [
    { id: 'p1', label: 'Page 1', page: 1, text: 'A triangle has three sides.', source: 'text' },
    { id: 'p2', label: 'Page 2', page: 2, text: 'The longest side is the hypotenuse.', source: 'text' },
    { id: 'p3', label: 'Page 3', page: 3, text: 'Squares of the sides add up.', source: 'text' },
  ],
  pages: [],
  warnings: [],
}

export const plan = {
  title: 'Triangles',
  language: 'English',
  audience: '7th grade',
  estimatedMinutes: 6,
  steps: [
    { id: 's1', title: 'Sides', goal: 'Count sides', passageIds: ['p1'], checkQuestion: 'How many sides?', keyPoints: ['three sides'] },
    { id: 's2', title: 'Hypotenuse', goal: 'Find it', passageIds: ['p2'], checkQuestion: 'Which is longest?', keyPoints: ['the hypotenuse'] },
    { id: 's3', title: 'Pythagoras', goal: 'Use it', passageIds: ['p3'], checkQuestion: 'What adds up?', keyPoints: ['squares add up'] },
  ],
}

export const run = (state, ...actions) => actions.reduce(reducer, state)

export function lessonState() {
  return run(
    initialState(),
    { type: 'ingested', ingest, teacherPrompt: 'Be Socratic' },
    { type: 'planReady', plan },
  )
}

// One full tutor turn: the tutor message opens, streams `text`, and finishes with `control`.
export function tutorTurn(state, text, control) {
  const stepId = state.plan.steps[state.progress.currentStepIndex].id
  return run(
    state,
    { type: 'tutorStarted', stepId },
    { type: 'tutorDelta', text },
    { type: 'tutorFinished', control },
  )
}

export const answer = (state, text = 'my answer') => run(state, { type: 'studentSent', text })
