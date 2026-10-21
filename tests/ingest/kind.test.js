import { detectKind } from '../../src/ingest/kind.js'

const file = (name, type = '') => ({ name, type })

test.each([
  ['lesson.pdf', 'application/pdf', 'pdf', 'pdf'],
  ['notes.docx', '', 'office', 'docx'],
  ['slides.pptx', '', 'office', 'pptx'],
  ['grades.xlsx', '', 'office', 'xlsx'],
  ['book.epub', '', 'office', 'epub'],
  ['essay.odt', '', 'office', 'odf'],
  ['scan.PNG', 'image/png', 'image', 'png'],
  ['photo.jpeg', 'image/jpeg', 'image', 'jpg'],
  ['photo.HEIC', '', 'image', 'heic'],
  ['text.txt', 'text/plain', 'text', 'txt'],
  ['readme.md', '', 'text', 'md'],
  ['data.csv', 'text/csv', 'text', 'csv'],
  ['page.html', 'text/html', 'text', 'html'],
  ['proof.tex', '', 'text', 'tex'],
  ['script.py', '', 'text', 'code'],
  ['archive.v2.final.pdf', '', 'pdf', 'pdf'],
])('%s is read as tier %s', (name, type, tier, kind) => {
  expect(detectKind(file(name, type))).toEqual({ tier, kind })
})

test.each([
  ['old.doc', 'legacy_office'],
  ['old.ppt', 'legacy_office'],
  ['old.xls', 'legacy_office'],
  ['song.mp3', 'media'],
  ['movie.mp4', 'media'],
  ['voice.m4a', 'media'],
  ['bundle.zip', 'archive'],
  ['bundle.7z', 'archive'],
  ['tool.exe', 'unknown_type'],
])('%s gets a message with reason %s', (name, reason) => {
  expect(detectKind(file(name))).toMatchObject({ tier: 'message', reason })
})

test('a file with no extension uses the mime type', () => {
  expect(detectKind(file('scan', 'image/jpeg'))).toEqual({ tier: 'image', kind: 'jpg' })
  expect(detectKind(file('doc', 'application/pdf'))).toEqual({ tier: 'pdf', kind: 'pdf' })
})

test('a file with no extension and an unknown type gets the unknown_type reason', () => {
  expect(detectKind(file('mystery', ''))).toMatchObject({ tier: 'message', reason: 'unknown_type' })
  expect(detectKind(file('mystery', 'application/x-weird'))).toMatchObject({ tier: 'message', reason: 'unknown_type' })
})

test('audio and video mime types get the media reason even without an extension', () => {
  expect(detectKind(file('clip', 'video/mp4'))).toMatchObject({ reason: 'media' })
  expect(detectKind(file('clip', 'audio/mpeg'))).toMatchObject({ reason: 'media' })
})

test('a very long odd file name is handled', () => {
  const name = `${'שיעור 📐 '.repeat(30)}.pdf`
  expect(detectKind(file(name))).toEqual({ tier: 'pdf', kind: 'pdf' })
})

test('a name that is only a dot-file has no extension', () => {
  expect(detectKind(file('.pdf'))).toMatchObject({ tier: 'message', reason: 'unknown_type' })
})
