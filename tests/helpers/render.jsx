import { render } from '@testing-library/react'
import { SettingsProvider } from '../../src/ai/SettingsProvider.jsx'
import { LessonProvider, useLesson } from '../../src/lesson/LessonProvider.jsx'
import { saveSettings, loadSettings } from '../../src/ai/settings.js'

export const lessonRef = { current: null }

function Capture() {
  lessonRef.current = useLesson()
  return null
}

// Renders a screen inside the providers of the app. `key` fills the API key in the settings.
export function renderScreen(ui, { key = 'test-key' } = {}) {
  sessionStorage.clear()
  localStorage.clear()
  if (key) saveSettings({ ...loadSettings(), key })
  return render(
    <SettingsProvider>
      <LessonProvider>
        <Capture />
        {ui}
      </LessonProvider>
    </SettingsProvider>,
  )
}
