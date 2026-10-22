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
  if (status === 503) {
    return new HttpError(503, 'overloaded', 'The model is busy. Try again in a moment or choose another model.')
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

// Gemini 3 models think before they answer, which adds seconds. A tutor reply needs little thinking.
const usesThinkingLevel = (provider) => /^gemini-3/.test(provider.model)

function request({ key, provider, messages, stream, thinking = true }) {
  if (isGemini(provider)) {
    const base = provider.baseUrl.replace(/\/+$/, '').replace(/\/openai$/, '')
    const method = stream ? 'streamGenerateContent?alt=sse' : 'generateContent'
    return {
      url: `${base}/models/${encodeURIComponent(provider.model)}:${method}`,
      headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...toGeminiBody(messages),
        ...(thinking && usesThinkingLevel(provider) ? { generationConfig: { thinkingConfig: { thinkingLevel: 'low' } } } : {}),
      }),
    }
  }
  return {
    url: `${provider.baseUrl.replace(/\/+$/, '')}/chat/completions`,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: provider.model, messages, stream }),
  }
}

// A busy model often answers again after a short wait. These statuses are tried again.
const RETRY_STATUSES = [429, 500, 502, 503, 504]
export const retryPolicy = { delaysMs: [1000, 2500], maxRetryAfterMs: 5000 }

const wait = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }))
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }))
    })
    return undefined
  })

function retryDelay(response, attempt) {
  const asked = Number(response?.headers?.get('retry-after')) * 1000
  const base = retryPolicy.delaysMs[attempt]
  return Number.isFinite(asked) && asked > 0 ? Math.min(asked, retryPolicy.maxRetryAfterMs) : base
}

async function post({ key, provider, messages, stream, signal }) {
  let thinking = true
  for (let attempt = 0; ; attempt++) {
    const { url, headers, body } = request({ key, provider, messages, stream, thinking })
    const canRetry = attempt < retryPolicy.delaysMs.length
    let response
    try {
      response = await fetch(url, { method: 'POST', headers, body, signal })
    } catch (err) {
      if (err.name === 'AbortError') throw err
      if (!canRetry) throw new HttpError(502, 'provider_error', 'Could not reach the provider.')
      await wait(retryPolicy.delaysMs[attempt], signal)
      continue
    }
    if (response.ok) return response
    const text = await response.text()
    // A model that does not know the thinking setting is asked again without it.
    if (thinking && isGemini(provider) && response.status === 400 && /thinking/i.test(text)) {
      thinking = false
      attempt--
      continue
    }
    if (canRetry && RETRY_STATUSES.includes(response.status)) {
      await wait(retryDelay(response, attempt), signal)
      continue
    }
    throw mapProviderError(response.status, text)
  }
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
