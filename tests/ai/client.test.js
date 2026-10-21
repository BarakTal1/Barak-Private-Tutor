import { ApiClientError, requestPlan, streamTurn, transcribePages } from '../../src/ai/client.js'

const settings = {
  providerId: 'groq',
  provider: { baseUrl: 'https://api.example.com/v1', model: 'model-x', vision: true },
  key: 'secret-key-123',
  rememberKey: false,
}
const plan = { title: 'T', language: 'English', audience: '', estimatedMinutes: 2, steps: [{ id: 's1' }] }

function streamResponse(chunks, { signal } = {}) {
  const encoder = new TextEncoder()
  return new Response(
    new ReadableStream({
      async start(controller) {
        signal?.addEventListener('abort', () => controller.error(new DOMException('aborted', 'AbortError')))
        for (const chunk of chunks) controller.enqueue(encoder.encode(chunk))
        if (!signal) controller.close()
      },
    }),
    { status: 200, headers: { 'Content-Type': 'text/plain' } },
  )
}

const stubFetch = (impl) => {
  const mock = vi.fn(impl)
  vi.stubGlobal('fetch', mock)
  return mock
}
const jsonResponse = (body, status = 200) => Response.json(body, { status })

afterEach(() => vi.unstubAllGlobals())

describe('requests', () => {
  test('every call sends the key in x-llm-key and never in the body or the URL', async () => {
    const fetchMock = stubFetch(async (url) =>
      url.endsWith('/plan')
        ? jsonResponse({ plan })
        : url.endsWith('/transcribe')
          ? jsonResponse({ pages: [] })
          : streamResponse(['Hi']),
    )
    await requestPlan({ settings, teacherPrompt: 'p', passages: [{ id: 'p1', label: 'L', text: 'T' }] })
    await transcribePages({ settings, pages: [{ page: 1, image: 'data:image/jpeg;base64,AA' }] })
    await streamTurn({ settings, payload: { step: {} }, onText: () => {} })
    expect(fetchMock).toHaveBeenCalledTimes(3)
    for (const [url, init] of fetchMock.mock.calls) {
      expect(url).not.toContain('secret-key-123')
      expect(init.headers['x-llm-key']).toBe('secret-key-123')
      expect(init.body).not.toContain('secret-key-123')
      expect(JSON.parse(init.body).provider).toEqual({ baseUrl: 'https://api.example.com/v1', model: 'model-x' })
    }
  })

  test('requestPlan returns the plan and sends the teacher prompt and the passages', async () => {
    const fetchMock = stubFetch(async () => jsonResponse({ plan }))
    const passages = [{ id: 'p1', label: 'Page 1', text: 'Some text', page: 1, source: 'text' }]
    await expect(requestPlan({ settings, teacherPrompt: 'Be kind', passages })).resolves.toEqual(plan)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/plan')
    expect(JSON.parse(init.body)).toMatchObject({
      teacherPrompt: 'Be kind',
      passages: [{ id: 'p1', label: 'Page 1', text: 'Some text' }],
      compact: false,
    })
  })

  test('requestPlan sends only the start of each passage when the file is large', async () => {
    const fetchMock = stubFetch(async () => jsonResponse({ plan }))
    const passages = Array.from({ length: 30 }, (_, i) => ({ id: `p${i}`, label: `L${i}`, text: 'x'.repeat(3000) }))
    await requestPlan({ settings, teacherPrompt: '', passages })
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.compact).toBe(true)
    expect(body.passages[0].text).toHaveLength(300)
  })

  test('requestPlan rejects an answer that is not a plan', async () => {
    stubFetch(async () => jsonResponse({ plan: { steps: 'nope' } }))
    await expect(requestPlan({ settings, teacherPrompt: '', passages: [{ id: 'p1', label: '', text: 't' }] })).rejects.toMatchObject({
      code: 'provider_error',
    })
  })

  test('transcribePages returns the pages of the answer', async () => {
    stubFetch(async () => jsonResponse({ pages: [{ page: 1, text: 'Hello' }] }))
    await expect(transcribePages({ settings, pages: [{ page: 1, image: 'data:image/jpeg;base64,AA' }] })).resolves.toEqual([
      { page: 1, text: 'Hello' },
    ])
  })
})

describe('errors', () => {
  test.each([
    [429, { error: { code: 'rate_limited', message: 'Slow down' } }, 'rate_limited'],
    [401, { error: { code: 'bad_key', message: 'No' } }, 'bad_key'],
    [422, { error: { code: 'no_vision', message: 'No images' } }, 'no_vision'],
  ])('a %s answer becomes ApiClientError with code %s', async (status, body, code) => {
    stubFetch(async () => jsonResponse(body, status))
    const error = await transcribePages({ settings, pages: [] }).catch((err) => err)
    expect(error).toBeInstanceOf(ApiClientError)
    expect(error.code).toBe(code)
    expect(error.message).toBe(body.error.message)
  })

  test('a network failure becomes code network', async () => {
    stubFetch(async () => {
      throw new TypeError('Failed to fetch')
    })
    await expect(transcribePages({ settings, pages: [] })).rejects.toMatchObject({ code: 'network' })
  })

  test.each([
    [413, 'too_large'],
    [504, 'timeout'],
    [500, 'provider_error'],
  ])('a %s answer that is not JSON becomes code %s', async (status, code) => {
    stubFetch(async () => new Response('<html>Gateway Timeout</html>', { status }))
    await expect(transcribePages({ settings, pages: [] })).rejects.toMatchObject({ code })
  })

  test('a turn that fails before the first byte rejects with the code of the server', async () => {
    stubFetch(async () => jsonResponse({ error: { code: 'bad_key', message: 'No' } }, 401))
    await expect(streamTurn({ settings, payload: {}, onText: () => {} })).rejects.toMatchObject({ code: 'bad_key' })
  })
})

describe('streamTurn', () => {
  test('onText gets deltas that never contain the control marker, and the control object is returned', async () => {
    stubFetch(async () => streamResponse(['Hel', 'lo <<ST', 'ATE {"verdict":"correct",', '"advance":true}>>']))
    const shown = []
    const control = await streamTurn({ settings, payload: {}, onText: (text) => shown.push(text) })
    expect(shown.join('')).toBe('Hello')
    expect(control).toEqual({ verdict: 'correct', advance: true })
  })

  test('a held back end of text is shown when the stream ends', async () => {
    stubFetch(async () => streamResponse(['if a <']))
    const shown = []
    const control = await streamTurn({ settings, payload: {}, onText: (text) => shown.push(text) })
    expect(shown.join('')).toBe('if a <')
    expect(control).toBeNull()
  })

  test('returns null when the stream has no control line', async () => {
    stubFetch(async () => streamResponse(['Just text.']))
    await expect(streamTurn({ settings, payload: {}, onText: () => {} })).resolves.toBeNull()
  })

  test('aborting stops the stream and returns null with the text already shown', async () => {
    const controller = new AbortController()
    stubFetch(async (url, init) => streamResponse(['Hello'], { signal: init.signal }))
    const shown = []
    const done = streamTurn({
      settings,
      payload: {},
      signal: controller.signal,
      onText: (text) => {
        shown.push(text)
        controller.abort()
      },
    })
    await expect(done).resolves.toBeNull()
    expect(shown.join('')).toBe('Hello')
  })

  test('aborting before the answer starts returns null', async () => {
    const controller = new AbortController()
    stubFetch(async (url, init) => {
      controller.abort()
      throw new DOMException('aborted', 'AbortError')
    })
    await expect(streamTurn({ settings, payload: {}, signal: controller.signal, onText: () => {} })).resolves.toBeNull()
  })

  test('sends the payload of the turn', async () => {
    const fetchMock = stubFetch(async () => streamResponse(['x']))
    await streamTurn({ settings, payload: { studentMessage: 'three', request: 'answer' }, onText: () => {} })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/turn')
    expect(JSON.parse(init.body)).toMatchObject({ studentMessage: 'three', request: 'answer' })
  })
})
