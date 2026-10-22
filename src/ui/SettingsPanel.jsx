import { useId, useState } from 'react'
import { PROVIDER_PRESETS, applyPreset } from '../ai/settings.js'
import { useSettings } from '../ai/SettingsProvider.jsx'
import Button from './Button.jsx'
import Drawer from './Drawer.jsx'
import { he } from './he.js'
import { EyeIcon, EyeOffIcon, LockIcon } from './icons.jsx'

const FIELD = 'h-12 w-full rounded-ctl bg-surf2 px-4 text-base text-ink ring-1 ring-line placeholder:text-ink2/60'

function Field({ label, children }) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink2">
        {label}
      </label>
      {children(id)}
    </div>
  )
}

function Switch({ checked, onChange, label, hint }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex min-h-14 items-center justify-between gap-4 rounded-ctl bg-surf2 px-4 py-2 text-start ring-1 ring-line"
    >
      <span className="flex flex-col">
        <span className="font-medium">{label}</span>
        <span className="text-sm text-ink2">{hint}</span>
      </span>
      <span aria-hidden="true" className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-160 ${checked ? 'bg-p' : 'bg-line-strong'}`}>
        <span className={`size-5 rounded-full bg-surf shadow transition-transform duration-160 ${checked ? '-translate-x-5' : ''}`} />
      </span>
    </button>
  )
}

// The panel opens from the end side of the page (the left in Hebrew).
export default function SettingsPanel({ onClose }) {
  const { settings, update } = useSettings()
  const [showKey, setShowKey] = useState(false)
  const activePreset = PROVIDER_PRESETS.find((preset) => preset.id === settings.providerId)
  const setProvider = (change) => update((s) => ({ ...s, provider: { ...s.provider, ...change } }))

  return (
    <Drawer
      title={he.settings.title}
      side="end"
      onClose={onClose}
      footer={
        <Button onClick={onClose} fullWidth>
          {he.common.save}
        </Button>
      }
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink2">{he.settings.provider}</span>
        <div className="flex flex-wrap gap-2">
          {PROVIDER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              aria-pressed={settings.providerId === preset.id}
              onClick={() => update((s) => applyPreset(s, preset.id))}
              className="min-h-11 rounded-full px-4 font-medium ring-1 ring-line aria-pressed:bg-p aria-pressed:text-on-p aria-pressed:ring-p"
            >
              {preset.id === 'custom' ? he.settings.custom : preset.name}
            </button>
          ))}
        </div>
      </div>

      <Field label={he.settings.baseUrl}>
        {(id) => (
          <input id={id} dir="ltr" value={settings.provider.baseUrl} onChange={(e) => setProvider({ baseUrl: e.target.value })} className={FIELD} placeholder="https://" autoComplete="off" spellCheck={false} />
        )}
      </Field>
      <Field label={he.settings.model}>
        {(id) => (
          <input id={id} dir="ltr" value={settings.provider.model} onChange={(e) => setProvider({ model: e.target.value })} className={FIELD} autoComplete="off" spellCheck={false} />
        )}
      </Field>
      {activePreset?.keyUrl && (
        <a href={activePreset.keyUrl} target="_blank" rel="noreferrer" className="-mt-2 self-start font-medium text-p-ink underline underline-offset-4">
          {he.settings.getKey.replace('{provider}', activePreset.name)}
        </a>
      )}
      <Field label={he.settings.key}>
        {(id) => (
          <div className="relative">
            <input
              id={id}
              dir="ltr"
              type={showKey ? 'text' : 'password'}
              value={settings.key}
              onChange={(e) => update((s) => ({ ...s, key: e.target.value }))}
              className={`${FIELD} pe-14`}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setShowKey((shown) => !shown)}
              aria-label={showKey ? he.settings.hideKey : he.settings.showKey}
              className="absolute inset-y-0 end-1 grid w-11 place-items-center text-ink2"
            >
              {showKey ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        )}
      </Field>

      <Switch checked={settings.provider.vision} onChange={(vision) => setProvider({ vision })} label={he.settings.vision} hint={he.settings.visionHint} />

      <label className="flex min-h-11 cursor-pointer items-center gap-3">
        <input type="checkbox" checked={settings.rememberKey} onChange={(e) => update((s) => ({ ...s, rememberKey: e.target.checked }))} className="size-5 accent-p" />
        <span>{he.settings.remember}</span>
      </label>

      <p className="flex items-start gap-3 rounded-ctl bg-p-soft p-3 text-sm leading-relaxed text-p-ink">
        <LockIcon size={18} className="mt-0.5" />
        <span>{he.settings.privacy}</span>
      </p>
    </Drawer>
  )
}
