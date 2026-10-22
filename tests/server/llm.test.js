import { complete, mapProviderError, streamChat, toGeminiBody } from '../../server/llm.js'

const provider = { baseUrl: 'https://api.example.com/v1/', model: 'model-x' }
const messages = [{ role: 'user', content: 'Hello' }]

function sseResponse(chunks, init = { status: 200 }) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk))
      controller.close()
    },
  })
  return new Response(stream, init)
}

async function collect(iterator) {
  const parts = []
  for await (const part of iterator) parts.push(part)
  return parts
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('streamChat', () => {
  test('yields deltas from an SSE stream split in the middle of a line', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        sseResponse([
          'data: {"choices":[{"delta":{"content":"Hel"}}]}\n\ndata: {"choi',
          'ces":[{"delta":{"content":"lo"}}]}\n\n',
          'data: {"choices":[{"delta":{}}]}\n\ndata: [DONE]\n\n',
        ]),
      ),
    )
    const deltas = await collect(streamChat({ key: 'k', provider, messages }))
    expect(deltas).toEqual(['Hel', 'lo'])
  })

  test('posts to the chat completions url with the key and the model', async () => {
    const fetchMock = vi.fn(async () => sseResponse(['data: [DONE]\n\n']))
    vi.stubGlobal('fetch', fetchMock)
    await collect(streamChat({ key: 'secret-key', provider, messages }))
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.example.com/v1/chat/completions')
    expect(init.headers.Authorization).toBe('Bearer secret-key')
    expect(JSON.parse(init.body)).toMatchObject({ model: 'model-x', stream: true, messages })
  })

  test('an error event inside a stream throws instead of being skipped', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => sseResponse(['data: {"error":{"code":429,"message":"quota"}}\n\n'])),
    )
    await expect(collect(streamChat({ key: 'k', provider, messages }))).rejects.toMatchObject({ code: 'rate_limited' })
  })

  test('an error event with another code is a provider_error', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => sseResponse(['data: {"error":{"message":"overloaded"}}\n\n'])))
    await expect(collect(streamChat({ key: 'k', provider, messages }))).rejects.toMatchObject({ code: 'provider_error' })
  })

  test('throws a mapped error when the provider answers 401', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{"error":"bad"}', { status: 401 })))
    await expect(collect(streamChat({ key: 'k', provider, messages }))).rejects.toMatchObject({
      code: 'bad_key',
    })
  })

  test('throws provider_error when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('fetch failed') }))
    await expect(collect(streamChat({ key: 'k', provider, messages }))).rejects.toMatchObject({
      code: 'provider_error',
    })
  })

  test('no console output and no error message contains the key', async () => {
    const spies = ['log', 'info', 'warn', 'error', 'debug'].map((name) =>
      vi.spyOn(console, name).mockImplementation(() => {}),
    )
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('invalid key sk-top-secret', { status: 401 })),
    )
    let thrown
    try {
      await collect(streamChat({ key: 'sk-top-secret', provider, messages }))
    } catch (err) {
      thrown = err
    }
    expect(thrown.message).not.toContain('sk-top-secret')
    for (const spy of spies) {
      expect(JSON.stringify(spy.mock.calls)).not.toContain('sk-top-secret')
    }
  })
})

describe('complete', () => {
  test('returns the text of the first choice', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ choices: [{ message: { content: 'Hi there' } }] })),
    )
    await expect(complete({ key: 'k', provider, messages })).resolves.toBe('Hi there')
  })

  test('throws provider_error when the answer has no text', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ choices: [] })))
    await expect(complete({ key: 'k', provider, messages })).rejects.toMatchObject({
      code: 'provider_error',
    })
  })
})

describe('mapProviderError', () => {
  test.each([
    [401, 'x', 'bad_key'],
    [403, 'x', 'bad_key'],
    [429, 'x', 'rate_limited'],
    [400, 'This model does not support image input', 'no_vision'],
    [404, 'No endpoints found that support image input', 'no_vision'],
    [400, 'messages[1].content must be a string', 'no_vision'],
    [400, 'API key not valid. Please pass a valid API key.', 'bad_key'],
    [400, '{"error":{"status":"INVALID_ARGUMENT","details":[{"reason":"API_KEY_INVALID"}]}}', 'bad_key'],
    [400, '[{"error":{"code":400,"message":"Invalid Auth key.","status":"INVALID_ARGUMENT"}}]', 'bad_key'],
    [413, 'Request too large for model', 'too_large'],
    [500, 'boom', 'provider_error'],
  ])('maps status %s to %s', (status, body, code) => {
    expect(mapProviderError(status, body).code).toBe(code)
  })

  test('never copies the provider body into the message', () => {
    expect(mapProviderError(500, 'secret-body-text').message).not.toContain('secret-body-text')
  })
})

describe('Gemini native API', () => {
  const gemini = { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.5-flash' }

  test('sends the key in x-goog-api-key to the native endpoint', async () => {
    const fetchMock = vi.fn(async () => Response.json({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }))
    vi.stubGlobal('fetch', fetchMock)
    expect(await complete({ key: 'AQ.abc', provider: gemini, messages })).toBe('ok')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent')
    expect(init.headers['x-goog-api-key']).toBe('AQ.abc')
    expect(init.headers.Authorization).toBeUndefined()
  })

  test('streams text from the native SSE format', async () => {
    const fetchMock = vi.fn(async () =>
      sseResponse([
        'data: {"candidates":[{"content":{"parts":[{"text":"Hel"}]}}]}\n\n',
        'data: {"candidates":[{"content":{"parts":[{"text":"lo"}]}}]}\n\n',
      ]),
    )
    vi.stubGlobal('fetch', fetchMock)
    expect(await collect(streamChat({ key: 'k', provider: gemini, messages }))).toEqual(['Hel', 'lo'])
    expect(fetchMock.mock.calls[0][0]).toContain(':streamGenerateContent?alt=sse')
  })

  test('converts system, assistant and image messages', () => {
    const body = toGeminiBody([
      { role: 'system', content: 'Be kind' },
      { role: 'user', content: [{ type: 'text', text: 'Read' }, { type: 'image_url', image_url: { url: 'data:image/jpeg;base64,AAA' } }] },
      { role: 'assistant', content: 'Done' },
    ])
    expect(body.systemInstruction).toEqual({ parts: [{ text: 'Be kind' }] })
    expect(body.contents).toEqual([
      { role: 'user', parts: [{ text: 'Read' }, { inlineData: { mimeType: 'image/jpeg', data: 'AAA' } }] },
      { role: 'model', parts: [{ text: 'Done' }] },
    ])
  })

  test('other providers keep the Bearer header', async () => {
    const fetchMock = vi.fn(async () => Response.json({ choices: [{ message: { content: 'ok' } }] }))
    vi.stubGlobal('fetch', fetchMock)
    await complete({ key: 'k', provider, messages })
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer k')
  })
})
