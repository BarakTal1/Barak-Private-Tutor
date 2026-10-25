import { createControlFilter } from '../../shared/control.js'

// Above this many characters the plan is built from the start of each passage only.
const COMPACT_THRESHOLD_CHARS = 60_000
const COMPACT_CHARS = 300

// `code` tells the UI which Hebrew text to show. It is a code of the server (bad_key,
// rate_limited, overloaded, no_vision, bad_request, too_large, provider_error) or timeout or network.
export class ApiClientError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'ApiClientError'
    this.code = code
  }
}

async function failureOf(response) {
  try {
    const { error } = await response.json()
    if (error?.code) return new ApiClientError(error.code, error.message)
  } catch {
    // The host can answer with a page that is not JSON.
  }
  const code = response.status === 413 ? 'too_large' : response.status === 504 ? 'timeout' : 'provider_error'
  return new ApiClientError(code, `The server answered ${response.status}.`)
}

// The key goes in a header, never in the URL or the body.
async function post(path, { settings, body, signal }) {
  const { baseUrl, model } = settings.provider
  let response
  try {
    response = await fetch(`/api/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-llm-key': settings.key },
      body: JSON.stringify({ provider: { baseUrl, model }, ...body }),
      signal,
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiClientError('network', 'The server cannot be reached.')
  }
  if (!response.ok) throw await failureOf(response)
  return response
}

export async function requestPlan({ settings, teacherPrompt, options, passages, signal }) {
  const size = passages.reduce((sum, passage) => sum + passage.text.length, 0)
  const compact = size > COMPACT_THRESHOLD_CHARS
  const body = {
    teacherPrompt,
    options,
    compact,
    passages: passages.map(({ id, label, text }) => ({ id, label, text: compact ? text.slice(0, COMPACT_CHARS) : text })),
  }
  const { plan } = await (await post('plan', { settings, body, signal })).json()
  if (!Array.isArray(plan?.steps)) throw new ApiClientError('provider_error', 'The server returned no lesson plan.')
  return plan
}

export async function transcribePages({ settings, pages, signal }) {
  const answer = await (await post('transcribe', { settings, body: { pages }, signal })).json()
  return answer.pages
}

// Streams one tutor turn. `onText` gets the new visible text, never the control line.
// Returns the control object, or null when there is none (or when the student pressed Stop).
export async function streamTurn({ settings, payload, signal, onText }) {
  const filter = createControlFilter()
  let shown = ''
  const show = (text) => {
    if (!text) return
    shown += text
    onText(text)
  }
  try {
    const response = await post('turn', { settings, body: payload, signal })
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      show(filter.push(decoder.decode(value, { stream: true })))
    }
    show(filter.push(decoder.decode()))
    const { visible, control } = filter.finish()
    show(visible.slice(shown.length))
    if (!visible.trim()) throw new ApiClientError('provider_error', 'The model returned no text.')
    return control
  } catch (err) {
    if (err.name === 'AbortError') return null
    if (err instanceof ApiClientError) throw err
    throw new ApiClientError('network', 'The connection was lost.')
  }
}
