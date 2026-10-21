export const provider = { baseUrl: 'https://api.example.com/v1', model: 'model-x' }

export function fakeReq(body, { key = 'test-key', method = 'POST' } = {}) {
  return { method, headers: key ? { 'x-llm-key': key } : {}, body }
}

export function fakeRes() {
  const res = { statusCode: 200, payload: null, headers: {}, chunks: [], ended: false }
  res.status = (code) => {
    res.statusCode = code
    return res
  }
  res.json = (payload) => {
    res.payload = payload
    res.ended = true
    return res
  }
  res.setHeader = (name, value) => {
    res.headers[name.toLowerCase()] = value
  }
  res.write = (chunk) => {
    res.chunks.push(chunk)
    return true
  }
  res.end = (chunk) => {
    if (chunk) res.chunks.push(chunk)
    res.ended = true
  }
  res.on = () => res
  Object.defineProperty(res, 'text', { get: () => res.chunks.join('') })
  return res
}
