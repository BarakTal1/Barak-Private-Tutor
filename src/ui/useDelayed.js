import { useEffect, useState } from 'react'

// Turns true when `active` has been true for `ms` milliseconds. It is used to say
// "the server is waking up" only when a wait is long.
export function useDelayed(active, ms) {
  const [late, setLate] = useState(false)
  useEffect(() => {
    if (!active) {
      setLate(false)
      return undefined
    }
    const timer = setTimeout(() => setLate(true), ms)
    return () => clearTimeout(timer)
  }, [active, ms])
  return late
}
