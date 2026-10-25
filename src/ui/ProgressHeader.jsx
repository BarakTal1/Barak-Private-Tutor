import { stepCounter } from '../lesson/selectors.js'
import { fmt } from './he.js'
import { useStrings } from './i18n.jsx'
import { ArrowEndIcon, ListIcon } from './icons.jsx'
import ProgressPath from './ProgressPath.jsx'

const ICON_BUTTON = 'grid size-11 shrink-0 place-items-center rounded-full bg-surf2 hover:bg-p-soft'

export default function ProgressHeader({ state, onExit, onOutline }) {
  const he = useStrings()
  const { current, total } = stepCounter(state)
  const step = state.plan.steps[state.progress.currentStepIndex]
  return (
    <header className="border-b border-line bg-surf px-4 pb-3 pt-3">
      <div className="mx-auto flex max-w-2xl items-center gap-3">
        <button type="button" onClick={onExit} aria-label={he.lesson.exit} className={ICON_BUTTON}>
          <ArrowEndIcon />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink2">{fmt(he.lesson.stepCounter, { current, total })}</p>
          <h1 dir="auto" className="truncate text-lg font-bold leading-tight">
            {step.title}
          </h1>
        </div>
        <button type="button" onClick={onOutline} aria-label={he.lesson.openOutline} className={ICON_BUTTON}>
          <ListIcon />
        </button>
      </div>
      <div className="mx-auto mt-3 max-w-2xl">
        <ProgressPath steps={state.progress.steps} currentIndex={state.progress.currentStepIndex} />
      </div>
    </header>
  )
}
