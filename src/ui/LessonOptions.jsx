import { DIFFICULTIES, LESSON_MINUTES, OPTION_LANGUAGES } from '../../shared/options.js'
import { fmt } from './he.js'
import { LANGUAGE_NAMES, useStrings } from './i18n.jsx'

function Row({ label, children }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-col gap-1.5">
      <span aria-hidden="true" className="text-sm font-medium text-ink2">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function Choice({ checked, onSelect, children, lang }) {
  return (
    <button
      type="button"
      role="radio"
      lang={lang}
      aria-checked={checked}
      onClick={onSelect}
      className="min-h-11 min-w-16 rounded-ctl px-4 font-medium ring-1 ring-line aria-checked:bg-p-soft aria-checked:text-p-ink aria-checked:ring-2 aria-checked:ring-p"
    >
      {children}
    </button>
  )
}

// The three rows of the "how to teach" step. `value.language` is null until the teacher taps a language.
// While it is null, the row follows `appLanguage`.
export default function LessonOptions({ value, onChange, appLanguage }) {
  const he = useStrings()
  const text = he.setup.options
  const language = value.language ?? appLanguage
  const set = (change) => onChange({ ...value, ...change })
  return (
    <div className="flex flex-col gap-4">
      <Row label={text.lengthLabel}>
        {LESSON_MINUTES.map((minutes) => (
          <Choice key={minutes} checked={value.minutes === minutes} onSelect={() => set({ minutes })}>
            {fmt(text.lengthChoice, { n: minutes })}
          </Choice>
        ))}
      </Row>
      <Row label={text.difficultyLabel}>
        {DIFFICULTIES.map((difficulty) => (
          <Choice key={difficulty} checked={value.difficulty === difficulty} onSelect={() => set({ difficulty })}>
            {text[difficulty]}
          </Choice>
        ))}
      </Row>
      <Row label={text.languageLabel}>
        {OPTION_LANGUAGES.map((code) => (
          <Choice key={code} lang={code} checked={language === code} onSelect={() => set({ language: code })}>
            {LANGUAGE_NAMES[code]}
          </Choice>
        ))}
      </Row>
    </div>
  )
}
