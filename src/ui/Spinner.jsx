import { useStrings } from './i18n.jsx'

// A ring that turns. With reduced motion it stays still and the label tells what is happening.
export default function Spinner({ className = 'size-5' }) {
  const he = useStrings()
  return (
    <svg role="status" aria-label={he.common.loading} viewBox="0 0 24 24" fill="none" className={`${className} animate-spin motion-reduce:animate-none`}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity=".25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
