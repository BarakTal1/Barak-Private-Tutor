import { fmt } from './he.js'
import { useStrings } from './i18n.jsx'
import { BulbIcon } from './icons.jsx'

// Two lamps. The ones that were used are lit.
export default function HintLamps({ level, max = 2 }) {
  const he = useStrings()
  return (
    <span role="img" aria-label={fmt(he.lesson.hintLevel, { level, max })} className="inline-flex items-center gap-1 text-hint-ink">
      {Array.from({ length: max }, (_, index) => (
        <BulbIcon key={index} filled={index < level} size={18} className={index < level ? '' : 'opacity-40'} />
      ))}
    </span>
  )
}
