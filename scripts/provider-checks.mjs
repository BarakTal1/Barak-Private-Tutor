// Checks of an AI provider and of one of its models, through the same server code that the app uses.
// The CLI is scripts/check-providers.mjs. The functions here take their dependencies as arguments, so tests can fake them.
import { hebrewWordsFound } from '../eval/checks.mjs'
import { createControlFilter } from '../shared/control.js'
import { parsePlanJson, validatePlan } from '../shared/plan.js'

// The environment variable of the key of each provider.
export const KEY_ENV = {
  anthropic: 'ANTHROPIC_KEY',
  openai: 'OPENAI_KEY',
  gemini: 'GEMINI_KEY',
  groq: 'GROQ_KEY',
  openrouter: 'OPENROUTER_KEY',
}

export function keysFromEnv(env) {
  return Object.fromEntries(
    Object.entries(KEY_ENV)
      .map(([providerId, name]) => [providerId, String(env[name] ?? '').trim()])
      .filter(([, key]) => key),
  )
}

const withoutKey = (text, key) => (key ? String(text).split(key).join('[key]') : String(text))

// The model IDs that the provider lists for this key. A model that is not in the list, or that the account cannot use,
// makes a request fail, so this is the most direct check of a name.
export async function listModelIds({ providerId, baseUrl, key, fetch = globalThis.fetch }) {
  let url
  let headers
  if (providerId === 'anthropic') {
    url = `${baseUrl.replace(/\/+$/, '')}/models?limit=1000`
    headers = { 'x-api-key': key, 'anthropic-version': '2023-06-01' }
  } else if (providerId === 'gemini') {
    url = `${new URL(baseUrl).origin}/v1beta/models?pageSize=1000`
    headers = { 'x-goog-api-key': key }
  } else {
    url = `${baseUrl.replace(/\/+$/, '')}/models`
    headers = { Authorization: `Bearer ${key}` }
  }
  const response = await fetch(url, { headers })
  if (!response.ok) {
    const body = withoutKey(await response.text().catch(() => ''), key).slice(0, 150)
    throw new Error(`The model list answered ${response.status}: ${body}`)
  }
  const data = await response.json()
  if (providerId === 'gemini') return (data.models ?? []).map((model) => String(model.name).replace(/^models\//, ''))
  return (data.data ?? []).map((model) => model.id)
}

// OpenRouter publishes its list with no key. It shows if an ID is gone, and which models take images.
export function openRouterVisionProblems(models, list) {
  const byId = new Map((list.data ?? []).map((model) => [model.id, model]))
  const problems = []
  for (const model of models) {
    const found = byId.get(model.id)
    if (!found) {
      problems.push(`${model.id} is not in the list of OpenRouter.`)
      continue
    }
    const images = (found.architecture?.input_modalities ?? []).includes('image')
    if (model.vision && !images) problems.push(`${model.id} is marked as reading images, but the list shows no image input.`)
  }
  return problems
}

const PASSAGE = {
  id: 'p1',
  label: 'angles.md',
  text: 'A triangle is a shape with three straight sides and three angles. The angles of any triangle always add up to 180 degrees. An angle is measured in degrees. A right angle is 90 degrees.',
}
const HEBREW_WORDS = ['משולש', 'צורה', 'שלוש', 'צלעות', 'סכום', 'הזוויות', 'מעלות', 'זווית', 'הצלע', 'יתר']
const VERDICTS = ['correct', 'partial', 'wrong', 'off_topic']

const TURN = {
  teacherPrompt: 'Teach this to 7th graders, in English. Be Socratic.',
  plan: { title: 'Angles of a triangle', language: 'English', audience: '7th grade', difficulty: 'medium' },
  step: {
    title: 'The angles add up to 180',
    goal: 'The student learns that the angles of a triangle add up to 180 degrees.',
    checkQuestion: 'A triangle has two angles of 50 and 60 degrees. What is the third angle?',
    keyPoints: ['The angles add up to 180 degrees.'],
  },
  passages: [PASSAGE],
  progress: { stepIndex: 0, total: 2, attempts: 0, hintLevel: 0 },
  history: [],
  studentMessage: null,
  request: 'answer',
  forceExplain: false,
}

// Runs the checks of one model. `listed` is true or false (from listModelIds), or null when the list could not be read.
// `deps` has complete, streamChat, buildTurnMessages, buildPlanMessages and buildTranscribeMessages.
// It returns [{ check, ok, detail, ms }]. An error of the provider fails only its own check.
export async function checkModel({ provider, key, deps, image, listed }) {
  const results = []
  async function run(check, fn) {
    const started = Date.now()
    try {
      const { ok, detail } = await fn()
      results.push({ check, ok, detail, ms: Date.now() - started })
    } catch (err) {
      results.push({ check, ok: false, detail: withoutKey(err?.message ?? err, key).slice(0, 200), ms: Date.now() - started })
    }
  }

  await run('listed', async () => {
    if (listed === null) return { ok: true, detail: 'skipped (the list could not be read)' }
    return { ok: listed, detail: listed ? 'in the list of the provider' : 'not in the list of the provider' }
  })

  await run('answers', async () => {
    const text = await deps.complete({ key, provider, messages: [{ role: 'user', content: 'Reply with the single word: ok' }] })
    return { ok: text.trim().length > 0, detail: text.trim().slice(0, 30) || 'empty answer' }
  })

  await run('tutor turn', async () => {
    const filter = createControlFilter()
    for await (const piece of deps.streamChat({ key, provider, messages: deps.buildTurnMessages(TURN) })) filter.push(piece)
    const { visible, control } = filter.finish()
    if (!visible.trim()) return { ok: false, detail: 'empty reply' }
    if (!control || !VERDICTS.includes(control.verdict)) return { ok: false, detail: 'no control line at the end of the reply' }
    return { ok: true, detail: `streamed, control ${control.verdict}` }
  })

  await run('lesson plan', async () => {
    const messages = deps.buildPlanMessages({
      teacherPrompt: 'Teach this to 7th graders in English. Use 2 steps.',
      options: { minutes: 10, difficulty: 'medium', language: 'en' },
      passages: [PASSAGE],
      compact: false,
    })
    const text = await deps.complete({ key, provider, messages })
    let raw
    try {
      raw = parsePlanJson(text)
    } catch {
      return { ok: false, detail: 'the answer is not valid JSON' }
    }
    const { plan, errors } = validatePlan(raw, new Set([PASSAGE.id]))
    return plan ? { ok: true, detail: `${plan.steps.length} steps` } : { ok: false, detail: errors.join(' ').slice(0, 120) }
  })

  if (provider.vision) {
    await run('scanned page', async () => {
      const text = await deps.complete({ key, provider, messages: deps.buildTranscribeMessages(image) })
      const found = hebrewWordsFound(text, HEBREW_WORDS)
      return { ok: found >= 5, detail: `${found} of ${HEBREW_WORDS.length} known words` }
    })
  }
  return results
}
