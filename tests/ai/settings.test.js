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

// The model IDs that the official documentation of each provider listed on 25 October 2026:
// platform.claude.com (Models overview), developers.openai.com (Models), ai.google.dev (Gemini models),
// console.groq.com (production models) and the live list of openrouter.ai/api/v1/models (free models).
// The order is fast, balanced, strong. A name that is not in the documentation makes a request fail.
const OFFICIAL = {
  anthropic: ['claude-haiku-5-5', 'claude-sonnet-5-5', 'claude-opus-5-5'],
  openai: ['gpt-6-luna', 'gpt-6.1-sol', 'gpt-6-astra'],
  gemini: ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-4-argon'],
  groq: ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'openai/gpt-oss-120b'],
  openrouter: ['google/gemma-4-26b-a4b-it:free', 'google/gemma-4-31b-it:free', 'nvidia/nemotron-3-super-120b-a12b:free'],
}

describe('the three models of each provider', () => {
  test.each(Object.entries(OFFICIAL))('%s offers the three official model IDs, fast then balanced then strong', (id, ids) => {
    const preset = PROVIDER_PRESETS.find((p) => p.id === id)
    expect(preset.models.map((model) => model.id)).toEqual(ids)
    expect(preset.models.map((model) => model.tier)).toEqual(['fast', 'balanced', 'strong'])
  })

  test('every model has a label and a vision flag', () => {
    for (const preset of PROVIDER_PRESETS.filter((p) => p.models)) {
      for (const model of preset.models) {
        expect(model.label.length, model.id).toBeGreaterThan(3)
        expect(typeof model.vision, model.id).toBe('boolean')
      }
    }
  })

  test('the default model of a provider is its balanced model, and the provider vision flag follows it', () => {
    for (const preset of PROVIDER_PRESETS.filter((p) => p.models)) {
      const balanced = preset.models.find((model) => model.tier === 'balanced')
      expect(preset.model, preset.id).toBe(balanced.id)
      expect(preset.vision, preset.id).toBe(balanced.vision)
    }
  })

  test('the custom provider has no list', () => {
    expect(PROVIDER_PRESETS.find((p) => p.id === 'custom').models).toBeUndefined()
  })

  test('vision: Claude, GPT and Gemini read images, Groq does not, and only the Gemma models of OpenRouter do', () => {
    const vision = (id) => PROVIDER_PRESETS.find((p) => p.id === id).models.map((model) => model.vision)
    expect(vision('anthropic')).toEqual([true, true, true])
    expect(vision('openai')).toEqual([true, true, true])
    expect(vision('gemini')).toEqual([true, true, true])
    expect(vision('groq')).toEqual([false, false, false])
    expect(vision('openrouter')).toEqual([true, true, false])
  })

  test('choosing a provider starts with its balanced model', () => {
    const next = applyPreset(loadSettings(), 'openai')
    expect(next.provider.model).toBe('gpt-6.1-sol')
  })
})

describe('saved names that are not in the documentation any more', () => {
  const save = (providerId, model) =>
    localStorage.setItem('tmtf.settings.v1', JSON.stringify({ providerId, provider: { baseUrl: 'https://x/v1', model, vision: true }, rememberKey: false }))

  test.each([
    ['openai', 'gpt-5.6-luna', 'gpt-6-luna'],
    ['openai', 'gpt-5.6-terra', 'gpt-6.1-sol'],
    ['openai', 'gpt-5.6-sol', 'gpt-6.1-sol'],
    ['openai', 'gpt-5.4-mini', 'gpt-6-luna'],
    ['openai', 'gpt-5.4-nano', 'gpt-6-luna'],
    ['openrouter', 'meta-llama/llama-3.3-70b-instruct:free', 'google/gemma-4-31b-it:free'],
  ])('%s %s moves to %s', (providerId, model, expected) => {
    save(providerId, model)
    expect(loadSettings().provider.model).toBe(expected)
  })

  test('a name that the user typed and that is not known is kept', () => {
    save('custom', 'my-own-model')
    expect(loadSettings().provider.model).toBe('my-own-model')
  })
})
