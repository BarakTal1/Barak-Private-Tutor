import { useStrings } from './i18n.jsx'

// The three models of a provider, as buttons. `value` is the model that is set now.
// A model that the user typed in the field matches no button, and then no button is selected.
export default function ModelChoice({ models, value, onSelect }) {
  const he = useStrings()
  return (
    <div role="radiogroup" aria-label={he.settings.modelChoice} className="flex flex-col gap-1.5">
      <span aria-hidden="true" className="text-sm font-medium text-ink2">
        {he.settings.modelChoice}
      </span>
      <div className="grid gap-2 sm:grid-cols-3">
        {models.map((model) => (
          <button
            key={model.id}
            type="button"
            role="radio"
            aria-checked={value === model.id}
            onClick={() => onSelect(model)}
            className="flex min-h-14 flex-col items-start justify-center gap-0.5 rounded-ctl px-3 py-2 text-start ring-1 ring-line aria-checked:bg-p-soft aria-checked:text-p-ink aria-checked:ring-2 aria-checked:ring-p"
          >
            <span dir="ltr" className="font-medium">{model.label}</span>
            <span className="text-sm text-ink2">{he.settings.tiers[model.tier]}</span>
          </button>
        ))}
      </div>
      <p className="text-sm text-ink2">{he.settings.modelHint}</p>
    </div>
  )
}
