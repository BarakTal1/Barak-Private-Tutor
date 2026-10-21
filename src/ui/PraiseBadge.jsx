import Confetti from './Confetti.jsx'
import { StarIcon } from './icons.jsx'
import { useReducedMotion } from './motion.js'

// "כל הכבוד!" and the other praise. It pops out with a small burst of confetti.
// With reduced motion it only fades in, and the star and the words carry the meaning.
export default function PraiseBadge({ text }) {
  const reduced = useReducedMotion()
  const entrance = reduced
    ? 'animate-[fade-in_200ms_ease-out_both]'
    : 'animate-[pop_450ms_cubic-bezier(0.34,1.56,0.64,1)_both]'
  return (
    <span className="relative inline-flex self-start">
      <span role="status" className={`inline-flex items-center gap-2 rounded-full bg-acc px-4 py-1.5 text-lg font-extrabold text-acc-on shadow-card ${entrance}`}>
        <StarIcon filled size={22} />
        {text}
      </span>
      <Confetti count={24} durationMs={700} />
    </span>
  )
}
