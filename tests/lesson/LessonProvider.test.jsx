import { act, render, screen } from '@testing-library/react'
import { LessonProvider, useLesson } from '../../src/lesson/LessonProvider.jsx'
import { loadLesson, saveLesson } from '../../src/lesson/persist.js'
import { lessonState } from '../helpers/lesson.js'

let api
function Probe() {
  api = useLesson()
  return <p>{api.state.phase}</p>
}

beforeEach(() => sessionStorage.clear())

test('starts in setup when nothing is saved', () => {
  render(<LessonProvider><Probe /></LessonProvider>)
  expect(screen.getByText('setup')).toBeInTheDocument()
})

test('restores a saved lesson on mount', () => {
  saveLesson(lessonState())
  render(<LessonProvider><Probe /></LessonProvider>)
  expect(screen.getByText('lesson')).toBeInTheDocument()
})

test('saves the lesson after a change and clears it on reset', () => {
  render(<LessonProvider><Probe /></LessonProvider>)
  act(() => {
    api.dispatch({ type: 'ingested', ingest: lessonState().ingest, teacherPrompt: '' })
    api.dispatch({ type: 'planReady', plan: lessonState().plan })
  })
  expect(loadLesson()).not.toBeNull()
  act(() => api.dispatch({ type: 'reset' }))
  expect(loadLesson()).toBeNull()
})
