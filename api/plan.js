import { HttpError, readCall, sendError } from '../server/http.js'
import { complete } from '../server/llm.js'
import { buildPlanMessages } from '../server/prompts.js'
import { normalizeOptions } from '../shared/options.js'
import { parsePlanJson, repairPassageIds, validatePlan } from '../shared/plan.js'

const ATTEMPTS = 2

function readPassages(value) {
  const valid =
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((p) => p && typeof p.id === 'string' && typeof p.text === 'string')
  if (!valid) throw new HttpError(400, 'bad_request', 'The lesson needs at least one passage of text.')
  return value.map((p) => ({ id: p.id, label: typeof p.label === 'string' ? p.label : '', text: p.text }))
}

async function buildPlan({ key, provider, teacherPrompt, options, passages, compact }) {
  const knownIds = new Set(passages.map((p) => p.id))
  const messages = buildPlanMessages({ teacherPrompt, options, passages, compact })
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    const answer = await complete({ key, provider, messages })
    let problem
    try {
      const { plan, errors } = validatePlan(parsePlanJson(answer), knownIds)
      if (plan) return repairPassageIds(plan, passages)
      problem = errors.join(' ')
    } catch {
      problem = 'The answer was not valid JSON.'
    }
    messages.push(
      { role: 'assistant', content: answer },
      { role: 'user', content: `That plan was not usable: ${problem} Answer again with the JSON only.` },
    )
  }
  throw new HttpError(502, 'provider_error', 'The AI did not return a usable lesson plan. Try again or choose another model.')
}

export default async function handler(req, res) {
  let key
  try {
    if (req.method !== 'POST') throw new HttpError(405, 'bad_request', 'Use POST.')
    const call = readCall(req)
    key = call.key
    const { teacherPrompt, options, passages, compact } = call.body
    const plan = await buildPlan({
      key,
      provider: call.provider,
      teacherPrompt: typeof teacherPrompt === 'string' ? teacherPrompt : '',
      // A request with no options (an old client) keeps the old behavior. Options that are not valid become defaults.
      options: options === undefined ? undefined : normalizeOptions(options),
      passages: readPassages(passages),
      compact: compact === true,
    })
    res.status(200).json({ plan })
  } catch (err) {
    sendError(res, err, key)
  }
}
