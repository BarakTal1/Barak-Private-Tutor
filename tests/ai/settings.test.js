import {
  PROVIDER_PRESETS,
  applyPreset,
  isReady,
  loadSettings,
  saveSettings,
} from '../../src/ai/settings.js'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

test('there are presets for Anthropic, OpenAI, Gemini, Groq, OpenRouter and a custom provider', () => {
  expect(PROVIDER_PRESETS.map((p) => p.id)).toEqual(['anthropic', 'openai', 'gemini', 'groq', 'openrouter', 'custom'])
  expect(PROVIDER_PRESETS.find((p) => p.id === 'gemini').vision).toBe(true)
  for (const preset of PROVIDER_PRESETS.filter((p) => p.id !== 'custom')) {
    expect(preset.baseUrl).toMatch(/^https:\/\//)
    expect(preset.model).toBeTruthy()
  }
})

test('the first three presets are Anthropic, OpenAI and Gemini, each with a key page', () => {
  const [a, b, c] = PROVIDER_PRESETS
  expect([a.id, b.id, c.id]).toEqual(['anthropic', 'openai', 'gemini'])
  for (const preset of [a, b, c]) expect(preset.keyUrl).toMatch(/^https:\/\//)
})

test('defaults to the first preset with no key', () => {
  const settings = loadSettings()
  expect(settings).toMatchObject({ providerId: 'anthropic', key: '', rememberKey: false })
  expect(settings.provider.baseUrl).toBe(PROVIDER_PRESETS[0].baseUrl)
})

test('the key is not written to localStorage when rememberKey is false', () => {
  saveSettings({ ...loadSettings(), key: 'secret-123', rememberKey: false })
  expect(JSON.stringify({ ...localStorage })).not.toContain('secret-123')
})

test('the key of this tab survives a reload when rememberKey is false', () => {
  saveSettings({ ...loadSettings(), key: 'secret-123', rememberKey: false })
  expect(loadSettings().key).toBe('secret-123')
})

test('a remembered key is saved in localStorage and loaded back', () => {
  saveSettings({ ...loadSettings(), key: 'secret-123', rememberKey: true })
  expect(JSON.stringify({ ...localStorage })).toContain('secret-123')
  sessionStorage.clear()
  expect(loadSettings()).toMatchObject({ key: 'secret-123', rememberKey: true })
})

test('turning rememberKey off removes the key from localStorage', () => {
  const settings = loadSettings()
  saveSettings({ ...settings, key: 'secret-123', rememberKey: true })
  saveSettings({ ...settings, key: 'secret-123', rememberKey: false })
  expect(JSON.stringify({ ...localStorage })).not.toContain('secret-123')
})

test('the provider, model and vision switch are saved', () => {
  const settings = applyPreset(loadSettings(), 'groq')
  saveSettings({ ...settings, provider: { ...settings.provider, model: 'my-model', vision: true } })
  expect(loadSettings()).toMatchObject({ providerId: 'groq', provider: { model: 'my-model', vision: true } })
})

test('an unknown provider id falls back to the first preset', () => {
  localStorage.setItem('tmtf.settings.v1', JSON.stringify({ providerId: 'nope', provider: { baseUrl: 'x', model: 'y', vision: false } }))
  expect(loadSettings().providerId).toBe('anthropic')
})

test('corrupt saved settings fall back to the defaults', () => {
  localStorage.setItem('tmtf.settings.v1', '{oops')
  expect(loadSettings().providerId).toBe('anthropic')
})

test('applyPreset copies the preset and keeps the key', () => {
  const next = applyPreset({ ...loadSettings(), key: 'k', rememberKey: true }, 'openrouter')
  expect(next).toMatchObject({ providerId: 'openrouter', key: 'k', rememberKey: true })
  expect(next.provider.baseUrl).toBe(PROVIDER_PRESETS.find((p) => p.id === 'openrouter').baseUrl)
})

test('isReady needs a key, an address and a model', () => {
  const base = { ...loadSettings(), key: 'k' }
  expect(isReady(base)).toBe(true)
  expect(isReady({ ...base, key: ' ' })).toBe(false)
  expect(isReady({ ...base, provider: { ...base.provider, model: '' } })).toBe(false)
  expect(isReady({ ...base, provider: { ...base.provider, baseUrl: '' } })).toBe(false)
})

test('saveSettings does not throw when storage is full', () => {
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('full', 'QuotaExceededError')
  })
  expect(() => saveSettings(loadSettings())).not.toThrow()
  spy.mockRestore()
})

test('a saved retired Gemini model moves to the new name', () => {
  localStorage.setItem('tmtf.settings.v1', JSON.stringify({ providerId: 'gemini', provider: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.5-flash', vision: true }, rememberKey: false }))
  expect(loadSettings().provider.model).toBe('gemini-3.8-flash')
})

test('each provider with a list suggests its default model first', () => {
  for (const preset of PROVIDER_PRESETS.filter((p) => p.models)) expect(preset.models[0]).toBe(preset.model)
})
