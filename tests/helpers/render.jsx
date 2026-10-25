import { act, render } from '@testing-library/react'
import { StrictMode } from 'react'
import { SettingsProvider } from '../../src/ai/SettingsProvider.jsx'
import { LessonProvider, useLesson } from '../../src/lesson/LessonProvider.jsx'
import { LanguageProvider } from '../../src/ui/i18n.jsx'
import { saveSettings, loadSettings } from '../../src/ai/settings.js'
import { ingest, plan } from './lesson.js'

export const lessonRef = { current: null }

function Capture() {
  lessonRef.current = useLesson()
  return null
}

// Renders a screen inside the providers of the app. `key` fills the API key in the settings.
// With `reset: false` the saved lesson and settings stay, to test a reload.
export function renderScreen(ui, { key = 'test-key', strict = false, reset = true } = {}) {
  if (reset) {
    sessionStorage.clear()
    localStorage.clear()
  }
  if (key && reset) saveSettings({ ...loadSettings(), key })
  const tree = (
    <LanguageProvider>
      <SettingsProvider>
        <LessonProvider>
          <Capture />
          {ui}
        </LessonProvider>
      </SettingsProvider>
    </LanguageProvider>
  )
  return render(strict ? <StrictMode>{tree}</StrictMode> : tree)
}

// Renders the app and moves it to the first step of a lesson, as if the teacher had pressed "Start".
export function renderLesson(ui, options = {}) {
  const view = renderScreen(ui, options)
  act(() => {
    lessonRef.current.dispatch({ type: 'ingested', ingest, teacherPrompt: options.teacherPrompt ?? 'Be Socratic' })
    lessonRef.current.dispatch({ type: 'planReady', plan: options.plan ?? plan })
  })
  return view
}
