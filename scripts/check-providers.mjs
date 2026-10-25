// Checks every provider and every model that the settings offer, through the same server code as the app.
// Each provider with a key in the environment gets 5 checks for each of its 3 models:
//   listed (the model is in the list of the provider for this key), answers, tutor turn (streamed, with the control line),
//   lesson plan (valid JSON) and scanned page (for the models that should read images).
//
//   GROQ_KEY=... OPENROUTER_KEY=... npm run check-providers
//   npm run check-providers -- groq            (only some providers)
//
// The keys are read from the environment and sent only to the provider. They are never printed or saved.
// Keys: ANTHROPIC_KEY, OPENAI_KEY, GEMINI_KEY, GROQ_KEY, OPENROUTER_KEY. Without any key, only the public list of OpenRouter is checked.
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { complete, streamChat } from '../server/llm.js'
import { buildPlanMessages, buildTranscribeMessages, buildTurnMessages } from '../server/prompts.js'
import { PROVIDER_PRESETS } from '../src/ai/settings.js'
import { KEY_ENV, checkModel, keysFromEnv, listModelIds, openRouterVisionProblems } from './provider-checks.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const DELAY_MS = Number(process.env.CHECK_DELAY_MS ?? 2000)
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const keys = keysFromEnv(process.env)
const only = process.argv.slice(2).filter((arg) => !arg.startsWith('-'))
let failed = 0

// 1. The public list of OpenRouter needs no key.
const openrouter = PROVIDER_PRESETS.find((preset) => preset.id === 'openrouter')
try {
  const list = await (await fetch('https://openrouter.ai/api/v1/models')).json()
  const problems = openRouterVisionProblems(openrouter.models, list)
  if (problems.length) failed += problems.length
  console.log(problems.length ? problems.map((problem) => `FAIL  openrouter list  ${problem}`).join('\n') : 'PASS  openrouter list  the 3 IDs are in the live list, and the image flags match')
} catch (err) {
  console.log(`SKIP  openrouter list  ${err.message}`)
}

const image = `data:image/jpeg;base64,${(await readFile(join(here, '..', 'eval', 'fixtures', 'hebrew-scan.jpg'))).toString('base64')}`
const deps = { complete, streamChat, buildTurnMessages, buildPlanMessages, buildTranscribeMessages }
const chosen = PROVIDER_PRESETS.filter((preset) => preset.models && (!only.length || only.includes(preset.id)))

for (const preset of chosen) {
  const key = keys[preset.id]
  if (!key) {
    console.log(`SKIP  ${preset.id}  no key (set ${KEY_ENV[preset.id]})`)
    continue
  }
  let ids = null
  try {
    ids = await listModelIds({ providerId: preset.id, baseUrl: preset.baseUrl, key })
  } catch (err) {
    console.log(`WARN  ${preset.id}  ${err.message}`)
  }
  for (const model of preset.models) {
    const provider = { baseUrl: preset.baseUrl, model: model.id, vision: model.vision }
    const results = await checkModel({ provider, key, deps, image, listed: ids ? ids.includes(model.id) : null })
    for (const result of results) {
      if (!result.ok) failed += 1
      console.log(`${result.ok ? 'PASS' : 'FAIL'}  ${preset.id}  ${model.id}  ${result.check}  ${result.detail}  (${result.ms} ms)`)
    }
    await wait(DELAY_MS)
  }
}

console.log(failed ? `\n${failed} check(s) failed.` : '\nAll checks passed.')
process.exit(failed ? 1 : 0)
