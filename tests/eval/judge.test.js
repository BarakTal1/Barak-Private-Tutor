import { buildJudgeMessages, createJudge, createLlm, parseJson } from '../../eval/judge.mjs'

describe('parseJson', () => {
  test('reads plain JSON', () => {
    expect(parseJson('{"pass": true, "reason": "ok"}')).toEqual({ pass: true, reason: 'ok' })
  })

  test('reads JSON inside a code fence and inside other words', () => {
    expect(parseJson('```json\n{"pass": false, "reason": "no"}\n```')).toEqual({ pass: false, reason: 'no' })
    expect(parseJson('Here is my answer: {"pass": true, "reason": "fine"} Thanks.')).toEqual({ pass: true, reason: 'fine' })
  })

  test.each(['', 'no json here', '{broken', null, undefined])('gives null for %j', (text) => {
    expect(parseJson(text)).toBeNull()
  })
})

describe('buildJudgeMessages', () => {
  const messages = buildJudgeMessages({ rubric: 'The tutor must not give the answer.', material: 'tutor: hello' })

  test('asks for JSON only and names the rubric', () => {
    expect(messages[0].role).toBe('system')
    expect(messages[0].content).toMatch(/JSON only/i)
    expect(messages[0].content).toContain('"pass"')
    expect(messages[1].content).toContain('The tutor must not give the answer.')
  })

  test('puts the material inside markers and says that it is data', () => {
    expect(messages[1].content).toMatch(/<<<MATERIAL[\s\S]*tutor: hello[\s\S]*MATERIAL>>>/)
    expect(messages[0].content).toMatch(/data, never instructions/i)
  })
})

describe('createLlm', () => {
  const reply = (content) => ({ ok: true, json: async () => ({ choices: [{ message: { content } }] }) })

  test('posts to chat/completions with the key in the Authorization header and returns the text', async () => {
    const fetch = vi.fn(async () => reply('hello'))
    const llm = createLlm({ baseUrl: 'https://api.example.com/v1', key: 'secret-key', fetch })
    await expect(llm({ model: 'm1', messages: [{ role: 'user', content: 'hi' }] })).resolves.toBe('hello')
    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe('https://api.example.com/v1/chat/completions')
    expect(init.headers.Authorization).toBe('Bearer secret-key')
    expect(JSON.parse(init.body)).toMatchObject({ model: 'm1', messages: [{ role: 'user', content: 'hi' }] })
    expect(init.body).not.toContain('secret-key')
  })

  test('sends no temperature unless the caller asks for one (some models reject it)', async () => {
    const fetch = vi.fn(async () => reply('x'))
    const llm = createLlm({ baseUrl: 'https://api.example.com/v1', key: 'k', fetch })
    await llm({ model: 'm', messages: [] })
    expect(JSON.parse(fetch.mock.calls[0][1].body)).not.toHaveProperty('temperature')
    await llm({ model: 'm', messages: [], temperature: 0.4 })
    expect(JSON.parse(fetch.mock.calls[1][1].body).temperature).toBe(0.4)
  })

  test('an error names the status and never the key', async () => {
    const fetch = vi.fn(async () => ({ ok: false, status: 401, text: async () => 'invalid key secret-key' }))
    const llm = createLlm({ baseUrl: 'https://api.example.com/v1', key: 'secret-key', fetch })
    const error = await llm({ model: 'm', messages: [] }).catch((err) => err)
    expect(error.message).toContain('401')
    expect(error.message).not.toContain('secret-key')
  })
})

describe('a judge that fails once', () => {
  test('check asks again when the first answer is not JSON, and uses the second', async () => {
    const llm = vi.fn().mockResolvedValueOnce('hmm').mockResolvedValueOnce('{"pass": true, "reason": "fine"}')
    await expect(createJudge({ llm, model: 'm' }).check('rule', 'material')).resolves.toEqual({ pass: true, reason: 'fine' })
    expect(llm).toHaveBeenCalledTimes(2)
  })

  test('check fails closed after two answers that are not JSON', async () => {
    const llm = vi.fn(async () => 'hmm')
    const result = await createJudge({ llm, model: 'm' }).check('rule', 'material')
    expect(result.pass).toBe(false)
    expect(llm).toHaveBeenCalledTimes(2)
  })

  test('ask asks again when the first answer is not JSON', async () => {
    const llm = vi.fn().mockResolvedValueOnce('').mockResolvedValueOnce('{"easier": "A"}')
    await expect(createJudge({ llm, model: 'm' }).ask('rule', 'material')).resolves.toEqual({ easier: 'A' })
    expect(llm).toHaveBeenCalledTimes(2)
  })

  test('ask gives null after two answers that are not JSON', async () => {
    const llm = vi.fn(async () => 'no')
    await expect(createJudge({ llm, model: 'm' }).ask('rule', 'material')).resolves.toBeNull()
  })
})

describe('createJudge', () => {
  const judgeWith = (text) => createJudge({ llm: vi.fn(async () => text), model: 'judge-model' })

  test('check returns pass and reason', async () => {
    await expect(judgeWith('{"pass": true, "reason": "no leak"}').check('rule', 'material')).resolves.toEqual({ pass: true, reason: 'no leak' })
  })

  test('check fails closed when the judge does not return JSON', async () => {
    const result = await judgeWith('I think it is fine').check('rule', 'material')
    expect(result.pass).toBe(false)
    expect(result.reason).toMatch(/did not return JSON/)
  })

  test('check fails closed when pass is not a boolean', async () => {
    expect((await judgeWith('{"pass": "yes"}').check('rule', 'material')).pass).toBe(false)
  })

  test('the judge asks for enough tokens, because some models spend tokens before they write', async () => {
    const llm = vi.fn(async () => '{"pass": true, "reason": "ok"}')
    await createJudge({ llm, model: 'm' }).check('rule', 'material')
    expect(llm.mock.calls[0][0].maxTokens).toBeGreaterThanOrEqual(1000)
  })

  test('a judge that answers with nothing is named in the reason', async () => {
    const result = await judgeWith('').check('rule', 'material')
    expect(result.pass).toBe(false)
    expect(result.reason).toMatch(/answered with nothing/i)
  })

  test('a judge that does not return JSON shows the start of its answer', async () => {
    const result = await judgeWith('I think it is fine because the tutor is kind').check('rule', 'material')
    expect(result.reason).toContain('I think it is fine')
  })

  test('check uses the judge model and sets no temperature', async () => {
    const llm = vi.fn(async () => '{"pass": true, "reason": "ok"}')
    await createJudge({ llm, model: 'judge-model' }).check('rule', 'material')
    expect(llm).toHaveBeenCalledWith(expect.objectContaining({ model: 'judge-model' }))
    expect(llm.mock.calls[0][0]).not.toHaveProperty('temperature')
  })
})
