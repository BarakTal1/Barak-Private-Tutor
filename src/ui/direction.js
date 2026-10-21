const RIGHT_TO_LEFT = /hebrew|עברית|arabic|ערבית|العربية|persian|farsi|פרסית|פארסי|urdu|אורדו|^(he|ar|fa|ur)$/i

// The text direction of a lesson language, as the AI names it ("French", "עברית", "he").
// With no language, each block of text decides by its own first letter.
export function directionOf(language) {
  const name = (language ?? '').trim()
  if (!name) return 'auto'
  return RIGHT_TO_LEFT.test(name) ? 'rtl' : 'ltr'
}
