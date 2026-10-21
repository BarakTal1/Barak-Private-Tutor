import { clearLesson, loadLesson, saveLesson } from '../../src/lesson/persist.js'
import { answer, lessonState, run, tutorTurn } from '../helpers/lesson.js'

beforeEach(() => sessionStorage.clear())

test('saveLesson then loadLesson returns the same lesson', () => {
  const state = tutorTurn(answer(tutorTurn(lessonState(), 'Hello', null)), 'Good', {
    verdict: 'correct',
    advance: true,
  })
  saveLesson(state)
  expect(loadLesson()).toEqual(state)
})

test('loadLesson drops a partial tutor message and streaming', () => {
  const streaming = run(answer(lessonState()), { type: 'tutorStarted', stepId: 's1' }, { type: 'tutorDelta', text: 'Part' })
  sessionStorage.setItem('tmtf.lesson.v1', JSON.stringify(streaming))
  const loaded = loadLesson()
  expect(loaded.streaming).toBe(false)
  expect(loaded.messages.map((m) => m.role)).toEqual(['student'])
})

test('saveLesson never writes a key, an error or the streaming flag', () => {
  const state = run(lessonState(), { type: 'failed', error: { code: 'bad_key', message: 'no' } })
  saveLesson(state)
  const raw = sessionStorage.getItem('tmtf.lesson.v1')
  expect(raw).not.toMatch(/apikey|"key"\s*:|x-llm-key|bad_key/i)
  expect(JSON.parse(raw)).toMatchObject({ error: null, streaming: false })
})

test('saveLesson only saves a lesson that has started', () => {
  saveLesson({ ...lessonState(), phase: 'report' })
  expect(sessionStorage.getItem('tmtf.lesson.v1')).toBeNull()
})

test('loadLesson returns null for corrupt data and for nothing', () => {
  expect(loadLesson()).toBeNull()
  sessionStorage.setItem('tmtf.lesson.v1', '{oops')
  expect(loadLesson()).toBeNull()
  sessionStorage.setItem('tmtf.lesson.v1', JSON.stringify({ phase: 'lesson' }))
  expect(loadLesson()).toBeNull()
})

test('clearLesson removes the saved lesson', () => {
  saveLesson(lessonState())
  clearLesson()
  expect(loadLesson()).toBeNull()
})

test('saveLesson does not throw when storage is full', () => {
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('full', 'QuotaExceededError')
  })
  expect(() => saveLesson(lessonState())).not.toThrow()
  spy.mockRestore()
})
