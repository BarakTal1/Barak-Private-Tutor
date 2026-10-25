import { scenarios } from '../../eval/scenarios.mjs'

test('every scenario has an id, a title, a pass condition and a run function', () => {
  for (const scenario of scenarios) {
    expect(scenario.id, JSON.stringify(scenario)).toMatch(/^[a-z0-9-]+$/)
    expect(scenario.title.length).toBeGreaterThan(10)
    expect(scenario.pass.length).toBeGreaterThan(10)
    expect(typeof scenario.run).toBe('function')
  }
})

test('the ids are different', () => {
  const ids = scenarios.map((scenario) => scenario.id)
  expect(new Set(ids).size).toBe(ids.length)
})

test('the suite has the original 7 scenarios and the new complex ones', () => {
  const ids = scenarios.map((scenario) => scenario.id)
  for (const id of [
    'wrong-answer', 'just-tell-me', 'off-topic-injection', 'hebrew-scan', 'long-document', 'teacher-prompt', 'hint-request',
    'three-wrong-forced-explain', 'full-lesson-simulated-student', 'partial-answer-consistent', 'right-but-weak-answer',
    'out-of-file-question', 'file-injection', 'student-distress', 'lesson-language-wins', 'difficulty-levels',
  ]) {
    expect(ids, id).toContain(id)
  }
})
