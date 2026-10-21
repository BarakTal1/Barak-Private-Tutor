import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

// True when the system asks for less motion. Every animation of the app reads this.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.(QUERY).matches ?? false)
  useEffect(() => {
    const media = window.matchMedia?.(QUERY)
    if (!media) return undefined
    const onChange = (event) => setReduced(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return reduced
}
