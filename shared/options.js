// The choices of the teacher for one lesson. The page and the server both use these lists.
export const LESSON_MINUTES = [5, 10, 15, 30]
export const DIFFICULTIES = ['easy', 'medium', 'challenging']
export const OPTION_LANGUAGES = ['he', 'en']

// `language: null` means that the teacher did not choose. The caller then uses the language of the app.
export const DEFAULT_OPTIONS = { minutes: 15, difficulty: 'medium', language: null }

const pick = (list, value, fallback) => (list.includes(value) ? value : fallback)

// Cleans a value that came from a page or from storage. A value outside its list becomes the default.
// It never throws.
export function normalizeOptions(raw) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  return {
    minutes: pick(LESSON_MINUTES, source.minutes, DEFAULT_OPTIONS.minutes),
    difficulty: pick(DIFFICULTIES, source.difficulty, DEFAULT_OPTIONS.difficulty),
    language: pick(OPTION_LANGUAGES, source.language, DEFAULT_OPTIONS.language),
  }
}
