import Button from './Button.jsx'
import { he } from './he.js'
import { AlertIcon, InfoIcon, RefreshIcon } from './icons.jsx'
import { describeError } from './messages.js'

// A problem with the file is a notice (yellow), not a fault of the system (red).
// Red is only for faults of the system, such as a wrong key or a lost connection.
export default function ErrorBanner({ error, onRetry, onSettings, className = '' }) {
  const { title, body, action } = describeError(error)
  const notice = error?.name === 'ParseError'
  const tone = notice ? 'bg-hint-soft text-hint-ink ring-hint-line' : 'bg-err-soft text-err-ink ring-err-line'
  const Icon = notice ? InfoIcon : AlertIcon
  return (
    <div role="alert" className={`flex gap-3 rounded-card p-4 ring-1 ${tone} ${className}`}>
      <Icon size={24} className="mt-0.5" />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="font-semibold">{title}</p>
        {body && <p className="text-base">{body}</p>}
        {((action === 'settings' && onSettings) || (onRetry && !notice)) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {action === 'settings' && onSettings && (
              <Button variant="secondary" onClick={onSettings} className="min-h-11 px-4 text-base">
                {he.common.toSettings}
              </Button>
            )}
            {onRetry && !notice && (
              <Button variant="secondary" onClick={onRetry} className="min-h-11 px-4 text-base">
                <RefreshIcon size={18} />
                {he.common.retry}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
