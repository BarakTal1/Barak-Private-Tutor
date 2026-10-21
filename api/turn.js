import { HttpError, readCall, sendError } from '../server/http.js'
import { streamChat } from '../server/llm.js'
import { buildTurnMessages } from '../server/prompts.js'
import { MAX_STUDENT_CHARS } from '../shared/limits.js'

function readTurn(body) {
  const { plan, step, passages, progress, studentMessage, request } = body
  const valid =
    plan && step && typeof step.title === 'string' && typeof step.checkQuestion === 'string' &&
    Array.isArray(passages) && progress && Number.isInteger(progress.stepIndex) && Number.isInteger(progress.total)
  if (!valid) throw new HttpError(400, 'bad_request', 'The lesson state is incomplete.')
  if (studentMessage != null && typeof studentMessage !== 'string') {
    throw new HttpError(400, 'bad_request', 'The message must be text.')
  }
  if (studentMessage && studentMessage.length > MAX_STUDENT_CHARS) {
    throw new HttpError(400, 'bad_request', `The message is longer than ${MAX_STUDENT_CHARS} characters.`)
  }
  return {
    teacherPrompt: typeof body.teacherPrompt === 'string' ? body.teacherPrompt : '',
    plan,
    step,
    passages,
    progress: { attempts: 0, hintLevel: 0, ...progress },
    history: Array.isArray(body.history) ? body.history : [],
    studentMessage: studentMessage ?? null,
    request: request === 'hint' ? 'hint' : 'answer',
    forceExplain: body.forceExplain === true,
  }
}

export default async function handler(req, res) {
  let key
  let started = false
  try {
    if (req.method !== 'POST') throw new HttpError(405, 'bad_request', 'Use POST.')
    const call = readCall(req)
    key = call.key
    const messages = buildTurnMessages(readTurn(call.body))
    const controller = new AbortController()
    res.on('close', () => {
      if (!res.writableEnded) controller.abort()
    })
    const stream = streamChat({ key, provider: call.provider, messages, signal: controller.signal })[Symbol.asyncIterator]()
    // Read the first piece before the headers go out, so a provider error can still be sent as JSON.
    let piece = await stream.next()
    if (piece.done) throw new HttpError(502, 'provider_error', 'The model returned no text.')
    res.status(200)
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    started = true
    while (!piece.done) {
      res.write(piece.value)
      piece = await stream.next()
    }
    res.end()
  } catch (err) {
    if (started) return res.end()
    sendError(res, err, key)
  }
}
