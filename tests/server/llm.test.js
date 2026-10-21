import { complete, mapProviderError, streamChat } from '../../server/llm.js'

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
    [500, 'boom', 'provider_error'],
  ])('maps status %s to %s', (status, body, code) => {
    expect(mapProviderError(status, body).code).toBe(code)
  })

  test('never copies the provider body into the message', () => {
    expect(mapProviderError(500, 'secret-body-text').message).not.toContain('secret-body-text')
  })
})
