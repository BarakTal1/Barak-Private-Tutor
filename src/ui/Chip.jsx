const TONES = {
  neutral: 'bg-surf2 text-ink2',
  primary: 'bg-p-soft text-p-ink',
  ok: 'bg-ok-soft text-ok-ink',
  hint: 'bg-hint-soft text-hint-ink',
  info: 'bg-info-soft text-info-ink',
  error: 'bg-err-soft text-err-ink',
}

// A small label. The icon and the text carry the meaning, never the color alone.
export default function Chip({ tone = 'neutral', icon, children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${TONES[tone]} ${className}`}>
      {icon}
      {children}
    </span>
  )
}
