import { MINUTES_PER_STEP } from './limits.js'
import { DIFFICULTIES } from './options.js'

const MAX_STEPS = 30
const DEFAULT_STEPS = 6

const clean = (value) => (typeof value === 'string' ? value.trim() : '')
const words = (value) => (value.toLowerCase().match(/[\p{L}\p{N}]{2,}/gu) ?? [])

export function validatePlan(raw, knownIds) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.steps)) {
    return { plan: null, errors: ['The plan must be an object with a steps list.'] }
  }
  if (raw.steps.length < 1 || raw.steps.length > MAX_STEPS) {
    return { plan: null, errors: [`The plan needs 1 to ${MAX_STEPS} steps.`] }
  }
  const errors = []
  const steps = raw.steps.map((step, index) => {
    const title = clean(step?.title)
    const goal = clean(step?.goal)
    const checkQuestion = clean(step?.checkQuestion)
    for (const [name, value] of Object.entries({ title, goal, checkQuestion })) {
      if (!value) errors.push(`Step ${index + 1} has no ${name}.`)
    }
    return {
      // The ids of the model can repeat each other, so they are not used.
      id: `s${index + 1}`,
      title,
      goal,
      passageIds: (Array.isArray(step?.passageIds) ? step.passageIds : []).filter((id) => knownIds.has(id)),
      checkQuestion,
      keyPoints: (Array.isArray(step?.keyPoints) ? step.keyPoints : []).map(clean).filter(Boolean),
    }
  })
  if (errors.length) return { plan: null, errors }
  const minutes = Number(raw.estimatedMinutes)
  return {
    plan: {
      title: clean(raw.title),
      language: clean(raw.language),
      audience: clean(raw.audience),
      difficulty: DIFFICULTIES.includes(raw.difficulty) ? raw.difficulty : 'medium',
      estimatedMinutes: minutes > 0 ? minutes : steps.length * MINUTES_PER_STEP,
      steps,
    },
    errors: [],
  }
}

// A step with no valid passage gets the passage whose label shares the most words
// with the step title. With no shared word it gets the passage at the same relative position.
export function repairPassageIds(plan, passages) {
  if (!passages.length) return plan
  const steps = plan.steps.map((step, index) => {
    if (step.passageIds.length) return step
    const titleWords = new Set(words(step.title))
    let best = null
    let bestScore = 0
    for (const passage of passages) {
      const score = words(passage.label).filter((word) => titleWords.has(word)).length
      if (score > bestScore) {
        best = passage
        bestScore = score
      }
    }
    if (!best) {
      const position = index / Math.max(1, plan.steps.length - 1)
      best = passages[Math.round(position * (passages.length - 1))]
    }
    return { ...step, passageIds: [best.id] }
  })
  return { ...plan, steps }
}

export function stepCountFor(minutes) {
  if (!minutes) return DEFAULT_STEPS
  return Math.min(15, Math.max(3, Math.round(minutes / MINUTES_PER_STEP)))
}

export function minutesFromPrompt(prompt) {
  const match = /(\d{1,3})\s*(?:minutes?|mins?|דקות|דקה|דק[׳'])/iu.exec(prompt ?? '')
  return match ? Number(match[1]) : null
}

export function parsePlanJson(text) {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end < start) throw new Error('No JSON object in the answer.')
  return JSON.parse(text.slice(start, end + 1))
}
