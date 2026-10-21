import { useEffect, useRef, useState } from 'react'
import { useSettings } from '../ai/SettingsProvider.jsx'
import { useLesson } from '../lesson/LessonProvider.jsx'
import { currentStep, hintLevelFor, passagesFor, praiseFor } from '../lesson/selectors.js'
import { MAX_HINT_LEVEL } from '../lesson/progress.js'
import Button from './Button.jsx'
import ChatMessage from './ChatMessage.jsx'
import Composer from './Composer.jsx'
import { directionOf } from './direction.js'
import ErrorBanner from './ErrorBanner.jsx'
import { he } from './he.js'
import OutlineDrawer from './OutlineDrawer.jsx'
import ProgressHeader from './ProgressHeader.jsx'
import SourceSheet from './SourceSheet.jsx'
import StepRibbon from './StepRibbon.jsx'
import { useDelayed } from './useDelayed.js'
import { useTutor } from './useTutor.js'
import { useViewportHeight } from './useViewportHeight.js'

const SLOW_MS = 4000
const RIBBON_MS = 1500
const NEAR_BOTTOM_PX = 120

// Shows the ribbon for a moment each time the lesson moves to a new step.
function useStepRibbon(stepIndex) {
  const [visible, setVisible] = useState(false)
  const previous = useRef(stepIndex)
  useEffect(() => {
    if (stepIndex <= previous.current) {
      previous.current = stepIndex
      return undefined
    }
    previous.current = stepIndex
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), RIBBON_MS)
    return () => clearTimeout(timer)
  }, [stepIndex])
  return visible
}

export default function LessonScreen() {
  const { state, dispatch } = useLesson()
  const { openPanel } = useSettings()
  const tutor = useTutor()
  const [sourceOf, setSourceOf] = useState(null)
  const [outlineOpen, setOutlineOpen] = useState(false)
  const height = useViewportHeight()
  const log = useRef(null)
  const stickToEnd = useRef(true)
  const begun = useRef(null)

  const { plan, progress, messages, streaming, error } = state
  const step = currentStep(state)
  const last = messages.at(-1)
  const stepHasTutor = messages.some((m) => m.role === 'tutor' && m.stepId === step.id)
  const waitingForFirstWord = streaming && last?.role === 'tutor' && !last.text
  const slow = useDelayed(waitingForFirstWord, SLOW_MS)
  const ribbon = useStepRibbon(progress.currentStepIndex)
  const dir = directionOf(plan.language)
  const hintLevel = progress.steps[progress.currentStepIndex].hintLevel
  const idle = !streaming && !error
  // The step has no answer of the tutor yet, or the last word is the student's: the turn did not finish.
  const unanswered = idle && (!stepHasTutor || last?.role === 'student')

  // A step begins by itself, once. A reload or a stop does not start it again: the student gets a Retry.
  useEffect(() => {
    if (!unanswered || stepHasTutor || begun.current === step.id) return
    begun.current = step.id
    tutor.begin()
  }, [unanswered, stepHasTutor, step.id, tutor])

  useEffect(() => {
    if (stickToEnd.current) log.current?.scrollTo?.({ top: log.current.scrollHeight })
  }, [messages, streaming, error, height, ribbon])

  const exit = () => {
    if (!window.confirm(he.lesson.exitConfirm)) return
    tutor.stop()
    dispatch({ type: 'reset' })
  }

  const sourceMessage = messages.find((message) => message.id === sourceOf)
  return (
    <div data-lesson className="fixed inset-0 flex h-dvh flex-col bg-bg" style={height ? { height } : undefined}>
      <ProgressHeader state={state} onExit={exit} onOutline={() => setOutlineOpen(true)} />
      {ribbon && <StepRibbon />}
      <div
        ref={log}
        role="log"
        aria-live="polite"
        aria-label={he.lesson.chatLabel}
        onScroll={(event) => {
          const { scrollHeight, scrollTop, clientHeight } = event.currentTarget
          stickToEnd.current = scrollHeight - scrollTop - clientHeight < NEAR_BOTTOM_PX
        }}
        className="flex-1 overflow-y-auto bg-chat px-4 py-5"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-5">
          <p className="text-center text-sm text-ink2">
            {he.lesson.from} <bdi>{state.fileName}</bdi>
            {plan.language && (
              <>
                {' · '}
                <bdi>{plan.language}</bdi>
              </>
            )}
          </p>
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              praise={praiseFor(state, message.id)}
              hintLevel={hintLevelFor(state, message.id)}
              isLast={index === messages.length - 1}
              streaming={streaming}
              slow={slow}
              dir={dir}
              onSource={setSourceOf}
              onContinue={tutor.resume}
            />
          ))}
          {unanswered && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-surf p-4 shadow-card">
              <p>{he.lesson.retryTurn}</p>
              <Button variant="secondary" onClick={tutor.retry} className="min-h-11 px-4 text-base">
                {he.common.retry}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-line bg-surf">
        <div className="mx-auto max-w-2xl">
          {error && <ErrorBanner error={error} onRetry={tutor.retry} onSettings={openPanel} className="m-3 mb-0" />}
          <Composer streaming={streaming} hintLevel={hintLevel} maxHints={MAX_HINT_LEVEL} onSend={tutor.send} onStop={tutor.stop} onHint={tutor.hint} />
        </div>
      </div>
      {sourceMessage && <SourceSheet passages={passagesFor(state, sourceMessage)} onClose={() => setSourceOf(null)} />}
      {outlineOpen && <OutlineDrawer plan={plan} progress={progress} onClose={() => setOutlineOpen(false)} />}
    </div>
  )
}
