import { HttpError, assertSafeBaseUrl, readCall, sendError } from '../../server/http.js'

const goodBody = {
  provider: { baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b' },
}

function fakeRes() {
  const res = { statusCode: null, payload: null }
  res.status = (code) => {
    res.statusCode = code
    return res
  }
  res.json = (payload) => {
    res.payload = payload
    return res
  }
  return res
}

describe('readCall', () => {
  test('throws bad_request without x-llm-key', () => {
    expect(() => readCall({ headers: {}, body: goodBody })).toThrow(HttpError)
    try {
      readCall({ headers: {}, body: goodBody })
    } catch (err) {
      expect(err.code).toBe('bad_request')
      expect(err.status).toBe(400)
    }
  })

  test('returns key, provider and body for a valid call', () => {
    const call = readCall({ headers: { 'x-llm-key': 'secret' }, body: goodBody })
    expect(call.key).toBe('secret')
    expect(call.provider).toEqual(goodBody.provider)
    expect(call.body).toBe(goodBody)
  })

  test('refuses a provider without a model', () => {
    const body = { provider: { baseUrl: goodBody.provider.baseUrl } }
    expect(() => readCall({ headers: { 'x-llm-key': 'k' }, body })).toThrow(HttpError)
  })

  test('refuses an unsafe base url', () => {
    const body = { provider: { baseUrl: 'http://localhost:11434/v1', model: 'm' } }
    expect(() => readCall({ headers: { 'x-llm-key': 'k' }, body })).toThrow(HttpError)
  })
})

describe('sendError', () => {
  test('never includes the key', () => {
    const res = fakeRes()
    sendError(res, new HttpError(401, 'bad_key', 'rejected key sk-123 here'), 'sk-123')
    expect(res.statusCode).toBe(401)
    expect(JSON.stringify(res.payload)).not.toContain('sk-123')
    expect(res.payload.error.code).toBe('bad_key')
  })

  test('hides the message of an unknown error', () => {
    const res = fakeRes()
    sendError(res, new Error('database password is hunter2'), 'k')
    expect(res.statusCode).toBe(500)
    expect(res.payload.error.code).toBe('provider_error')
    expect(JSON.stringify(res.payload)).not.toContain('hunter2')
  })
})

describe('assertSafeBaseUrl', () => {
  test.each([
    'http://localhost:3000/v1',
    'https://localhost/v1',
    'http://169.254.169.254/latest',
    'https://169.254.169.254/latest',
    'https://10.0.0.5/v1',
    'https://192.168.1.1/v1',
    'https://172.16.0.1/v1',
    'https://127.0.0.1/v1',
    'https://2130706433/v1',
    'https://[::1]/v1',
    'https://printer.local/v1',
    'ftp://example.com/v1',
    'https://user:pass@api.groq.com/v1',
    'not a url',
  ])('refuses %s', (url) => {
    expect(() => assertSafeBaseUrl(url)).toThrow(HttpError)
  })

  test('accepts https://api.groq.com/openai/v1', () => {
    expect(assertSafeBaseUrl('https://api.groq.com/openai/v1').hostname).toBe('api.groq.com')
  })
})
