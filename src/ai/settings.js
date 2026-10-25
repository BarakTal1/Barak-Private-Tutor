// Starting values only. The user can change the address, the model and the vision switch,
// because model names and limits change. Each provider offers three models (fast, balanced, strong).
// The names are the model IDs of the official documentation of each provider on 25 October 2026:
// platform.claude.com (Models overview), developers.openai.com (Models), ai.google.dev (Gemini models),
// console.groq.com (production models) and the live free list of openrouter.ai/api/v1/models.
// A name that is not in the documentation makes a request fail, so do not add a name that you did not check.
const model = (id, tier, label, vision) => ({ id, tier, label, vision })
const preset = (fields, models) => {
  const balanced = models.find((item) => item.tier === 'balanced')
  return { ...fields, model: balanced.id, vision: balanced.vision, models }
}

export const PROVIDER_PRESETS = [
  preset(
    { id: 'anthropic', name: 'Anthropic', baseUrl: 'https://api.anthropic.com/v1', keyUrl: 'https://console.anthropic.com/settings/keys' },
    [
      model('claude-haiku-5-5', 'fast', 'Claude Haiku 5.5', true),
      model('claude-sonnet-5-5', 'balanced', 'Claude Sonnet 5.5', true),
      model('claude-opus-5-5', 'strong', 'Claude Opus 5.5', true),
    ],
  ),
  preset(
    { id: 'openai', name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', keyUrl: 'https://platform.openai.com/api-keys' },
    [
      model('gpt-6-luna', 'fast', 'GPT-6 Luna', true),
      model('gpt-6.1-sol', 'balanced', 'GPT-6.1 Sol', true),
      model('gpt-6-astra', 'strong', 'GPT-6 Astra', true),
    ],
  ),
  preset(
    { id: 'gemini', name: 'Google Gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', keyUrl: 'https://aistudio.google.com/apikey' },
    [
      model('gemini-3.5-flash-lite', 'fast', 'Gemini 3.5 Flash-Lite', true),
      model('gemini-3.8-flash', 'balanced', 'Gemini 3.8 Flash', true),
      model('gemini-4-argon', 'strong', 'Gemini 4 Argon', true),
    ],
  ),
  preset(
    { id: 'groq', name: 'Groq', baseUrl: 'https://api.groq.com/openai/v1', keyUrl: 'https://console.groq.com/keys' },
    [
      model('llama-3.1-8b-instant', 'fast', 'Llama 3.1 8B', false),
      model('llama-3.3-70b-versatile', 'balanced', 'Llama 3.3 70B', false),
      model('openai/gpt-oss-120b', 'strong', 'GPT-OSS 120B', false),
    ],
  ),
  preset(
    { id: 'openrouter', name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1', keyUrl: 'https://openrouter.ai/settings/keys' },
    [
      model('google/gemma-4-26b-a4b-it:free', 'fast', 'Gemma 4 26B (free)', true),
      model('google/gemma-4-31b-it:free', 'balanced', 'Gemma 4 31B (free)', true),
      model('nvidia/nemotron-3-super-120b-a12b:free', 'strong', 'Nemotron 3 Super 120B (free)', false),
    ],
  ),
  { id: 'custom', name: 'Custom', baseUrl: '', model: '', vision: false },
]

// Names that are not in the documentation any more (or that were never in it). A saved setting with one of them
// moves to the closest current model.
const RETIRED_MODELS = {
  'gemini-2.5-flash': 'gemini-3.8-flash',
  'gpt-5.6-luna': 'gpt-6-luna',
  'gpt-5.6-terra': 'gpt-6.1-sol',
  'gpt-5.6-sol': 'gpt-6.1-sol',
  'gpt-5.4-mini': 'gpt-6-luna',
  'gpt-5.4-nano': 'gpt-6-luna',
  'meta-llama/llama-3.3-70b-instruct:free': 'google/gemma-4-31b-it:free',
}

const SETTINGS_KEY = 'tmtf.settings.v1'
const SESSION_KEY = 'tmtf.key.v1'

const providerOf = ({ baseUrl, model, vision }) => ({ baseUrl, model, vision })
const presetById = (id) => PROVIDER_PRESETS.find((preset) => preset.id === id)

const retired = (provider) => (RETIRED_MODELS[provider?.model] ? { model: RETIRED_MODELS[provider.model] } : {})

function defaults() {
  const [first] = PROVIDER_PRESETS
  return { providerId: first.id, provider: providerOf(first), key: '', rememberKey: false }
}

function read(storage, name) {
  try {
    return storage.getItem(name)
  } catch {
    return null
  }
}

export function applyPreset(settings, providerId) {
  const preset = presetById(providerId)
  return preset ? { ...settings, providerId, provider: providerOf(preset) } : settings
}

export function loadSettings() {
  try {
    const saved = JSON.parse(read(localStorage, SETTINGS_KEY))
    if (!presetById(saved?.providerId)) return defaults()
    const rememberKey = saved.rememberKey === true
    return {
      providerId: saved.providerId,
      provider: providerOf({ ...presetById(saved.providerId), ...saved.provider, ...retired(saved.provider) }),
      rememberKey,
      key: (rememberKey ? saved.key : read(sessionStorage, SESSION_KEY)) ?? '',
    }
  } catch {
    return defaults()
  }
}

// The key stays in the browser. With "remember" it is kept on the device. Without it,
// it is kept only for this tab, so a reload in the middle of a lesson does not ask again.
export function saveSettings(settings) {
  const { key, ...rest } = settings
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings.rememberKey ? settings : rest))
    if (settings.rememberKey || !key) sessionStorage.removeItem(SESSION_KEY)
    else sessionStorage.setItem(SESSION_KEY, key)
  } catch {
    // Storage is full or blocked. The settings then just do not survive a reload.
  }
}

export const isReady = ({ key, provider }) =>
  Boolean(key.trim() && provider.baseUrl.trim() && provider.model.trim())
