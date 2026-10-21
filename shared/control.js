const MARKER = '<<STATE'
const VERDICTS = new Set(['correct', 'partial', 'wrong', 'off_topic'])

// Length of the longest end of `text` that could be the start of the marker.
function heldSuffixLength(text) {
  for (let size = Math.min(MARKER.length - 1, text.length); size > 0; size--) {
    if (MARKER.startsWith(text.slice(-size))) return size
  }
  return 0
}

function parseControl(tail) {
  const match = /^<<STATE\s*(\{[^}]*\})\s*>>/.exec(tail)
  if (!match) return null
  try {
    const { verdict, advance } = JSON.parse(match[1])
    return VERDICTS.has(verdict) && typeof advance === 'boolean' ? { verdict, advance } : null
  } catch {
    return null
  }
}

// The tutor ends each reply with `<<STATE {...}>>`. The filter keeps that line off the screen
// while the text streams, and holds back any end of text that could still turn into the marker.
export function createControlFilter() {
  let raw = ''
  let shown = 0
  return {
    push(chunk) {
      raw += chunk
      const at = raw.indexOf(MARKER)
      const limit = at === -1 ? raw.length - heldSuffixLength(raw) : at
      const end = raw.slice(0, limit).trimEnd().length
      if (end <= shown) return ''
      const delta = raw.slice(shown, end)
      shown = end
      return delta
    },
    finish() {
      const at = raw.indexOf(MARKER)
      if (at === -1) return { visible: raw.trimEnd(), control: null }
      return { visible: raw.slice(0, at).trimEnd(), control: parseControl(raw.slice(at)) }
    },
  }
}
