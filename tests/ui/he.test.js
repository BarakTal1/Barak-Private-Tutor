import { fmt, he } from '../../src/ui/he.js'

function strings(value, path = 'he') {
  if (typeof value === 'string') return [[path, value]]
  if (Array.isArray(value)) return value.flatMap((item, i) => strings(item, `${path}[${i}]`))
  return Object.entries(value).flatMap(([key, item]) => strings(item, `${path}.${key}`))
}

const all = strings(he)

test('no string is empty', () => {
  expect(all.length).toBeGreaterThan(100)
  for (const [path, text] of all) expect(text.trim(), path).not.toBe('')
})

test('praises has 6 different phrases', () => {
  expect(he.praises).toHaveLength(6)
  expect(new Set(he.praises).size).toBe(6)
})

test('no string contains a slash form such as "י/"', () => {
  for (const [path, text] of all) expect(text, path).not.toMatch(/[א-ת]\/[א-ת]/)
})

test('every interface string is Hebrew or a name, number or slot', () => {
  const english = all.filter(([, text]) => /[A-Za-z]{4,}/.test(text.replace(/\{[a-zA-Z]+\}/g, '').replace(/(PDF|Word|ZIP|DOCX|API|AI|MB)/g, '')))
  expect(english).toEqual([])
})

test('every parse error code and unsupported reason has a title and a body', () => {
  for (const code of ['too_large', 'empty', 'nothing_readable', 'corrupt', 'locked']) {
    expect(he.fileErrors[code].title).toBeTruthy()
  }
  for (const reason of ['legacy_office', 'media', 'archive', 'unknown_type']) {
    expect(he.fileErrors.unsupported[reason].body).toBeTruthy()
  }
})

test('every warning code and API error code has a text', () => {
  for (const code of ['rows_capped', 'columns_capped', 'pages_capped', 'vision_off', 'vision_capped', 'no_vision_model', 'text_layer_replaced', 'text_layer_unchecked', 'very_short']) {
    expect(he.warnings[code], code).toBeTruthy()
  }
  for (const code of ['bad_key', 'overloaded', 'rate_limited', 'no_vision', 'network', 'timeout', 'too_large', 'bad_request', 'provider_error']) {
    expect(he.apiErrors[code].title, code).toBeTruthy()
  }
})

test('fmt fills {name} slots and leaves other text alone', () => {
  expect(fmt('שלב {current} מתוך {total}', { current: 3, total: 7 })).toBe('שלב 3 מתוך 7')
  expect(fmt('ללא משתנים', {})).toBe('ללא משתנים')
})

test('fmt keeps a slot that has no value', () => {
  expect(fmt('שלום {name}', {})).toBe('שלום {name}')
})

test('the step counter matches the design text', () => {
  expect(fmt(he.lesson.stepCounter, { current: 3, total: 7 })).toBe('שלב 3 מתוך 7')
})
