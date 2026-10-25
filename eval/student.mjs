// A model that plays the student, so that a scenario can run a whole lesson without a human.

const PROFILES = {
  strong:
    'You answer exactly what the tutor last asked, correctly, in one or two sentences, in simple words, like a real 7th grade student. Use only the facts that you are given. If the tutor asked something else than the question of the step, answer what the tutor asked.',
  confused:
    'You are confused and you do not really understand. Say what you think in your own words, but get it wrong or only half right. Never give the correct final answer, and never say that you understood.',
  guesser:
    'You guess. Give a short answer, for example a number, with no reasoning. Your guesses are usually wrong.',
}

export function buildStudentMessages({ profile, step, tutorMessage }) {
  if (!PROFILES[profile]) throw new Error(`Unknown student profile: ${profile}`)
  const facts = profile === 'strong' ? `\nFacts you know:\n${step.keyPoints.map((point) => `- ${point}`).join('\n')}` : ''
  return [
    { role: 'system', content: `You play a student in a chat with a tutor. ${PROFILES[profile]} Write only what the student says. No labels, no quotes, no stage directions.` },
    { role: 'user', content: `Background only (answer what the tutor asked, not the question of the step). The question of this step: ${step.checkQuestion}${facts}\n\nThe tutor said:\n<<<TUTOR\n${tutorMessage}\nTUTOR>>>\n\nWhat does the student say?` },
  ]
}

const clean = (text) => text.trim().replace(/^(student|me)\s*:\s*/i, '').replace(/^["“”']+|["“”']+$/g, '').trim()

const TRIES = 3

// A model can answer with nothing. The scenario must never send an empty message, so it asks again.
export async function simulateStudent({ llm, model, profile, step, tutorMessage }) {
  for (let attempt = 0; attempt < TRIES; attempt++) {
    const text = clean(await llm({ model, messages: buildStudentMessages({ profile, step, tutorMessage }), maxTokens: 500 }))
    if (text) return text
  }
  throw new Error('The simulated student answered with nothing three times.')
}
