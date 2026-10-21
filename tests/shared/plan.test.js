import {
  minutesFromPrompt,
  parsePlanJson,
  repairPassageIds,
  stepCountFor,
  validatePlan,
} from '../../shared/plan.js'

const passages = [
  { id: 'p1', label: 'Page 1 Triangles', text: 'A triangle has three sides.' },
  { id: 'p2', label: 'Page 2 Pythagoras theorem', text: 'a2 + b2 = c2' },
  { id: 'p3', label: 'Page 3 Practice', text: 'Try some examples.' },
]
const known = new Set(passages.map((p) => p.id))

function rawPlan(steps) {
  return { title: 'Triangles', language: 'English', audience: '7th grade', estimatedMinutes: 6, steps }
}
function rawStep(overrides = {}) {
  return {
    id: 's1',
    title: 'What is a triangle',
    goal: 'Name the parts of a triangle',
    passageIds: ['p1'],
    checkQuestion: 'How many sides does a triangle have?',
    keyPoints: ['Three sides'],
    ...overrides,
  }
}

describe('validatePlan', () => {
  test('returns a valid plan unchanged', () => {
    const { plan, errors } = validatePlan(rawPlan([rawStep()]), known)
    expect(errors).toEqual([])
    expect(plan.steps[0].passageIds).toEqual(['p1'])
  })

  test('drops unknown passage ids', () => {
    const { plan } = validatePlan(rawPlan([rawStep({ passageIds: ['p1', 'p99'] })]), known)
    expect(plan.steps[0].passageIds).toEqual(['p1'])
  })

  test('rejects a step without a checkQuestion', () => {
    const { plan, errors } = validatePlan(rawPlan([rawStep({ checkQuestion: ' ' })]), known)
    expect(plan).toBeNull()
    expect(errors.join(' ')).toMatch(/checkQuestion/)
  })

  test('rejects a plan with no steps and a plan with more than 30 steps', () => {
    expect(validatePlan(rawPlan([]), known).plan).toBeNull()
    const many = Array.from({ length: 31 }, (_, i) => rawStep({ id: `s${i}` }))
    expect(validatePlan(rawPlan(many), known).plan).toBeNull()
  })

  test('rejects something that is not an object', () => {
    expect(validatePlan('nope', known).plan).toBeNull()
    expect(validatePlan(null, known).plan).toBeNull()
  })

  test('ignores the ids of the model, which can repeat each other', () => {
    const { plan } = validatePlan(
      rawPlan([rawStep({ id: 's1' }), rawStep({ id: 's1' }), rawStep({ id: 'x' })]),
      known,
    )
    expect(plan.steps.map((step) => step.id)).toEqual(['s1', 's2', 's3'])
  })

  test('gives missing step ids and keyPoints a default', () => {
    const { plan } = validatePlan(rawPlan([rawStep({ id: undefined, keyPoints: undefined })]), known)
    expect(plan.steps[0].id).toBe('s1')
    expect(plan.steps[0].keyPoints).toEqual([])
  })
})

describe('repairPassageIds', () => {
  test('assigns the passage whose label matches the step title', () => {
    const { plan } = validatePlan(
      rawPlan([rawStep({ title: 'The Pythagoras theorem', passageIds: [] })]),
      known,
    )
    expect(repairPassageIds(plan, passages).steps[0].passageIds).toEqual(['p2'])
  })

  test('assigns the nearest passage by order when no label matches', () => {
    const { plan } = validatePlan(
      rawPlan([
        rawStep({ id: 's1', title: 'zzz', passageIds: [] }),
        rawStep({ id: 's2', title: 'qqq', passageIds: [] }),
        rawStep({ id: 's3', title: 'www', passageIds: [] }),
      ]),
      known,
    )
    const repaired = repairPassageIds(plan, passages)
    expect(repaired.steps.map((s) => s.passageIds)).toEqual([['p1'], ['p2'], ['p3']])
  })

  test('leaves steps that already have ids alone', () => {
    const { plan } = validatePlan(rawPlan([rawStep()]), known)
    expect(repairPassageIds(plan, passages)).toEqual(plan)
  })
})

describe('stepCountFor and minutesFromPrompt', () => {
  test('stepCountFor(15) is 7 or 8 and stepCountFor(null) is 6', () => {
    expect([7, 8]).toContain(stepCountFor(15))
    expect(stepCountFor(null)).toBe(6)
  })

  test('stepCountFor stays between 3 and 15', () => {
    expect(stepCountFor(1)).toBe(3)
    expect(stepCountFor(600)).toBe(15)
  })

  test('minutesFromPrompt reads English and Hebrew', () => {
    expect(minutesFromPrompt('Keep it under 15 minutes.')).toBe(15)
    expect(minutesFromPrompt('עד 20 דקות')).toBe(20)
    expect(minutesFromPrompt('Teach this to 7th graders')).toBeNull()
    expect(minutesFromPrompt('')).toBeNull()
  })
})

describe('parsePlanJson', () => {
  test('parses plain JSON and JSON in a code fence', () => {
    expect(parsePlanJson('{"a":1}')).toEqual({ a: 1 })
    expect(parsePlanJson('Here you go:\n```json\n{"a":1}\n```')).toEqual({ a: 1 })
  })

  test('throws on text with no JSON', () => {
    expect(() => parsePlanJson('sorry, I cannot')).toThrow()
  })
})
