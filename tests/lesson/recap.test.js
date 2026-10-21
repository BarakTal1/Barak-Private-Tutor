import { recapBullets } from '../../src/lesson/selectors.js'

const step = (...keyPoints) => ({ id: 's', title: 't', goal: 'g', passageIds: [], checkQuestion: 'q', keyPoints })
const plan = (...steps) => ({ steps })

test('returns the first key point of each step when there are 3 or fewer', () => {
  expect(recapBullets(plan(step('a1', 'a2'), step('b1')))).toEqual(['a1', 'b1'])
})

test('returns at most 3 bullets spread across the plan', () => {
  const steps = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((letter) => step(letter))
  expect(recapBullets(plan(...steps))).toEqual(['a', 'd', 'g'])
})

test('returns one bullet for a one-step plan', () => {
  expect(recapBullets(plan(step('only')))).toEqual(['only'])
})

test('skips a step with no key points', () => {
  expect(recapBullets(plan(step(), step('b'), step('c', 'x')))).toEqual(['b', 'c'])
})

test('returns nothing when no step has a key point', () => {
  expect(recapBullets(plan(step(), step()))).toEqual([])
})

test('spreads across the steps that have key points, not across all steps', () => {
  const steps = [step('a'), step(), step(), step('b'), step('c'), step('d')]
  expect(recapBullets(plan(...steps))).toEqual(['a', 'c', 'd'])
})
