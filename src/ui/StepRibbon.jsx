import Confetti from './Confetti.jsx'
import { useStrings } from './i18n.jsx'
import { CheckIcon } from './icons.jsx'
import { useReducedMotion } from './motion.js'

// "השלב הושלם!" for a moment after a step is done, with a bigger burst than a praise badge.
export default function StepRibbon() {
  const he = useStrings()
  const reduced = useReducedMotion()
  const entrance = reduced
    ? 'animate-[fade-in_200ms_ease-out_both]'
    : 'animate-[pop_400ms_var(--ease-out-soft)_both]'
  return (
    <div className="flex justify-center px-4 pt-3">
      <span role="status" className={`relative inline-flex items-center gap-2 rounded-full bg-ok-soft px-5 py-2 text-lg font-bold text-ok-ink ring-1 ring-ok-line ${entrance}`}>
        <CheckIcon size={22} />
        {he.lesson.stepDone}
        <Confetti count={70} durationMs={1100} />
      </span>
    </div>
  )
}
