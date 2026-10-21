import { readFile } from 'node:fs/promises'
import { File } from 'node:buffer'
import { resolve } from 'node:path'

// Tests run from the project root.
const fixturePath = (name) => resolve(process.cwd(), 'tests/fixtures', name)

// Node's File returns an ArrayBuffer from outside the jsdom realm. The zip code bundled in
// mammoth checks `instanceof ArrayBuffer`, so the bytes are copied into this realm. A browser has one realm.
function inRealm(file) {
  const original = file.arrayBuffer.bind(file)
  file.arrayBuffer = async () => new Uint8Array(await original()).slice().buffer
  return file
}

export async function fixture(name, type = '') {
  return inRealm(new File([await readFile(fixturePath(name))], name, { type }))
}

export const textFile = (content, name = 'file.txt', type = 'text/plain') =>
  inRealm(new File([content], name, { type }))
