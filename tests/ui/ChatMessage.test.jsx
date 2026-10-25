import { render, screen } from '@testing-library/react'
import ChatMessage from '../../src/ui/ChatMessage.jsx'
import { en } from '../../src/ui/en.js'
import { he } from '../../src/ui/he.js'
import { LanguageProvider } from '../../src/ui/i18n.jsx'

const hint = { id: 'm2', role: 'tutor', text: 'Look at page 1', mood: 'hint', hintCause: 'asked', passageIds: [] }

function show(language) {
  localStorage.setItem('tmtf.lang.v1', language)
  render(
    <LanguageProvider>
      <ChatMessage message={hint} praise={0} hintLevel={1} isLast={false} streaming={false} slow={false} dir="ltr" onSource={() => {}} onContinue={() => {}} />
    </LanguageProvider>,
  )
}

afterEach(() => localStorage.clear())

test('the title of a hint bubble runs left to right in English', () => {
  show('en')
  expect(screen.getByText(en.lesson.hintTitles.asked, { exact: false }).closest('p')).toHaveAttribute('dir', 'ltr')
})

test('the title of a hint bubble runs right to left in Hebrew', () => {
  show('he')
  expect(screen.getByText(he.lesson.hintTitles.asked, { exact: false }).closest('p')).toHaveAttribute('dir', 'rtl')
})
