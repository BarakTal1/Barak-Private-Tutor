import { HttpError } from './http.js'

const IMAGE_ERROR = /image|vision|multimodal|modalit/i

export function mapProviderError(status, bodyText) {
  if (status === 401 || status === 403) {
    return new HttpError(401, 'bad_key', 'The provider rejected the API key.')
  }
  if (status === 429) {
    return new HttpError(429, 'rate_limited', 'The provider says there are too many requests.')
  }
  if ([400, 404, 415, 422].includes(status) && IMAGE_ERROR.test(bodyText)) {
    return new HttpError(422, 'no_vision', 'This model cannot read images.')
  }
  return new HttpError(502, 'provider_error', 'The provider returned an error.')
}

async function post({ key, provider, messages, stream, signal }) {
  const url = `${provider.baseUrl.replace(/\/+$/, '')}/chat/completions`
  let response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: provider.model, messages, stream }),
      signal,
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new HttpError(502, 'provider_error', 'Could not reach the provider.')
  }
  if (!response.ok) throw mapProviderError(response.status, await response.text())
  return response
}

export async function complete({ key, provider, messages, signal }) {
  const response = await post({ key, provider, messages, stream: false, signal })
  const data = await response.json()
  const text = data?.choices?.[0]?.message?.content
  if (typeof text !== 'string' || !text) {
    throw new HttpError(502, 'provider_error', 'The provider returned no text.')
  }
  return text
}

export async function* streamChat({ key, provider, messages, signal }) {
  const response = await post({ key, provider, messages, stream: true, signal })
  const decoder = new TextDecoder()
  let buffer = ''
  for await (const chunk of response.body) {
    buffer += decoder.decode(chunk, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop()
    for (const line of lines) {
      const delta = readDelta(line)
      if (delta) yield delta
    }
  }
  const last = readDelta(buffer)
  if (last) yield last
}

function readDelta(line) {
  if (!line.startsWith('data:')) return ''
  const payload = line.slice(5).trim()
  if (!payload || payload === '[DONE]') return ''
  try {
    return JSON.parse(payload).choices?.[0]?.delta?.content ?? ''
  } catch {
    return ''
  }
}
