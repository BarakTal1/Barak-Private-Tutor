import { useId, useRef, useState } from 'react'
import { MAX_STUDENT_CHARS } from '../../shared/limits.js'
import Button from './Button.jsx'
import { fmt, he } from './he.js'
import { BulbIcon, SendIcon, StopIcon } from './icons.jsx'

const MAX_HEIGHT_PX = 160

// The answer box. Enter sends, Shift+Enter adds a line, and Send turns into Stop while the tutor answers.
// The box is never blocked: the student can write the next answer while the tutor is still writing.
export default function Composer({ disabled = false, streaming, hintLevel, maxHints = 2, onSend, onStop, onHint }) {
  const [text, setText] = useState('')
  const box = useRef(null)
  const id = useId()
  const trimmed = text.trim()
  const over = text.length - MAX_STUDENT_CHARS
  const canSend = !disabled && trimmed !== '' && over <= 0
  const hintsLeft = hintLevel < maxHints

  function submit() {
    if (!canSend) return
    onSend(trimmed)
    setText('')
    box.current.style.height = ''
  }

  function grow(element) {
    element.style.height = 'auto'
    element.style.height = `${Math.min(element.scrollHeight, MAX_HEIGHT_PX)}px`
  }

  return (
    <form
      className="flex flex-col gap-2 p-3"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      {over > 0 && <p className="text-sm font-medium text-err-ink">{fmt(he.lesson.charsLeft, { count: over })}</p>}
      {!hintsLeft && <p className="text-sm text-ink2 sm:hidden">{he.lesson.noMoreHints}</p>}
      <div className="flex items-end gap-2">
        <Button
          variant="secondary"
          disabled={disabled || streaming || !hintsLeft}
          onClick={onHint}
          className="min-h-12 px-3 text-base"
        >
          <BulbIcon size={20} />
          <span className="sr-only sm:not-sr-only">{hintsLeft ? he.lesson.hint : he.lesson.noMoreHints}</span>
        </Button>
        <label htmlFor={id} className="sr-only">
          {he.lesson.inputLabel}
        </label>
        <textarea
          ref={box}
          id={id}
          dir="auto"
          rows={1}
          value={text}
          disabled={disabled}
          placeholder={he.lesson.inputPlaceholder}
          onChange={(event) => {
            setText(event.target.value)
            grow(event.target)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              submit()
            }
          }}
          className="max-h-40 min-h-12 flex-1 resize-none rounded-ctl bg-surf2 px-4 py-3 text-lg leading-snug ring-1 ring-line placeholder:text-ink2/60 disabled:opacity-50"
        />
        {streaming ? (
          <Button variant="secondary" onClick={onStop} className="min-h-12 px-4 text-base">
            <StopIcon size={18} />
            {he.lesson.stop}
          </Button>
        ) : (
          <Button type="submit" disabled={!canSend} className="min-h-12 px-4 text-base">
            <SendIcon size={18} />
            <span className="sr-only sm:not-sr-only">{he.lesson.send}</span>
          </Button>
        )}
      </div>
    </form>
  )
}
