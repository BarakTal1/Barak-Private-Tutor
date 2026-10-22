import { HttpError } from './http.js'

const API_KEY_ERROR = /api[ _-]?key|auth key/i
// How providers say that a model takes no images. Text-only models often say "content must be a string".
const IMAGE_ERROR = /image|vision|multimodal|modalit|must be a string/i

export function mapProviderError(status, bodyText) {
  if (status === 401 || status === 403) {
    return new HttpError(401, 'bad_key', 'The provider rejected the API key.')
  }
  if (status === 429) {
    return new HttpError(429, 'rate_limited', 'The provider says there are too many requests.')
  }
  // Gemini answers a wrong key with 400, not 401 ("API key not valid", or "Invalid Auth key" for keys that start with AQ).
  if (status === 400 && API_KEY_ERROR.test(bodyText)) {
    return new HttpError(401, 'bad_key', 'The provider rejected the API key.')
  }
  if (status === 413) return new HttpError(413, 'too_large', 'The request is too large for this model.')
  if ([400, 404, 415, 422].includes(status) && IMAGE_ERROR.test(bodyText)) {
    return new HttpError(422, 'no_vision', 'This model cannot read images.')
  }
  return new HttpError(502, 'provider_error', `The provider returned an error (${status}): ${providerReason(bodyText)}`)
}

// A short reason from the provider, so the user can tell a wrong model from a missing quota.
function providerReason(bodyText) {
  let reason = ''
  try {
    const data = JSON.parse(bodyText)
    const error = (Array.isArray(data) ? data[0] : data)?.error
    reason = typeof error === 'string' ? error : (error?.message ?? '')
  } catch {
    // The body is not JSON.
  }
  return (reason || String(bodyText)).replace(/\s+/g, ' ').trim().slice(0, 200)
}

// Keys that start with "AQ." (the new Google AI Studio keys) are rejected by the OpenAI-compatible
// endpoint of Gemini. So for Google the server talks to the native Gemini API.
const isGemini = (provider) => {
  try {
    return new URL(provider.baseUrl).hostname === 'generativelanguage.googleapis.com'
  } catch {
    return false
  }
}

function geminiPart(part) {
  if (typeof part === 'string') return { text: part }
  if (part.type === 'image_url') {
    const match = /^data:([^;,]+);base64,(.*)$/s.exec(part.image_url?.url ?? '')
    if (match) return { inlineData: { mimeType: match[1], data: match[2] } }
    return { text: '' }
  }
  return { text: part.text ?? '' }
}

export function toGeminiBody(messages) {
  const partsOf = (content) => (Array.isArray(content) ? content : [content]).map(geminiPart)
  const system = messages.filter((m) => m.role === 'system')
  const body = {
    contents: messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: partsOf(m.content) })),
  }
  if (system.length) body.systemInstruction = { parts: system.flatMap((m) => partsOf(m.content)) }
  return body
}

const geminiText = (data) =>
  (data?.candidates?.[0]?.content?.parts ?? []).map((part) => (typeof part.text === 'string' ? part.text : '')).join('')

function request({ key, provider, messages, stream }) {
  if (isGemini(provider)) {
    const base = provider.baseUrl.replace(/\/+$/, '').replace(/\/openai$/, '')
    const method = stream ? 'streamGenerateContent?alt=sse' : 'generateContent'
    return {
      url: `${base}/models/${encodeURIComponent(provider.model)}:${method}`,
      headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify(toGeminiBody(messages)),
    }
  }
  return {
    url: `${provider.baseUrl.replace(/\/+$/, '')}/chat/completions`,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: provider.model, messages, stream }),
  }
}

async function post({ key, provider, messages, stream, signal }) {
  const { url, headers, body } = request({ key, provider, messages, stream })
  let response
  try {
    response = await fetch(url, { method: 'POST', headers, body, signal })
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
  const text = isGemini(provider) ? geminiText(data) : data?.choices?.[0]?.message?.content
  if (typeof text !== 'string' || !text) {
    throw new HttpError(502, 'provider_error', 'The provider returned no text.')
  }
  return text
}

export async function* streamChat({ key, provider, messages, signal }) {
  const response = await post({ key, provider, messages, stream: true, signal })
  const readDelta = isGemini(provider) ? readGeminiDelta : readOpenAiDelta
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

function readOpenAiDelta(line) {
  if (!line.startsWith('data:')) return ''
  const payload = line.slice(5).trim()
  if (!payload || payload === '[DONE]') return ''
  let event
  try {
    event = JSON.parse(payload)
  } catch {
    return ''
  }
  // Some providers answer 200 and then send an error inside the stream.
  if (event.error) throw mapProviderError(Number(event.error.code) || 502, JSON.stringify(event.error))
  return event.choices?.[0]?.delta?.content ?? ''
}

function readGeminiDelta(line) {
  if (!line.startsWith('data:')) return ''
  let event
  try {
    event = JSON.parse(line.slice(5).trim())
  } catch {
    return ''
  }
  if (event.error) throw mapProviderError(Number(event.error.code) || 502, JSON.stringify(event.error))
  return geminiText(event)
}
