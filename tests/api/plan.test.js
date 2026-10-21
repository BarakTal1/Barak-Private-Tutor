import { fakeReq, fakeRes, provider } from '../helpers/http.js'
import { buildPlanMessages } from '../../server/prompts.js'

vi.mock('../../server/llm.js', () => ({ complete: vi.fn() }))
const { complete } = await import('../../server/llm.js')
const { default: handler } = await import('../../api/plan.js')

const passages = [
  { id: 'p1', label: 'Page 1', text: 'A triangle has three sides.' },
  { id: 'p2', label: 'Page 2', text: 'The longest side is the hypotenuse.' },
]
const goodPlan = {
  title: 'Triangles',
  language: 'English',
  audience: '7th grade',
  estimatedMinutes: 4,
  steps: [
    { id: 's1', title: 'Sides', goal: 'Count sides', passageIds: ['p1'], checkQuestion: 'How many sides?', keyPoints: ['three'] },
    { id: 's2', title: 'Hypotenuse', goal: 'Find the longest side', passageIds: ['p2'], checkQuestion: 'Which side is longest?', keyPoints: ['hypotenuse'] },
  ],
}
const call = (body = {}) => {
  const res = fakeRes()
  const req = fakeReq({ provider, teacherPrompt: 'Teach 7th graders', passages, ...body })
  return handler(req, res).then(() => res)
}

beforeEach(() => {
  complete.mockReset()
})

test('returns a validated plan', async () => {
  complete.mockResolvedValueOnce(JSON.stringify(goodPlan))
  const res = await call()
  expect(res.statusCode).toBe(200)
  expect(res.payload.plan.steps).toHaveLength(2)
})

test('retries once when the first answer is not valid JSON, then returns the plan', async () => {
  complete.mockResolvedValueOnce('Sure! Here is a plan.').mockResolvedValueOnce(JSON.stringify(goodPlan))
  const res = await call()
  expect(complete).toHaveBeenCalledTimes(2)
  expect(res.statusCode).toBe(200)
})

test('returns provider_error after two failures', async () => {
  complete.mockResolvedValue('not json')
  const res = await call()
  expect(complete).toHaveBeenCalledTimes(2)
  expect(res.statusCode).toBe(502)
  expect(res.payload.error.code).toBe('provider_error')
})

test('an empty teacherPrompt still returns a plan', async () => {
  complete.mockResolvedValueOnce(JSON.stringify(goodPlan))
  const res = await call({ teacherPrompt: '' })
  expect(res.statusCode).toBe(200)
})

test('repairs a step that has no valid passage id', async () => {
  const broken = { ...goodPlan, steps: [{ ...goodPlan.steps[0], passageIds: ['p99'] }] }
  complete.mockResolvedValueOnce(JSON.stringify(broken))
  const res = await call()
  expect(res.payload.plan.steps[0].passageIds).toEqual(['p1'])
})

test('answers bad_request without passages', async () => {
  const res = await call({ passages: [] })
  expect(res.statusCode).toBe(400)
  expect(res.payload.error.code).toBe('bad_request')
})

test('maps a provider error from the adapter', async () => {
  const { HttpError } = await import('../../server/http.js')
  complete.mockRejectedValueOnce(new HttpError(401, 'bad_key', 'The provider rejected the API key.'))
  const res = await call()
  expect(res.statusCode).toBe(401)
  expect(res.payload.error.code).toBe('bad_key')
})

describe('buildPlanMessages', () => {
  test('puts the file text inside delimiters, apart from the teacher prompt', () => {
    const messages = buildPlanMessages({ teacherPrompt: 'Be Socratic', passages, compact: false })
    const user = messages.find((m) => m.role === 'user').content
    expect(user).toMatch(/<<<FILE[\s\S]*A triangle has three sides[\s\S]*FILE>>>/)
    expect(user).toMatch(/<<<TEACHER[\s\S]*Be Socratic[\s\S]*TEACHER>>>/)
  })

  test('says the file wins when the teacher prompt conflicts with it', () => {
    const system = buildPlanMessages({ teacherPrompt: '', passages, compact: false })[0].content
    expect(system).toMatch(/conflict[\s\S]*file/i)
  })

  test('compact mode sends only the start of each passage', () => {
    const long = [{ id: 'p1', label: 'Page 1', text: 'x'.repeat(2000) }]
    const user = buildPlanMessages({ teacherPrompt: '', passages: long, compact: true }).at(-1).content
    expect(user.length).toBeLessThan(900)
  })

  test('asks for the number of steps that matches the time in the prompt', () => {
    const user = buildPlanMessages({ teacherPrompt: 'under 10 minutes', passages, compact: false }).at(-1).content
    expect(user).toMatch(/5 steps/)
  })
})
