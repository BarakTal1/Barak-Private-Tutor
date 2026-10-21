import { useId } from 'react'
import Spinner from './Spinner.jsx'

const VARIANTS = {
  primary: 'bg-p text-on-p shadow-btn hover:brightness-110 active:translate-y-1 active:shadow-none',
  secondary: 'bg-surf text-ink shadow-card hover:bg-surf2 active:scale-[.97]',
  ghost: 'bg-transparent text-p-ink hover:bg-p-soft active:scale-[.97]',
}

// A disabled button always says why, in text below it.
export default function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  reason,
  type = 'button',
  className = '',
  children,
  ...props
}) {
  const reasonId = useId()
  const showReason = disabled && reason
  return (
    <span className={`flex-col items-stretch gap-2 ${fullWidth ? 'flex w-full' : 'inline-flex'}`}>
      <button
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        aria-describedby={showReason ? reasonId : undefined}
        className={`inline-flex min-h-13 items-center justify-center gap-2 rounded-ctl px-6 text-lg font-semibold transition duration-160 ease-out focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-p disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none ${VARIANTS[variant]} ${className}`}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
      {showReason && (
        <span id={reasonId} className="text-center text-sm text-ink2">
          {reason}
        </span>
      )}
    </span>
  )
}
