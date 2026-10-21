import { render, screen } from '@testing-library/react'
import Markdown from '../../src/ui/Markdown.jsx'

const table = '| צורה | צלעות |\n| --- | --- |\n| משולש | 3 |'

test('renders a GFM table inside a scroll wrapper', () => {
  const { container } = render(<Markdown text={table} />)
  expect(screen.getByRole('table')).toBeInTheDocument()
  expect(screen.getAllByRole('columnheader')).toHaveLength(2)
  expect(container.querySelector('table').parentElement.className).toMatch(/overflow-x-auto/)
})

test('renders $x^2$ with KaTeX', () => {
  const { container } = render(<Markdown text="הנוסחה היא $x^2$ כאן" />)
  expect(container.querySelector('.katex')).toBeInTheDocument()
})

test('renders a $$ block formula', () => {
  const { container } = render(<Markdown text={'$$\na^2 + b^2 = c^2\n$$'} />)
  expect(container.querySelector('.katex-display')).toBeInTheDocument()
})

test('renders math written with \\( \\) and \\[ \\] as other models write it', () => {
  const inline = render(<Markdown text={'הנוסחה \\(x^2\\) כאן'} />)
  expect(inline.container.querySelector('.katex')).toBeInTheDocument()
  expect(inline.container.textContent).not.toContain('\\(')
  const block = render(<Markdown text={'\\[a^2 + b^2 = c^2\\]'} />)
  expect(block.container.querySelector('.katex-display')).toBeInTheDocument()
})

test('a formula that is not valid does not break the page', () => {
  const { container } = render(<Markdown text="Bad $\frac{1}{$ formula" />)
  expect(container.textContent).toContain('formula')
})

test('a Hebrew paragraph has dir="auto"', () => {
  const { container } = render(<Markdown text="שלום עולם" />)
  expect(container.querySelector('p')).toHaveAttribute('dir', 'auto')
})

test('headings, list items and table cells have dir="auto"', () => {
  // A heading of the AI is lowered to h3, so a message never has its own page title.
  const { container } = render(<Markdown text={`# כותרת\n\n- פריט\n\n${table}`} />)
  expect(container.querySelector('h1')).toBeNull()
  for (const selector of ['h3', 'li', 'td', 'th']) {
    expect(container.querySelector(selector), selector).toHaveAttribute('dir', 'auto')
  }
})

test('a message that mixes Hebrew, English and LaTeX renders without error', () => {
  const { container } = render(<Markdown text="המשפט **Pythagoras theorem** אומר ש-$a^2+b^2=c^2$ במשולש ישר זווית." />)
  expect(container.querySelector('strong')).toHaveTextContent('Pythagoras theorem')
  expect(container.querySelector('.katex')).toBeInTheDocument()
})

test('images are removed so that a model cannot load a picture from another site', () => {
  const { container } = render(<Markdown text="לפני ![x](https://evil.example/p.png) אחרי" />)
  expect(container.querySelector('img')).toBeNull()
})

test('links show their text and are not clickable', () => {
  const { container } = render(<Markdown text="ראו [האתר](https://evil.example) כאן" />)
  expect(container.querySelector('a')).toBeNull()
  expect(container.textContent).toContain('האתר')
})

test('raw HTML is not run', () => {
  const { container } = render(<Markdown text={'<script>window.hacked = true</script> שלום'} />)
  expect(container.querySelector('script')).toBeNull()
  expect(window.hacked).toBeUndefined()
})

test('empty text renders nothing', () => {
  const { container } = render(<Markdown text="" />)
  expect(container).toBeEmptyDOMElement()
})
