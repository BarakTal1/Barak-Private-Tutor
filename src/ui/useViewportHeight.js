import { useEffect, useState } from 'react'

// The height that the user can see. On a phone it gets smaller when the keyboard opens,
// so the answer box stays above the keyboard. It is null where the browser has no such value.
export function useViewportHeight() {
  const [height, setHeight] = useState(() => window.visualViewport?.height ?? null)
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return undefined
    const update = () => setHeight(Math.round(viewport.height))
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
    }
  }, [])
  return height
}
