import { ApiClientError } from '../../src/ai/client.js'
import { ParseError } from '../../src/ingest/errors.js'
import { describeError, describeWarning } from '../../src/ui/messages.js'
import { he } from '../../src/ui/he.js'

describe('describeError for a file', () => {
  test('too_large names the limit in MB', () => {
    const text = describeError(new ParseError('too_large', 'x', { limit: 25 * 1024 * 1024 }))
    expect(text.title).toBe(he.fileErrors.too_large.title)
    expect(text.body).toContain('25 MB')
  })

  test.each(['legacy_office', 'media', 'archive', 'unknown_type'])('unsupported %s has its own text', (reason) => {
    const text = describeError(new ParseError('unsupported', 'x', { reason }))
    expect(text).toEqual({ title: he.fileErrors.unsupported[reason].title, body: he.fileErrors.unsupported[reason].body })
  })

  test('nothing_readable tells how to fix it when vision is off', () => {
    const off = describeError(new ParseError('nothing_readable', 'x', { visionOff: true }))
    const on = describeError(new ParseError('nothing_readable', 'x', { visionOff: false }))
    expect(off.body).toBe(he.fileErrors.nothing_readable.bodyVisionOff)
    expect(off.action).toBe('settings')
    expect(on.body).toBe(he.fileErrors.nothing_readable.body)
    expect(on.action).toBeUndefined()
  })

  test.each(['empty', 'corrupt', 'locked'])('%s has a title and a body', (code) => {
    expect(describeError(new ParseError(code, 'x'))).toEqual({
      title: he.fileErrors[code].title,
      body: he.fileErrors[code].body,
    })
  })
})

describe('describeError for the server', () => {
  test.each(Object.keys(he.apiErrors))('%s has a title', (code) => {
    const text = describeError(new ApiClientError(code, 'x'))
    expect(text.title).toBe(he.apiErrors[code].title)
    expect(text.action).toBe(he.apiErrors[code].action ? 'settings' : undefined)
  })

  test('an unknown code or an unknown error falls back to the generic text', () => {
    expect(describeError(new ApiClientError('weird', 'x')).title).toBe(he.apiErrors.provider_error.title)
    expect(describeError(new Error('boom')).title).toBe(he.apiErrors.provider_error.title)
  })

  test('a plain error object from the state works too', () => {
    expect(describeError({ code: 'rate_limited', message: 'x' }).title).toBe(he.apiErrors.rate_limited.title)
  })
})

describe('describeWarning', () => {
  test('fills the numbers of the warning', () => {
    expect(describeWarning({ code: 'rows_capped', params: { shown: 200, total: 300 } })).toBe(
      'הטבלה ארוכה, אז קראנו רק את 200 השורות הראשונות מתוך 300.',
    )
  })

  test('writes a list of pages with commas', () => {
    expect(describeWarning({ code: 'vision_off', params: { pages: [2, 3, 7] } })).toContain('עמודים 2, 3, 7')
  })

  test('an unknown code gives no text', () => {
    expect(describeWarning({ code: 'new_code', params: {} })).toBe('')
  })
})
