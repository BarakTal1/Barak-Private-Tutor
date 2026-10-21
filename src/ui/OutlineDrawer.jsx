import Chip from './Chip.jsx'
import Drawer from './Drawer.jsx'
import { he } from './he.js'
import { CheckIcon } from './icons.jsx'

function stateOf(status, isCurrent) {
  if (status === 'done') return { tone: 'ok', label: he.lesson.outlineDone, icon: <CheckIcon size={16} /> }
  return isCurrent ? { tone: 'primary', label: he.lesson.outlineCurrent } : { tone: 'neutral', label: he.lesson.outlineNext }
}

// The map of the lesson: every step and where the student is.
export default function OutlineDrawer({ plan, progress, onClose }) {
  return (
    <Drawer title={he.lesson.outline} side="end" onClose={onClose}>
      <ol className="flex flex-col gap-3">
        {plan.steps.map((step, index) => {
          const isCurrent = index === progress.currentStepIndex
          const { tone, label, icon } = stateOf(progress.steps[index].status, isCurrent)
          return (
            <li
              key={step.id}
              aria-current={isCurrent && progress.steps[index].status !== 'done' ? 'step' : undefined}
              className="flex items-center justify-between gap-3 rounded-ctl bg-surf2 p-4"
            >
              <span dir="auto" className="font-medium">{step.title}</span>
              <Chip tone={tone} icon={icon}>
                {label}
              </Chip>
            </li>
          )
        })}
      </ol>
    </Drawer>
  )
}
