import { useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LessonOptions from '../../src/ui/LessonOptions.jsx'
import { en } from '../../src/ui/en.js'
import { fmt, he } from '../../src/ui/he.js'

const untouched = { minutes: 15, difficulty: 'medium', language: null }
const row = (name) => screen.getByRole('radiogroup', { name })
const choice = (name, label) => within(row(name)).getByRole('radio', { name: label })

function Harness({ appLanguage = 'he', start = untouched, onChange = () => {} }) {
  const [value, setValue] = useState(start)
  return (
    <LessonOptions
      value={value}
      appLanguage={appLanguage}
      onChange={(next) => {
        setValue(next)
        onChange(next)
      }}
    />
  )
}

test('shows three rows with 4, 3 and 2 choices', () => {
  render(<Harness />)
  expect(within(row(he.setup.options.lengthLabel)).getAllByRole('radio')).toHaveLength(4)
  expect(within(row(he.setup.options.difficultyLabel)).getAllByRole('radio')).toHaveLength(3)
  expect(within(row(he.setup.options.languageLabel)).getAllByRole('radio')).toHaveLength(2)
})

test('the defaults are selected: 15 minutes, medium and the app language', () => {
  render(<Harness />)
  expect(choice(he.setup.options.lengthLabel, fmt(he.setup.options.lengthChoice, { n: 15 }))).toHaveAttribute('aria-checked', 'true')
  expect(choice(he.setup.options.difficultyLabel, he.setup.options.medium)).toHaveAttribute('aria-checked', 'true')
  expect(choice(he.setup.options.languageLabel, 'עברית')).toHaveAttribute('aria-checked', 'true')
  expect(choice(he.setup.options.languageLabel, 'English')).toHaveAttribute('aria-checked', 'false')
})

test('a tap calls onChange with the new value and keeps the other fields', async () => {
  const onChange = vi.fn()
  render(<Harness onChange={onChange} />)
  await userEvent.click(choice(he.setup.options.lengthLabel, fmt(he.setup.options.lengthChoice, { n: 30 })))
  expect(onChange).toHaveBeenLastCalledWith({ minutes: 30, difficulty: 'medium', language: null })
  await userEvent.click(choice(he.setup.options.difficultyLabel, he.setup.options.easy))
  expect(onChange).toHaveBeenLastCalledWith({ minutes: 30, difficulty: 'easy', language: null })
  expect(choice(he.setup.options.difficultyLabel, he.setup.options.easy)).toHaveAttribute('aria-checked', 'true')
})

test('an untouched language row follows the app language', () => {
  const { rerender } = render(<LessonOptions value={untouched} appLanguage="he" onChange={() => {}} />)
  expect(choice(he.setup.options.languageLabel, 'עברית')).toHaveAttribute('aria-checked', 'true')
  localStorage.setItem('tmtf.lang.v1', 'en')
  rerender(<LessonOptions value={untouched} appLanguage="en" onChange={() => {}} />)
  expect(choice(en.setup.options.languageLabel, 'English')).toHaveAttribute('aria-checked', 'true')
  localStorage.clear()
})

test('a chosen language stays when the app language changes', async () => {
  const { rerender } = render(<Harness />)
  await userEvent.click(choice(he.setup.options.languageLabel, 'English'))
  const chosen = { ...untouched, language: 'en' }
  rerender(<LessonOptions value={chosen} appLanguage="he" onChange={() => {}} />)
  expect(choice(he.setup.options.languageLabel, 'English')).toHaveAttribute('aria-checked', 'true')
  expect(choice(he.setup.options.languageLabel, 'עברית')).toHaveAttribute('aria-checked', 'false')
})

test('the rows use the strings of the current language', () => {
  localStorage.setItem('tmtf.lang.v1', 'en')
  render(<Harness appLanguage="en" />)
  expect(choice(en.setup.options.lengthLabel, fmt(en.setup.options.lengthChoice, { n: 5 }))).toBeInTheDocument()
  localStorage.clear()
})
