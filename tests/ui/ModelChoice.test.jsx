import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../src/App.jsx'
import { loadSettings } from '../../src/ai/settings.js'
import { en } from '../../src/ui/en.js'
import { he } from '../../src/ui/he.js'
import { renderScreen } from '../helpers/render.jsx'

async function openSettings() {
  await userEvent.click(screen.getByRole('button', { name: he.setup.settings }))
  return screen.getByRole('dialog')
}
const group = (dialog) => within(dialog).getByRole('radiogroup', { name: he.settings.modelChoice })
const modelField = (dialog) => within(dialog).getByLabelText(he.settings.model)
const choose = (dialog, name) => userEvent.click(within(group(dialog)).getByRole('radio', { name }))
const pickProvider = (dialog, name) => userEvent.click(within(dialog).getByRole('button', { name }))

test('Anthropic shows Haiku, Sonnet and Opus, with Sonnet selected', async () => {
  renderScreen(<App />)
  const dialog = await openSettings()
  const radios = within(group(dialog)).getAllByRole('radio')
  expect(radios).toHaveLength(3)
  expect(radios[0]).toHaveAccessibleName(/Claude Haiku 5\.5/)
  expect(radios[1]).toHaveAccessibleName(/Claude Sonnet 5\.5/)
  expect(radios[2]).toHaveAccessibleName(/Claude Opus 5\.5/)
  expect(radios.map((radio) => radio.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false'])
})

test('each choice names its tier', async () => {
  renderScreen(<App />)
  const dialog = await openSettings()
  const radios = within(group(dialog)).getAllByRole('radio')
  expect(radios[0]).toHaveTextContent(he.settings.tiers.fast)
  expect(radios[1]).toHaveTextContent(he.settings.tiers.balanced)
  expect(radios[2]).toHaveTextContent(he.settings.tiers.strong)
})

test('choosing Opus fills the model field and the saved settings', async () => {
  renderScreen(<App />)
  const dialog = await openSettings()
  await choose(dialog, /Opus/)
  expect(modelField(dialog)).toHaveValue('claude-opus-5-5')
  expect(loadSettings().provider.model).toBe('claude-opus-5-5')
  expect(within(group(dialog)).getByRole('radio', { name: /Opus/ })).toHaveAttribute('aria-checked', 'true')
})

test('choosing another provider shows the three models of that provider', async () => {
  renderScreen(<App />)
  const dialog = await openSettings()
  await pickProvider(dialog, 'OpenAI')
  const names = within(group(dialog)).getAllByRole('radio').map((radio) => radio.textContent)
  expect(names[0]).toMatch(/GPT-6 Luna/)
  expect(names[1]).toMatch(/GPT-6\.1 Sol/)
  expect(names[2]).toMatch(/GPT-6 Astra/)
  expect(modelField(dialog)).toHaveValue('gpt-6.1-sol')
})

test('the image switch follows the model: Gemma reads images, Nemotron does not', async () => {
  renderScreen(<App />)
  const dialog = await openSettings()
  await pickProvider(dialog, 'OpenRouter')
  const vision = () => within(dialog).getByRole('switch', { name: new RegExp(he.settings.vision) })
  await choose(dialog, /Nemotron/)
  expect(vision()).toHaveAttribute('aria-checked', 'false')
  await choose(dialog, /Gemma 4 31B/)
  expect(vision()).toHaveAttribute('aria-checked', 'true')
})

test('the custom provider has no list of models, only the field', async () => {
  renderScreen(<App />)
  const dialog = await openSettings()
  await pickProvider(dialog, he.settings.custom)
  expect(within(dialog).queryByRole('radiogroup', { name: he.settings.modelChoice })).not.toBeInTheDocument()
  expect(modelField(dialog)).toBeInTheDocument()
})

test('a name typed in the field selects no choice, and the typed name is kept', async () => {
  renderScreen(<App />)
  const dialog = await openSettings()
  await userEvent.clear(modelField(dialog))
  await userEvent.type(modelField(dialog), 'claude-fable-5-1')
  for (const radio of within(group(dialog)).getAllByRole('radio')) expect(radio).toHaveAttribute('aria-checked', 'false')
  expect(loadSettings().provider.model).toBe('claude-fable-5-1')
})

test('the tier words are English in the English interface', async () => {
  localStorage.setItem('tmtf.lang.v1', 'en')
  renderScreen(<App />, { reset: false })
  await userEvent.click(screen.getByRole('button', { name: en.setup.settings }))
  const radios = within(screen.getByRole('radiogroup', { name: en.settings.modelChoice })).getAllByRole('radio')
  expect(radios[0]).toHaveTextContent(en.settings.tiers.fast)
})
