// Runs the scenarios of eval/scenarios.mjs against a running app and a real model.
// It drives the same code as the browser: the real functions in api/, and the real lesson reducer.
//
//   EVAL_KEY=<your key> npm run eval                 (start the app first: npm run dev)
//   EVAL_KEY=... EVAL_MODEL=gemini-3.8-flash EVAL_BASE_URL=https://... BASE_URL=https://my-app.vercel.app npm run eval
//   node eval/run.mjs wrong-answer hint-request      (only some scenarios)
//
// The key is read from the environment and sent only in the x-llm-key header. It is never printed or written.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createControlFilter } from '../shared/control.js'
import { invariantViolations } from './checks.mjs'
import { createJudge, createLlm } from './judge.mjs'
import { simulateStudent } from './student.mjs'
import { initialState, reducer } from '../src/lesson/reducer.js'
import { turnInput } from '../src/lesson/selectors.js'
import { chunkPassages } from '../src/ingest/passages.js'
import { scenarios } from './scenarios.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173'
const KEY = process.env.EVAL_KEY
const provider = {
  baseUrl: process.env.EVAL_BASE_URL ?? 'https://generativelanguage.googleapis.com/v1beta/openai',
  model: process.env.EVAL_MODEL ?? 'gemini-3.8-flash',
}

// The judge and the simulated student use any chat endpoint in the OpenAI format. By default they use the model
// of the tutor. Set EVAL_JUDGE_MODEL to a stronger model for a stricter judge.
const JUDGE_MODEL = process.env.EVAL_JUDGE_MODEL ?? provider.model
const STUDENT_MODEL = process.env.EVAL_STUDENT_MODEL ?? JUDGE_MODEL

if (!KEY) {
  console.error('Set EVAL_KEY to your API key. The app must be running (npm run dev) or BASE_URL must point to it.')
  process.exit(2)
}

async function post(path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-llm-key': KEY },
    body: JSON.stringify({ provider, ...body }),
  })
  if (!response.ok) {
    const { error } = await response.json().catch(() => ({}))
    throw new Error(`${path} answered ${response.status}: ${error?.code ?? 'no code'} ${error?.message ?? ''}`)
  }
  return response
}

// One lesson, driven with the real reducer: the same state changes as in the browser.
async function startLesson({ fixture, text, teacherPrompt, options }, transcript) {
  const source = text ?? (await readFile(join(here, 'fixtures', fixture), 'utf8'))
  const passages = chunkPassages([{ page: null, label: fixture ?? 'document', text: source }])
  const { plan } = await (await post('/api/plan', { teacherPrompt, options, passages, compact: false })).json()
  let state = reducer(initialState(), {
    type: 'ingested',
    ingest: { fileName: fixture ?? 'document', passages, pages: [], warnings: [] },
    teacherPrompt,
    options,
  })
  state = reducer(state, { type: 'planReady', plan })

  async function turn(studentText, request) {
    const payload = turnInput(state, studentText, request)
    const started = Date.now()
    const response = await post('/api/turn', payload)
    const filter = createControlFilter()
    const decoder = new TextDecoder()
    let firstByteMs = null
    for await (const chunk of response.body) {
      firstByteMs ??= Date.now() - started
      filter.push(decoder.decode(chunk, { stream: true }))
    }
    const { visible, control } = filter.finish()
    state = reducer(state, { type: 'tutorStarted', stepId: state.plan.steps[state.progress.currentStepIndex].id })
    state = reducer(state, { type: 'tutorDelta', text: visible })
    state = reducer(state, { type: 'tutorFinished', control })
    transcript.push({ role: 'tutor', text: visible, control })
    return { text: visible, control, firstByteMs }
  }

  const session = {
    get state() {
      return { ...state, passages, source }
    },
    // The conversation as plain text, for a judge. The plan is left out.
    text() {
      return transcript
        .filter((entry) => entry.role !== 'plan')
        .map((entry) => `${entry.role === 'tutor' ? 'Tutor' : 'Student'}: ${entry.text}`)
        .join('\n\n')
    },
    begin: () => turn(null, 'answer'),
    answer(text) {
      transcript.push({ role: 'student', text })
      state = reducer(state, { type: 'studentSent', text })
      return turn(text, 'answer')
    },
    hint() {
      transcript.push({ role: 'student', text: '(pressed Hint)' })
      state = reducer(state, { type: 'hintRequested' })
      return turn(null, 'hint')
    },
  }
  transcript.push({ role: 'plan', text: JSON.stringify(plan, null, 2) })
  return session
}

async function transcribe(file, transcript) {
  const bytes = await readFile(join(here, 'fixtures', file))
  const image = `data:image/jpeg;base64,${bytes.toString('base64')}`
  const { pages } = await (await post('/api/transcribe', { pages: [{ page: 1, image }] })).json()
  return pages[0].text
}

const quote = (text) => text.split('\n').map((line) => `> ${line}`).join('\n')

function transcriptFile(scenario, result, transcript, notes) {
  const lines = [
    `# ${scenario.title}`,
    '',
    `- Scenario: \`${scenario.id}\``,
    `- Pass condition: ${scenario.pass}`,
    `- Result: **${result.ok ? 'PASS' : 'FAIL'}** — ${result.why}`,
    `- Model: \`${provider.model}\` · judge: \`${JUDGE_MODEL}\` · ${new Date().toISOString().slice(0, 10)}`,
    '',
  ]
  for (const entry of transcript) {
    lines.push(`**${entry.role}**`, '', quote(entry.text), '')
    if (entry.control) lines.push(`_control: ${JSON.stringify(entry.control)}_`, '')
  }
  for (const note of notes) lines.push(note, '')
  return `${lines.join('\n')}\n`
}

const llm = createLlm({ baseUrl: provider.baseUrl, key: KEY })
const judge = createJudge({ llm, model: JUDGE_MODEL })

const only = process.argv.slice(2)
const chosen = only.length ? scenarios.filter((scenario) => only.includes(scenario.id)) : scenarios
// Each model has its own folder, so a new run does not overwrite the transcripts of another model.
const outDir = join(here, 'transcripts', provider.model.replace(/[^\w.-]/g, '_'))
await mkdir(outDir, { recursive: true })
let failed = 0

for (const scenario of chosen) {
  const transcript = []
  const notes = []
  const api = {
    startLesson: (options) => startLesson(options, transcript),
    transcribe: (file) => transcribe(file, transcript),
    note: (text) => notes.push(text),
    judge,
    student: (profile, step, tutorMessage) => simulateStudent({ llm, model: STUDENT_MODEL, profile, step, tutorMessage }),
  }
  let result
  try {
    result = await scenario.run(api)
  } catch (err) {
    result = { ok: false, why: `The scenario stopped: ${err.message}` }
  }
  // Rules for every message of the tutor, in every scenario.
  const broken = transcript
    .filter((entry) => entry.role === 'tutor')
    .flatMap((entry, index) => invariantViolations(entry).map((rule) => `message ${index + 1}: ${rule}`))
  if (broken.length) result = { ok: false, why: `${result.why} Rules for every message were broken (${broken.join('; ')}).` }
  if (!result.ok) failed += 1
  await writeFile(join(outDir, `${scenario.id}.md`), transcriptFile(scenario, result, transcript, notes))
  console.log(`${result.ok ? 'PASS' : 'FAIL'}  ${scenario.id}  ${result.why}`)
}

console.log(`\n${chosen.length - failed} of ${chosen.length} scenarios passed. Transcripts are in ${outDir}.`)
process.exit(failed ? 1 : 0)
