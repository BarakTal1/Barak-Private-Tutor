import { fmt } from './he.js'
import { useStrings } from './i18n.jsx'
import { StarIcon } from './icons.jsx'
import { useReducedMotion } from './motion.js'

// A long lesson gets smaller nodes, so the path always fits in one row.
const nodeSize = (total) => (total <= 8 ? 'size-8' : total <= 16 ? 'size-5' : 'size-2.5')

function stateOf(step, index, currentIndex, he) {
  if (step.status === 'done') return { text: he.lesson.outlineDone, done: true }
  return index === currentIndex ? { text: he.lesson.outlineCurrent, current: true } : { text: he.lesson.outlineNext }
}

// The lesson as a path of stars. Done steps have a star, the current step pulses,
// and the line fills from the start side (the right in Hebrew).
export default function ProgressPath({ steps, currentIndex }) {
  const he = useStrings()
  const reduced = useReducedMotion()
  const size = nodeSize(steps.length)
  const big = steps.length <= 8
  return (
    <div
      role="progressbar"
      aria-label={he.lesson.pathLabel}
      aria-valuemin={1}
      aria-valuemax={steps.length}
      aria-valuenow={currentIndex + 1}
      aria-valuetext={fmt(he.lesson.stepCounter, { current: currentIndex + 1, total: steps.length })}
      className="min-w-0 overflow-hidden px-1.5 py-1.5"
    >
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const state = stateOf(step, index, currentIndex, he)
          const last = index === steps.length - 1
          return (
            <li key={index} aria-current={state.current ? 'step' : undefined} className={`flex items-center ${last ? '' : 'flex-1'}`}>
              <span className={`relative grid shrink-0 place-items-center rounded-full ${size} ${state.done ? 'bg-acc text-acc-on' : state.current ? 'bg-p text-on-p' : 'bg-surf text-ink2 ring-2 ring-line-strong'}`}>
                {state.current && !reduced && (
                  <span data-pulse aria-hidden="true" className="absolute inset-0 rounded-full bg-p/40 animate-[pulse-ring_1.8s_ease-out_infinite]" />
                )}
                {state.done && big && <StarIcon filled data-star size={18} className="relative" />}
                {state.done && !big && <span data-star className="size-1.5 rounded-full bg-acc-on" />}
                {state.current && big && <span className="relative text-sm font-bold">{index + 1}</span>}
                <span className="sr-only">{state.text}</span>
              </span>
              {!last && (
                <span aria-hidden="true" className="mx-1 h-1.5 min-w-1 flex-1 overflow-hidden rounded-full bg-line-strong">
                  <span
                    data-fill
                    style={{ width: step.status === 'done' ? '100%' : '0%' }}
                    className={`block h-full bg-acc ${reduced ? '' : 'transition-[width] duration-[600ms] ease-[cubic-bezier(0.77,0,0.175,1)]'}`}
                  />
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
