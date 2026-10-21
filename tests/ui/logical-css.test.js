import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Physical direction classes break right-to-left layouts. Use ms-, me-, ps-, pe-, start-, end-.
const PHYSICAL =
  /(?<![\w-])(?:-?(?:ml|mr|pl|pr|left|right|scroll-ml|scroll-mr|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br)-[\w[\]./%-]+|text-left|text-right|float-left|float-right)(?![\w-])/g

function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return /\.(jsx?|css)$/.test(entry.name) ? [path] : []
  })
}

test('the detector finds physical classes', () => {
  expect('className="ml-2 p-2"'.match(PHYSICAL)).toEqual(['ml-2'])
  expect('flex md:pr-4 -mr-1 text-left'.match(PHYSICAL)).toEqual(['pr-4', '-mr-1', 'text-left'])
  expect('left-0 border-r rounded-tl-xl'.match(PHYSICAL)).toEqual(['left-0', 'rounded-tl-xl'])
})

test('the detector accepts logical classes', () => {
  expect('ms-2 me-2 ps-4 pe-4 start-0 end-0 text-start border-s rounded-s-xl'.match(PHYSICAL)).toBeNull()
})

test('no file in src uses a physical direction class', () => {
  const found = sourceFiles('src').flatMap((file) =>
    (readFileSync(file, 'utf8').match(PHYSICAL) ?? []).map((cls) => `${file}: ${cls}`),
  )
  expect(found).toEqual([])
})
