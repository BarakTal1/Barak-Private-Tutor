export class HttpError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

const PRIVATE_IPV4 = [
  /^0\./,
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
]

function badRequest(message) {
  return new HttpError(400, 'bad_request', message)
}

// A custom base URL makes the server fetch it, so it must not reach private networks.
// Only on a developer machine (the dev server sets ALLOW_PRIVATE_PROVIDER=1) a local model server is allowed.
export function assertSafeBaseUrl(baseUrl) {
  let url
  try {
    url = new URL(baseUrl)
  } catch {
    throw badRequest('The provider address is not a valid URL.')
  }
  const host = url.hostname
  if (process.env.ALLOW_PRIVATE_PROVIDER === '1' && /^https?:$/.test(url.protocol) && !url.username && !url.password) {
    return url
  }
  const isIpv6 = host.startsWith('[')
  const isPrivate =
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    isIpv6 ||
    PRIVATE_IPV4.some((pattern) => pattern.test(host))
  if (url.protocol !== 'https:' || url.username || url.password || isPrivate) {
    throw badRequest('The provider address must be a public https address.')
  }
  return url
}

export function readCall(req) {
  const key = req.headers['x-llm-key']
  if (!key) throw badRequest('Add your API key in the settings.')
  const body = req.body ?? {}
  const { baseUrl, model } = body.provider ?? {}
  if (typeof baseUrl !== 'string' || typeof model !== 'string' || !model.trim()) {
    throw badRequest('Choose a provider and a model in the settings.')
  }
  assertSafeBaseUrl(baseUrl)
  return { key, provider: { baseUrl, model }, body }
}

export function sendError(res, err, key) {
  const known = err instanceof HttpError
  const status = known ? err.status : 500
  const code = known ? err.code : 'provider_error'
  let message = known ? err.message : 'Something went wrong. Try again.'
  if (key) message = message.split(key).join('[key]')
  res.status(status).json({ error: { code, message } })
}
