import { htmlToMarkdown } from '../../src/ingest/html.js'

const convert = (html) => htmlToMarkdown(html)

test('headings become # lines and paragraphs are separated by a blank line', () => {
  expect(convert('<h1>Title</h1><p>First.</p><p>Second.</p>')).toBe('# Title\n\nFirst.\n\nSecond.')
})

test('inline tags are removed and their text is kept', () => {
  expect(convert('<p>A <b>bold</b> and <i>italic</i> word.</p>')).toBe('A bold and italic word.')
})

test('a table becomes a Markdown table', () => {
  const html = '<table><tr><th>Shape</th><th>Sides</th></tr><tr><td>Triangle</td><td>3</td></tr></table>'
  expect(convert(html)).toBe('| Shape | Sides |\n| --- | --- |\n| Triangle | 3 |')
})

test('a pipe inside a cell is escaped', () => {
  expect(convert('<table><tr><td>a|b</td></tr></table>')).toContain('a\\|b')
})

test('lists become dash lines', () => {
  expect(convert('<ul><li>One</li><li>Two</li></ul>')).toBe('- One\n- Two')
  expect(convert('<ol><li>One</li><li>Two</li></ol>')).toBe('1. One\n2. Two')
})

test('script and style content is dropped', () => {
  expect(convert('<style>p{}</style><script>alert(1)</script><p>Hello</p>')).toBe('Hello')
})

test('a br becomes a line break', () => {
  expect(convert('<p>One<br>Two</p>')).toBe('One\nTwo')
})

test('Hebrew text is kept', () => {
  expect(convert('<p dir="rtl">שלום עולם</p>')).toBe('שלום עולם')
})

test('empty html gives an empty string', () => {
  expect(convert('')).toBe('')
  expect(convert('<p>  </p>')).toBe('')
})
