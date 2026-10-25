import { buildStudentMessages, simulateStudent } from '../../eval/student.mjs'

const step = { title: 'Angles', checkQuestion: 'What is the third angle?', keyPoints: ['The angles add up to 180 degrees.'] }

describe('buildStudentMessages', () => {
  test('a strong student gets the key points and is told to answer correctly and briefly', () => {
    const [system, user] = buildStudentMessages({ profile: 'strong', step, tutorMessage: 'What is the third angle?' })
    expect(system.content).toMatch(/correct/i)
    expect(system.content).toMatch(/one or two sentences/i)
    expect(user.content).toContain('The angles add up to 180 degrees.')
    expect(user.content).toContain('What is the third angle?')
  })

  test('a strong student answers what the tutor asked, not the question of the step', () => {
    const [system, user] = buildStudentMessages({ profile: 'strong', step, tutorMessage: 'What do the three angles add up to?' })
    expect(system.content).toMatch(/answer (exactly )?what the tutor (last )?asked/i)
    expect(user.content).toMatch(/not (the question of the step|another question)/i)
  })

  test('a confused student does not get the key points', () => {
    const [system, user] = buildStudentMessages({ profile: 'confused', step, tutorMessage: 'Try again.' })
    expect(system.content).toMatch(/confus/i)
    expect(user.content).not.toContain('180')
  })

  test('an unknown profile is an error', () => {
    expect(() => buildStudentMessages({ profile: 'wizard', step, tutorMessage: 'x' })).toThrow(/profile/i)
  })
})

describe('simulateStudent', () => {
  test('returns the text of the model without quotes or a "Student:" label', async () => {
    const llm = vi.fn(async () => '  Student: "It is 70 degrees."  ')
    await expect(simulateStudent({ llm, model: 'm', profile: 'strong', step, tutorMessage: 'Q?' })).resolves.toBe('It is 70 degrees.')
  })
})

test('the simulated student sets no temperature (some models reject it)', async () => {
  const llm = vi.fn(async () => 'It is 70.')
  await simulateStudent({ llm, model: 'm', profile: 'strong', step, tutorMessage: 'Q?' })
  expect(llm.mock.calls[0][0]).not.toHaveProperty('temperature')
})

describe('an empty answer of the model', () => {
  test('is asked again, and the second answer is used', async () => {
    const llm = vi.fn().mockResolvedValueOnce('   ').mockResolvedValueOnce('It is 70.')
    await expect(simulateStudent({ llm, model: 'm', profile: 'strong', step, tutorMessage: 'Q?' })).resolves.toBe('It is 70.')
    expect(llm).toHaveBeenCalledTimes(2)
  })

  test('is an error after three tries, so that a scenario never sends an empty message', async () => {
    const llm = vi.fn(async () => '')
    await expect(simulateStudent({ llm, model: 'm', profile: 'strong', step, tutorMessage: 'Q?' })).rejects.toThrow(/nothing/i)
    expect(llm).toHaveBeenCalledTimes(3)
  })

  test('the simulated student asks for enough tokens', async () => {
    const llm = vi.fn(async () => 'ok')
    await simulateStudent({ llm, model: 'm', profile: 'strong', step, tutorMessage: 'Q?' })
    expect(llm.mock.calls[0][0].maxTokens).toBeGreaterThanOrEqual(400)
  })
})
