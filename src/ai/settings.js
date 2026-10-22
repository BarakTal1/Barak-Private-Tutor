// Starting values only. The user can change the address, the model and the vision switch,
// because free model names and limits change often.
export const PROVIDER_PRESETS = [
  { id: 'anthropic', name: 'Anthropic', baseUrl: 'https://api.anthropic.com/v1', model: 'claude-sonnet-5-5', vision: true, keyUrl: 'https://console.anthropic.com/settings/keys' },
  { id: 'openai', name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini', vision: true, keyUrl: 'https://platform.openai.com/api-keys' },
  { id: 'gemini', name: 'Google Gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.5-flash', vision: true, keyUrl: 'https://aistudio.google.com/apikey' },
  { id: 'groq', name: 'Groq', baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile', vision: false, keyUrl: 'https://console.groq.com/keys' },
  { id: 'openrouter', name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1', model: 'meta-llama/llama-3.3-70b-instruct:free', vision: false, keyUrl: 'https://openrouter.ai/settings/keys' },
  { id: 'custom', name: 'Custom', baseUrl: '', model: '', vision: false },
]

const SETTINGS_KEY = 'tmtf.settings.v1'
const SESSION_KEY = 'tmtf.key.v1'

const providerOf = ({ baseUrl, model, vision }) => ({ baseUrl, model, vision })
const presetById = (id) => PROVIDER_PRESETS.find((preset) => preset.id === id)

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
      provider: providerOf({ ...presetById(saved.providerId), ...saved.provider }),
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
