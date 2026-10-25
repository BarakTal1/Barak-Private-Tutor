import { useState } from 'react'
import { useLesson } from '../lesson/LessonProvider.jsx'
import { hintLevelFor, passagesFor, praiseFor, recapBullets } from '../lesson/selectors.js'
import Button from './Button.jsx'
import Card from './Card.jsx'
import ChatMessage from './ChatMessage.jsx'
import Confetti from './Confetti.jsx'
import { directionOf } from './direction.js'
import { fmt } from './he.js'
import { useStrings } from './i18n.jsx'
import { ArrowEndIcon, CheckIcon, InfoIcon, ListIcon, RefreshIcon } from './icons.jsx'
import { useReducedMotion } from './motion.js'
import Screen from './Screen.jsx'
import SourceSheet from './SourceSheet.jsx'
import TutorCharacter from './TutorCharacter.jsx'

const CONFETTI_MS = 2200
const RISE = 'animate-[rise_500ms_var(--ease-out-soft)_both]'

function Stat({ label, value }) {
  return (
    <div className="flex flex-1 flex-col items-center rounded-card bg-surf p-4 shadow-card">
      <dd className="text-3xl font-extrabold text-p-ink">{value}</dd>
      <dt className="text-sm text-ink2">{label}</dt>
    </div>
  )
}

// The whole chat again, to read. It has no answer box.
function ChatReview({ state, onBack }) {
  const he = useStrings()
  const [sourceOf, setSourceOf] = useState(null)
  const sourceMessage = state.messages.find((message) => message.id === sourceOf)
  return (
    <Screen>
      <header className="flex items-center gap-3">
        <Button variant="secondary" onClick={onBack}>
          <ArrowEndIcon />
          {he.common.back}
        </Button>
        <h1 className="text-xl font-bold">{he.lesson.chatLabel}</h1>
      </header>
      <div className="flex flex-col gap-5 rounded-card bg-chat p-4">
        {state.messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            praise={praiseFor(state, message.id)}
            hintLevel={hintLevelFor(state, message.id)}
            isLast={false}
            streaming={false}
            dir={directionOf(state.plan.language)}
            onSource={setSourceOf}
          />
        ))}
      </div>
      {sourceMessage && <SourceSheet passages={passagesFor(state, sourceMessage)} onClose={() => setSourceOf(null)} />}
    </Screen>
  )
}

export default function CompleteScreen() {
  const he = useStrings()
  const { state, dispatch } = useLesson()
  const reduced = useReducedMotion()
  const [reviewing, setReviewing] = useState(false)
  if (reviewing) return <ChatReview state={state} onBack={() => setReviewing(false)} />

  const bullets = recapBullets(state.plan)
  const done = state.progress.steps.filter((step) => step.status === 'done').length
  return (
    <Screen>
      <header className="relative flex flex-col items-center gap-3 pt-4 text-center">
        <TutorCharacter mood="dance" size={120} />
        <h1 className="text-3xl font-extrabold">{he.complete.title}</h1>
        <p className="text-lg text-ink2">{fmt(he.complete.steps, { done, total: state.plan.steps.length })}</p>
        <Confetti count={90} durationMs={CONFETTI_MS} />
      </header>

      {bullets.length > 0 && (
        <Card {...(reduced ? {} : { 'data-rise': true })} className={reduced ? '' : RISE}>
          <h2 className="mb-3 text-lg font-bold">{he.complete.recapTitle}</h2>
          <ul aria-label={he.complete.recapTitle} className="flex flex-col gap-3">
            {bullets.map((bullet, index) => (
              <li
                key={bullet}
                data-bullet
                dir="auto"
                style={reduced ? undefined : { animationDelay: `${index * 60}ms` }}
                className={`flex items-start gap-3 ${reduced ? '' : RISE}`}
              >
                <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-ok-soft text-ok-ink">
                  <CheckIcon size={16} />
                </span>
                {bullet}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <dl className="flex gap-3">
        <Stat label={he.complete.attempts} value={state.stats.attempts} />
        <Stat label={he.complete.hints} value={state.stats.hints} />
      </dl>

      {state.parkedQuestions.length > 0 && (
        <div className="flex flex-col gap-2 rounded-card bg-info-soft p-5 text-info-ink ring-1 ring-info-line">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <InfoIcon /> {he.complete.parkedTitle}
          </h2>
          <ul className="flex flex-col gap-1">
            {state.parkedQuestions.map((question) => (
              <li key={question} dir="auto" className="font-medium">
                {question}
              </li>
            ))}
          </ul>
          <p>{he.complete.parkedBody}</p>
        </div>
      )}

      <p className="text-center text-ink2">{he.complete.effort}</p>

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => setReviewing(true)}>
          <ListIcon />
          {he.complete.viewChat}
        </Button>
        <Button onClick={() => dispatch({ type: 'reset' })} className="flex-1">
          <RefreshIcon />
          {he.complete.newLesson}
        </Button>
      </div>
    </Screen>
  )
}
