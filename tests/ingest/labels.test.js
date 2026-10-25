import { chapterLabel, pageLabel, sheetLabel, slideLabel } from '../../src/ingest/labels.js'

afterEach(() => localStorage.clear())

test('labels are Hebrew when the language is Hebrew', () => {
  localStorage.setItem('tmtf.lang.v1', 'he')
  expect(pageLabel(3)).toBe('עמוד 3')
  expect(slideLabel(2)).toBe('שקופית 2')
  expect(sheetLabel('Data')).toBe('גיליון: Data')
  expect(chapterLabel(4)).toBe('פרק 4')
})

test('labels are English when the language is English', () => {
  localStorage.setItem('tmtf.lang.v1', 'en')
  expect(pageLabel(3)).toBe('Page 3')
  expect(slideLabel(2)).toBe('Slide 2')
  expect(sheetLabel('Data')).toBe('Sheet: Data')
  expect(chapterLabel(4)).toBe('Chapter 4')
})
