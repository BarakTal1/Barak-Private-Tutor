import { render, screen } from '@testing-library/react'
import { SettingsProvider } from '../src/ai/SettingsProvider.jsx'
import { LessonProvider } from '../src/lesson/LessonProvider.jsx'
import App from '../src/App.jsx'
import { he } from '../src/ui/he.js'

test('renders the app title', () => {
  render(
    <SettingsProvider>
      <LessonProvider>
        <App />
      </LessonProvider>
    </SettingsProvider>,
  )
  expect(screen.getByRole('heading', { level: 1, name: he.appName })).toBeInTheDocument()
})
