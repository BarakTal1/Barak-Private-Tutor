// Replaces window.matchMedia so a test can say whether the user asked for reduced motion.
export function mockMotionPreference(initial) {
  let matches = initial
  const listeners = new Set()
  vi.stubGlobal('matchMedia', (query) => ({
    media: query,
    get matches() {
      return matches
    },
    addEventListener: (type, listener) => listeners.add(listener),
    removeEventListener: (type, listener) => listeners.delete(listener),
  }))
  return {
    listeners,
    set(value) {
      matches = value
      for (const listener of listeners) listener({ matches })
    },
  }
}
