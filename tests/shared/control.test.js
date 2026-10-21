import { createControlFilter } from '../../shared/control.js'

const line = '<<STATE {"verdict":"wrong","advance":false}>>'

function run(chunks) {
  const filter = createControlFilter()
  const shown = chunks.map((chunk) => filter.push(chunk))
  return { shown, ...filter.finish() }
}

test('push never emits part of the marker when the marker is split across chunks', () => {
  const { shown } = run(['Hello <<ST', 'ATE {"verdict":"correct",', '"advance":true}>>'])
  expect(shown.join('')).toBe('Hello')
  expect(shown.join('')).not.toContain('<')
})

test('finish returns the control object and the visible text without the line', () => {
  const { visible, control } = run(['Not quite.\n', line])
  expect(visible).toBe('Not quite.')
  expect(control).toEqual({ verdict: 'wrong', advance: false })
})

test('finish returns null control when the line is missing', () => {
  const { visible, control } = run(['Just text, ', 'no line.'])
  expect(visible).toBe('Just text, no line.')
  expect(control).toBeNull()
})

test('finish returns null control when the JSON is malformed and still hides the line', () => {
  const { shown, visible, control } = run(['Hi\n<<STATE {"verdict": oops}>>'])
  expect(control).toBeNull()
  expect(visible).toBe('Hi')
  expect(shown.join('')).toBe('Hi')
})

test('finish returns null control for an unknown verdict', () => {
  const { control } = run(['Hi\n<<STATE {"verdict":"great","advance":true}>>'])
  expect(control).toBeNull()
})

test('text with "<<" that is not the marker is shown', () => {
  const { shown, visible } = run(['a << b', ' and c'])
  expect(shown.join('')).toBe('a << b and c')
  expect(visible).toBe('a << b and c')
})

test('a stream cut in the middle of the line hides the partial line', () => {
  const { shown, visible, control } = run(['Hello\n<<STATE {"verd'])
  expect(shown.join('')).toBe('Hello')
  expect(visible).toBe('Hello')
  expect(control).toBeNull()
})

test('a trailing "<" is shown at the end of the stream', () => {
  const { shown, visible } = run(['if a <'])
  expect(shown.join('')).toBe('if a')
  expect(visible).toBe('if a <')
})

test('text streamed one character at a time reaches the same result', () => {
  const full = `One two.\n${line}`
  const { shown, visible, control } = run([...full])
  expect(shown.join('')).toBe('One two.')
  expect(visible).toBe('One two.')
  expect(control.verdict).toBe('wrong')
})
