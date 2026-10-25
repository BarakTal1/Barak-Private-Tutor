import { useEffect, useId, useRef } from 'react'
import { useStrings } from './i18n.jsx'
import { CloseIcon } from './icons.jsx'

const DRAWER = {
  start: 'inset-y-0 start-0 animate-[slide-in-start_400ms_var(--ease-drawer)_both]',
  end: 'inset-y-0 end-0 animate-[slide-in-end_400ms_var(--ease-drawer)_both]',
}
// A sheet comes up from the bottom on a phone and sits at the side on a wider screen.
const SHEET = {
  start:
    'inset-x-0 bottom-0 max-h-[85dvh] rounded-t-card animate-[sheet-up_400ms_var(--ease-drawer)_both] md:inset-x-auto md:inset-y-0 md:start-0 md:max-h-none md:rounded-none md:animate-[slide-in-start_400ms_var(--ease-drawer)_both]',
  end: 'inset-x-0 bottom-0 max-h-[85dvh] rounded-t-card animate-[sheet-up_400ms_var(--ease-drawer)_both] md:inset-x-auto md:inset-y-0 md:end-0 md:max-h-none md:rounded-none md:animate-[slide-in-end_400ms_var(--ease-drawer)_both]',
}

// A panel above the page. It closes with Escape, with the close button and with a click outside.
// The start side is the right in Hebrew and the end side is the left.
export default function Drawer({ title, side = 'end', sheet = false, footer, onClose, children }) {
  const he = useStrings()
  const titleId = useId()
  const panel = useRef(null)
  const close = useRef(onClose)
  useEffect(() => {
    close.current = onClose
  })

  useEffect(() => {
    const opener = document.activeElement
    panel.current.focus()
    const onKey = (event) => event.key === 'Escape' && close.current()
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      opener?.focus?.()
    }
  }, [])

  return (
    <div
      data-overlay
      className="fixed inset-0 z-40 animate-[fade-in_250ms_ease-out_both] bg-ink/40 motion-reduce:animate-none"
      onClick={onClose}
    >
      <aside
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className={`fixed z-50 flex w-full max-w-md flex-col bg-surf shadow-card outline-none motion-reduce:animate-none ${sheet ? SHEET[side] : DRAWER[side]}`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id={titleId} className="text-xl font-bold">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label={he.common.close} className="grid size-11 place-items-center rounded-full hover:bg-surf2">
            <CloseIcon />
          </button>
        </header>
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <footer className="border-t border-line px-5 py-4">{footer}</footer>}
      </aside>
    </div>
  )
}
