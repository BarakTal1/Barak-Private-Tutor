import { LANGUAGES, LANGUAGE_NAMES, useLanguage, useStrings } from './i18n.jsx'

// Two buttons that switch the whole interface between Hebrew and English.
// The names of the languages are written in their own language, so they never change.
export default function LanguageToggle({ className = '' }) {
  const he = useStrings()
  const { language, setLanguage } = useLanguage()
  return (
    <div role="group" aria-label={he.language.toggleLabel} className={`inline-flex rounded-full bg-surf p-1 shadow-card ${className}`}>
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={language === code}
          onClick={() => setLanguage(code)}
          className={`min-h-11 rounded-full px-4 font-medium ${language === code ? 'bg-p text-on-p' : 'text-ink2'}`}
        >
          {LANGUAGE_NAMES[code]}
        </button>
      ))}
    </div>
  )
}
