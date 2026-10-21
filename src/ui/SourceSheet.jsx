import Drawer from './Drawer.jsx'
import { he } from './he.js'
import Markdown from './Markdown.jsx'

// The part of the file behind a tutor message. It keeps the language and direction of the file.
export default function SourceSheet({ passages, onClose }) {
  return (
    <Drawer title={he.lesson.source} side="start" sheet onClose={onClose}>
      <p className="text-sm text-ink2">{he.lesson.sourceNote}</p>
      {passages.length === 0 && <p>{he.lesson.sourceEmpty}</p>}
      {passages.map((passage) => (
        <section key={passage.id} data-passage dir="auto" className="rounded-ctl bg-surf2 p-4">
          <h3 className="mb-2 text-sm font-bold text-p-ink">{passage.label}</h3>
          <Markdown text={passage.text} />
        </section>
      ))}
    </Drawer>
  )
}
