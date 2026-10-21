const TEXT = { txt: 'txt', md: 'md', markdown: 'md', csv: 'csv', tsv: 'csv', json: 'json', html: 'html', htm: 'html', xml: 'xml', tex: 'tex' }
const CODE = ['py', 'js', 'jsx', 'ts', 'tsx', 'java', 'c', 'cpp', 'h', 'cs', 'go', 'rb', 'php', 'sh', 'css', 'sql', 'swift', 'kt', 'rs']
const OFFICE = { docx: 'docx', pptx: 'pptx', xlsx: 'xlsx', epub: 'epub', odt: 'odf', odp: 'odf', ods: 'odf' }
const IMAGE = { png: 'png', jpg: 'jpg', jpeg: 'jpg', webp: 'webp', gif: 'gif', bmp: 'bmp', heic: 'heic', heif: 'heic' }
const LEGACY_OFFICE = ['doc', 'ppt', 'xls']
const MEDIA = ['mp3', 'm4a', 'wav', 'ogg', 'flac', 'aac', 'wma', 'mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v']
const ARCHIVE = ['zip', 'rar', '7z', 'tar', 'gz', 'tgz']

const message = (kind, reason) => ({ tier: 'message', kind, reason })

function extensionOf(name) {
  const dot = name.lastIndexOf('.')
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : ''
}

function fromExtension(ext) {
  if (ext === 'pdf') return { tier: 'pdf', kind: 'pdf' }
  if (TEXT[ext]) return { tier: 'text', kind: TEXT[ext] }
  if (CODE.includes(ext)) return { tier: 'text', kind: 'code' }
  if (OFFICE[ext]) return { tier: 'office', kind: OFFICE[ext] }
  if (IMAGE[ext]) return { tier: 'image', kind: IMAGE[ext] }
  if (LEGACY_OFFICE.includes(ext)) return message(ext, 'legacy_office')
  if (MEDIA.includes(ext)) return message(ext, 'media')
  if (ARCHIVE.includes(ext)) return message(ext, 'archive')
  return null
}

function fromMimeType(type) {
  if (type === 'application/pdf') return { tier: 'pdf', kind: 'pdf' }
  if (type.startsWith('image/')) {
    const kind = IMAGE[type.slice(6)]
    return kind ? { tier: 'image', kind } : null
  }
  if (type.startsWith('audio/') || type.startsWith('video/')) return message(type, 'media')
  if (type === 'text/plain') return { tier: 'text', kind: 'txt' }
  return null
}

// Decides how a file is read. A file the app cannot read gets a `reason` that the UI turns into text.
export function detectKind({ name, type }) {
  const ext = extensionOf(name)
  return fromExtension(ext) ?? fromMimeType(type ?? '') ?? message(ext || 'unknown', 'unknown_type')
}
