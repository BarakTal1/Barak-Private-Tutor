import { render, screen } from '@testing-library/react'
import { SettingsProvider } from '../src/ai/SettingsProvider.jsx'
import { LessonProvider } from '../src/lesson/LessonProvider.jsx'
import App from '../src/App.jsx'
import { he } from '../src/ui/he.js'
import { LanguageProvider } from '../src/ui/i18n.jsx'

test('renders the app title', () => {
  render(
    <LanguageProvider>
      <SettingsProvider>
        <LessonProvider>
          <App />
        </LessonProvider>
      </SettingsProvider>
    </LanguageProvider>,
  )
  expect(screen.getByRole('heading', { level: 1, name: he.appName })).toBeInTheDocument()
})
