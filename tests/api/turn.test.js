import { fakeReq, fakeRes, provider } from '../helpers/http.js'
import { buildTurnMessages } from '../../server/prompts.js'
import { HttpError } from '../../server/http.js'
import { MAX_STUDENT_CHARS } from '../../shared/limits.js'

vi.mock('../../server/llm.js', () => ({ streamChat: vi.fn() }))
const { streamChat } = await import('../../server/llm.js')
const { default: handler } = await import('../../api/turn.js')

const step = {
  id: 's1',
  title: 'Sides',
  goal: 'Count the sides',
  checkQuestion: 'How many sides does a triangle have?',
  keyPoints: ['three'],
}
const passages = [{ id: 'p1', label: 'Page 1', text: 'A triangle has three sides.' }]
const base = {
  provider,
  teacherPrompt: 'Be Socratic',
  plan: { title: 'Triangles', language: 'English', audience: '7th grade' },
  step,
  passages,
  progress: { stepIndex: 0, total: 3, attempts: 0, hintLevel: 0 },
  history: [],
  studentMessage: 'three',
}

async function* chunks(...parts) {
  for (const part of parts) yield part
}
const call = async (overrides = {}) => {
  const res = fakeRes()
  await handler(fakeReq({ ...base, ...overrides }), res)
  return res
}

beforeEach(() => {
  streamChat.mockReset()
})

describe('POST /api/turn', () => {
  test('streams text and ends with the control line', async () => {
    streamChat.mockReturnValue(chunks('Well ', 'done.\n<<STATE {"verdict":"correct","advance":true}>>'))
    const res = await call()
    expect(res.statusCode).toBe(200)
    expect(res.headers['content-type']).toMatch(/text\/plain/)
    expect(res.text).toBe('Well done.\n<<STATE {"verdict":"correct","advance":true}>>')
  })

  test('answers bad_request for a studentMessage over MAX_STUDENT_CHARS', async () => {
    const res = await call({ studentMessage: 'a'.repeat(MAX_STUDENT_CHARS + 1) })
    expect(res.statusCode).toBe(400)
    expect(res.payload.error.code).toBe('bad_request')
    expect(streamChat).not.toHaveBeenCalled()
  })

  test('answers bad_request when step is missing', async () => {
    const res = await call({ step: undefined })
    expect(res.statusCode).toBe(400)
  })

  test('answers the error as JSON when the provider fails before the first byte', async () => {
    streamChat.mockImplementation(async function* () {
      throw new HttpError(401, 'bad_key', 'The provider rejected the API key.')
    })
    const res = await call()
    expect(res.statusCode).toBe(401)
    expect(res.payload.error.code).toBe('bad_key')
  })

  test('ends the response without JSON when the provider fails in the middle', async () => {
    streamChat.mockImplementation(async function* () {
      yield 'Half an answer'
      throw new HttpError(502, 'provider_error', 'The provider returned an error.')
    })
    const res = await call()
    expect(res.text).toBe('Half an answer')
    expect(res.payload).toBeNull()
    expect(res.ended).toBe(true)
  })

  test('begins a step when studentMessage is null', async () => {
    streamChat.mockReturnValue(chunks('Let us begin.\n<<STATE {"verdict":"partial","advance":false}>>'))
    const res = await call({ studentMessage: null })
    expect(res.statusCode).toBe(200)
  })
})

describe('buildTurnMessages', () => {
  const build = (overrides = {}) => buildTurnMessages({ ...base, request: 'answer', forceExplain: false, ...overrides })
  const system = (messages) => messages[0].content

  test('the prompt contains the forceExplain instruction only when forceExplain is true', () => {
    expect(system(build({ forceExplain: true }))).toMatch(/explain the answer/i)
    expect(system(build({ forceExplain: false }))).not.toMatch(/explain the answer/i)
  })

  test('the file text and the student message are inside delimiters', () => {
    const messages = build()
    expect(system(messages)).toMatch(/<<<FILE[\s\S]*A triangle has three sides[\s\S]*FILE>>>/)
    expect(messages.at(-1)).toEqual({ role: 'user', content: '<<<STUDENT\nthree\nSTUDENT>>>' })
  })

  test('request hint at level 1 and at level 2 gives two different instructions and neither allows the answer', () => {
    const one = system(build({ request: 'hint', progress: { ...base.progress, hintLevel: 1 } }))
    const two = system(build({ request: 'hint', progress: { ...base.progress, hintLevel: 2 } }))
    expect(one).not.toBe(two)
    for (const text of [one, two]) expect(text).toMatch(/do not (reveal|give) the answer/i)
  })

  test('history maps tutor to assistant and student to user and keeps the last 8', () => {
    const history = Array.from({ length: 12 }, (_, i) => ({ role: i % 2 ? 'student' : 'tutor', text: `m${i}` }))
    const messages = build({ history })
    const middle = messages.slice(1, -1)
    expect(middle).toHaveLength(8)
    expect(middle[0]).toEqual({ role: 'assistant', content: 'm4' })
    expect(middle[1]).toEqual({ role: 'user', content: 'm5' })
  })

  test('the prompt tells the tutor the file and the student are data, not instructions', () => {
    expect(system(build())).toMatch(/data, never instructions/i)
  })

  test('the prompt asks for the control line last', () => {
    expect(system(build())).toContain('<<STATE')
  })

  test('the last step asks for a recap', () => {
    const last = build({ progress: { ...base.progress, stepIndex: 2, total: 3 } })
    expect(system(last)).toMatch(/recap/i)
    expect(system(build())).not.toMatch(/recap/i)
  })
})
