// @vitest-environment node
import { checkModel, keysFromEnv, listModelIds, openRouterVisionProblems } from '../../scripts/provider-checks.mjs'

describe('keysFromEnv', () => {
  test('takes the keys that are set, trimmed, and ignores empty ones', () => {
    expect(keysFromEnv({ GROQ_KEY: ' g-key ', OPENROUTER_KEY: '', ANTHROPIC_KEY: 'a-key', OTHER: 'x' })).toEqual({ groq: 'g-key', anthropic: 'a-key' })
  })

  test('gives an empty object when no key is set', () => {
    expect(keysFromEnv({})).toEqual({})
  })
})

describe('listModelIds', () => {
  const ok = (body) => ({ ok: true, json: async () => body })

  test('Anthropic: x-api-key header, the version header and a big limit', async () => {
    const fetch = vi.fn(async () => ok({ data: [{ id: 'claude-haiku-5-5' }, { id: 'claude-opus-5-5' }] }))
    const ids = await listModelIds({ providerId: 'anthropic', baseUrl: 'https://api.anthropic.com/v1', key: 'k1', fetch })
    expect(ids).toEqual(['claude-haiku-5-5', 'claude-opus-5-5'])
    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe('https://api.anthropic.com/v1/models?limit=1000')
    expect(init.headers['x-api-key']).toBe('k1')
    expect(init.headers['anthropic-version']).toBeTruthy()
  })

  test.each([
    ['openai', 'https://api.openai.com/v1'],
    ['groq', 'https://api.groq.com/openai/v1'],
    ['openrouter', 'https://openrouter.ai/api/v1'],
  ])('%s: a Bearer key on /models', async (providerId, baseUrl) => {
    const fetch = vi.fn(async () => ok({ data: [{ id: 'm1' }, { id: 'm2' }] }))
    await expect(listModelIds({ providerId, baseUrl, key: 'k2', fetch })).resolves.toEqual(['m1', 'm2'])
    expect(fetch.mock.calls[0][0]).toBe(`${baseUrl}/models`)
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer k2')
  })

  test('Gemini: the native list, the key in a header, and the "models/" prefix removed', async () => {
    const fetch = vi.fn(async () => ok({ models: [{ name: 'models/gemini-3.8-flash' }, { name: 'models/gemini-4-argon' }] }))
    const ids = await listModelIds({ providerId: 'gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', key: 'k3', fetch })
    expect(ids).toEqual(['gemini-3.8-flash', 'gemini-4-argon'])
    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000')
    expect(init.headers['x-goog-api-key']).toBe('k3')
  })

  test('an error names the status and never the key', async () => {
    const fetch = vi.fn(async () => ({ ok: false, status: 401, text: async () => 'bad key secret-key' }))
    const error = await listModelIds({ providerId: 'groq', baseUrl: 'https://api.groq.com/openai/v1', key: 'secret-key', fetch }).catch((err) => err)
    expect(error.message).toContain('401')
    expect(error.message).not.toContain('secret-key')
  })
})

describe('openRouterVisionProblems', () => {
  const list = {
    data: [
      { id: 'google/gemma-4-31b-it:free', architecture: { input_modalities: ['text', 'image'] } },
      { id: 'nvidia/nemotron-3-super-120b-a12b:free', architecture: { input_modalities: ['text'] } },
    ],
  }

  test('no problem when the ids exist and the vision flags match', () => {
    const models = [
      { id: 'google/gemma-4-31b-it:free', vision: true },
      { id: 'nvidia/nemotron-3-super-120b-a12b:free', vision: false },
    ]
    expect(openRouterVisionProblems(models, list)).toEqual([])
  })

  test('a missing id is a problem', () => {
    expect(openRouterVisionProblems([{ id: 'gone/model:free', vision: false }], list)[0]).toMatch(/gone\/model:free.*not in the list/)
  })

  test('a vision flag that the list does not support is a problem', () => {
    expect(openRouterVisionProblems([{ id: 'nvidia/nemotron-3-super-120b-a12b:free', vision: true }], list)[0]).toMatch(/nemotron.*no image/i)
  })
})

describe('checkModel', () => {
  const control = '\n<<STATE {"verdict": "partial", "advance": false}>>'
  const goodPlan = JSON.stringify({
    title: 'T', language: 'English', audience: '7th grade', difficulty: 'medium', estimatedMinutes: 5,
    steps: [{ id: 's1', title: 'A', goal: 'g', passageIds: ['p1'], checkQuestion: 'q?', keyPoints: ['k'] }],
  })
  const scan = 'משולש הוא צורה עם שלוש צלעות. סכום הזוויות הוא מאה ושמונים מעלות. זווית ישרה היא תשעים מעלות. הצלע הארוכה נקראת יתר.'
  const stream = (text) =>
    async function* gen() {
      for (const piece of text.match(/.{1,7}/gs) ?? []) yield piece
    }

  function deps(overrides = {}) {
    return {
      complete: vi.fn(async ({ messages }) => {
        const text = JSON.stringify(messages)
        if (/lesson designer/.test(text)) return goodPlan
        if (/read one page/i.test(text)) return scan
        return 'ok'
      }),
      streamChat: vi.fn(() => stream(`Let us start. What do you think?${control}`)()),
      buildTurnMessages: () => [{ role: 'user', content: 'turn' }],
      buildPlanMessages: () => [{ role: 'system', content: 'You are a lesson designer.' }, { role: 'user', content: 'plan' }],
      buildTranscribeMessages: () => [{ role: 'system', content: 'You read one page of school material.' }],
      ...overrides,
    }
  }

  const base = { provider: { baseUrl: 'https://x/v1', model: 'm', vision: false }, key: 'secret-key', image: 'data:image/jpeg;base64,AA', listed: true }
  const byName = (results) => Object.fromEntries(results.map((r) => [r.check, r]))

  test('a good model passes the 4 checks, and a model without vision has no vision check', async () => {
    const results = await checkModel({ ...base, deps: deps() })
    expect(results.map((r) => r.check)).toEqual(['listed', 'answers', 'tutor turn', 'lesson plan'])
    expect(results.every((r) => r.ok)).toBe(true)
  })

  test('a model with vision gets a scan check, and passes it with enough Hebrew words', async () => {
    const results = await checkModel({ ...base, provider: { ...base.provider, vision: true }, deps: deps() })
    expect(byName(results)['scanned page'].ok).toBe(true)
  })

  test('a scan with too few known words fails', async () => {
    const d = deps({ complete: vi.fn(async ({ messages }) => (/read one page/i.test(JSON.stringify(messages)) ? 'hello' : /lesson designer/.test(JSON.stringify(messages)) ? goodPlan : 'ok')) })
    const results = await checkModel({ ...base, provider: { ...base.provider, vision: true }, deps: d })
    expect(byName(results)['scanned page'].ok).toBe(false)
  })

  test('a model that is not in the list of the provider fails the listed check', async () => {
    const results = await checkModel({ ...base, listed: false, deps: deps() })
    expect(byName(results).listed.ok).toBe(false)
  })

  test('a listing that was not possible is reported as skipped, not as a failure', async () => {
    const results = await checkModel({ ...base, listed: null, deps: deps() })
    expect(byName(results).listed).toMatchObject({ ok: true, detail: expect.stringMatching(/skipped/i) })
  })

  test('an empty answer fails the answers check', async () => {
    const d = deps({ complete: vi.fn(async ({ messages }) => (/lesson designer/.test(JSON.stringify(messages)) ? goodPlan : '')) })
    expect(byName(await checkModel({ ...base, deps: d })).answers.ok).toBe(false)
  })

  test('a tutor turn without a control line fails', async () => {
    const d = deps({ streamChat: vi.fn(() => stream('Let us start. What do you think?')()) })
    const result = byName(await checkModel({ ...base, deps: d }))['tutor turn']
    expect(result.ok).toBe(false)
    expect(result.detail).toMatch(/no control line/i)
  })

  test('a lesson plan that is not valid JSON fails', async () => {
    const d = deps({ complete: vi.fn(async ({ messages }) => (/lesson designer/.test(JSON.stringify(messages)) ? 'Sure! Here is a plan.' : 'ok')) })
    expect(byName(await checkModel({ ...base, deps: d }))['lesson plan'].ok).toBe(false)
  })

  test('an error of the provider fails only its own check, with the message, and never shows the key', async () => {
    const d = deps({
      complete: vi.fn(async ({ messages }) => {
        if (/lesson designer/.test(JSON.stringify(messages))) throw new Error('The provider returned an error (429): too many requests')
        return 'ok'
      }),
    })
    const results = byName(await checkModel({ ...base, deps: d }))
    expect(results['lesson plan'].ok).toBe(false)
    expect(results['lesson plan'].detail).toContain('429')
    expect(results.answers.ok).toBe(true)
    expect(JSON.stringify(results)).not.toContain('secret-key')
  })

  test('every result has the time that the check took', async () => {
    for (const result of await checkModel({ ...base, deps: deps() })) expect(typeof result.ms).toBe('number')
  })
})
