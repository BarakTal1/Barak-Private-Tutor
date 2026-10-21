import { fmt, he } from './he.js'

const MB = 1024 * 1024

// Turns an error into Hebrew text. `action: 'settings'` means the text should offer the settings.
// It accepts a ParseError, an ApiClientError, or the { code, message } object kept in the lesson state.
export function describeError(error) {
  const { code, params } = error ?? {}
  if (error?.name === 'ParseError') {
    if (code === 'too_large') {
      return {
        title: he.fileErrors.too_large.title,
        body: fmt(he.fileErrors.too_large.body, { size: Math.round(params.limit / MB) }),
      }
    }
    if (code === 'unsupported') {
      const { title, body } = he.fileErrors.unsupported[params.reason] ?? he.fileErrors.unsupported.unknown_type
      return { title, body }
    }
    if (code === 'nothing_readable') {
      const { title, body, bodyVisionOff } = he.fileErrors.nothing_readable
      return params.visionOff ? { title, body: bodyVisionOff, action: 'settings' } : { title, body }
    }
    if (he.fileErrors[code]) return { title: he.fileErrors[code].title, body: he.fileErrors[code].body }
  }
  const api = he.apiErrors[code] ?? he.apiErrors.provider_error
  return api.action ? { title: api.title, action: 'settings' } : { title: api.title }
}

export function describeWarning({ code, params }) {
  const template = he.warnings[code]
  if (!template) return ''
  const values = { ...params }
  if (Array.isArray(params.pages)) values.pages = params.pages.join(', ')
  return fmt(template, values)
}
