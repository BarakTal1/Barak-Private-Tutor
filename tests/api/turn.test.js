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

  test('answers provider_error as JSON when the model sends no text at all', async () => {
    streamChat.mockReturnValue(chunks())
    const res = await call()
    expect(res.statusCode).toBe(502)
    expect(res.payload.error.code).toBe('provider_error')
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

  test('the context line names the difficulty, and medium is the default', () => {
    expect(system(build({ plan: { ...base.plan, difficulty: 'easy' } }))).toContain('Difficulty: easy.')
    expect(system(build({ plan: { ...base.plan, difficulty: undefined } }))).toContain('Difficulty: medium.')
  })

  test('the tutor prompt explains the three difficulties and the lesson language', () => {
    const text = system(build())
    expect(text).toMatch(/# DIFFICULTY/)
    expect(text).toMatch(/easy[\s\S]*medium[\s\S]*challenging/i)
    expect(text).toMatch(/lesson language, even when the passages are in another language/i)
  })

  test('the forced explanation asks for the answer and the way to it, and asks no new question', () => {
    const text = system(build({ forceExplain: true }))
    expect(text).toMatch(/do not ask a question/i)
    expect(text).toMatch(/say what the answer is/i)
    expect(text).toMatch(/show (clearly )?how to get it/i)
  })

  test.each([
    ['an answer', { studentMessage: 'three', request: 'answer' }],
    ['a hint', { studentMessage: null, request: 'hint' }],
    ['the start of a step', { studentMessage: null, request: 'answer' }],
  ])('the last message for %s reminds the model of the control line', (name, overrides) => {
    const last = build(overrides).at(-1)
    expect(last.role).toBe('user')
    expect(last.content).toMatch(/finish (your reply )?with the <<STATE/i)
  })

  test('the last message also reminds the model to use only the passages and to ask at most one question', () => {
    const text = build({ studentMessage: 'three', request: 'answer' }).at(-1).content
    expect(text).toMatch(/use only the passages/i)
    expect(text).toMatch(/at most one question/i)
  })

  test('the forced explanation ends by saying that the lesson moves on', () => {
    expect(system(build({ forceExplain: true }))).toMatch(/end with one short sentence[\s\S]*move on/i)
  })

  test('the tutor may not add facts, analogies or demonstrations that the passages do not contain', () => {
    expect(system(build())).toMatch(/common knowledge/i)
    expect(system(build())).toMatch(/demonstration/i)
  })

  test('the control line says that a follow-up question means no advance', () => {
    const text = system(build())
    expect(text).toMatch(/follow-up question[\s\S]*"partial" and advance false/i)
    expect(text).toMatch(/advance to true[\s\S]*ask no new question/i)
  })

  test('Hebrew is spoken to the student in plural or neutral forms', () => {
    expect(system(build())).toMatch(/Hebrew[\s\S]*plural[\s\S]*not masculine singular/i)
  })

  test('a discouraged student gets care without an emergency warning, and a student in danger gets the strong reply', () => {
    const text = system(build())
    expect(text).toMatch(/discouraged[\s\S]*do not mention (an )?emergency/i)
    expect(text).toMatch(/hurt themselves[\s\S]*trusted adult/i)
    expect(text).toMatch(/very easy next step/i)
  })

  test('the difficulty section says how the opening differs', () => {
    expect(system(build())).toMatch(/challenging[\s\S]*prediction/i)
    expect(system(build())).toMatch(/easy[\s\S]*everyday example/i)
  })

  test('the prompt contains the forceExplain instruction only when forceExplain is true', () => {
    expect(system(build({ forceExplain: true }))).toMatch(/explain the answer/i)
    expect(system(build({ forceExplain: false }))).not.toMatch(/explain the answer/i)
  })

  test('the file text and the student message are inside delimiters', () => {
    const messages = build()
    expect(system(messages)).toMatch(/<<<FILE[\s\S]*A triangle has three sides[\s\S]*FILE>>>/)
    expect(messages.at(-1).role).toBe('user')
    expect(messages.at(-1).content).toMatch(/^<<<STUDENT\nthree\nSTUDENT>>>/)
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

describe('the tutor system prompt file', () => {
  test('it is the start of the system message and has the method and the guardrails', async () => {
    const { TUTOR_SYSTEM_PROMPT } = await import('../../server/tutor-prompt.js')
    const system = buildTurnMessages({ ...base, request: 'answer', forceExplain: false })[0].content
    expect(system.startsWith(TUTOR_SYSTEM_PROMPT)).toBe(true)
    expect(TUTOR_SYSTEM_PROMPT).toMatch(/# TEACHING METHOD/)
    expect(TUTOR_SYSTEM_PROMPT).toMatch(/# GUARDRAILS/)
  })
})
