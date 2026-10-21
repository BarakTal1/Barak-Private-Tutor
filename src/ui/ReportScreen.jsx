import { useEffect, useRef, useState } from 'react'
import { requestPlan } from '../ai/client.js'
import { useSettings } from '../ai/SettingsProvider.jsx'
import { useLesson } from '../lesson/LessonProvider.jsx'
import Button from './Button.jsx'
import Card from './Card.jsx'
import Chip from './Chip.jsx'
import ErrorBanner from './ErrorBanner.jsx'
import { fmt, he } from './he.js'
import { AlertIcon, ArrowEndIcon, ArrowStartIcon, CheckIcon, EyeIcon, InfoIcon } from './icons.jsx'
import { describeWarning } from './messages.js'
import Screen from './Screen.jsx'
import TutorCharacter from './TutorCharacter.jsx'
import { useDelayed } from './useDelayed.js'

const PREVIEW_CHARS = 1500
const SLOW_MS = 4000

const METHODS = {
  text: { tone: 'ok', label: he.report.chipText, Icon: CheckIcon },
  vision: { tone: 'primary', label: he.report.chipVision, Icon: EyeIcon },
  skipped: { tone: 'hint', label: he.report.chipSkipped, Icon: InfoIcon },
  failed: { tone: 'error', label: he.report.chipFailed, Icon: AlertIcon },
}

function Planning({ slow }) {
  return (
    <div role="status" className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
      <TutorCharacter mood="think" size={112} />
      <h2 className="text-2xl font-bold">{he.report.planning}</h2>
      <div aria-hidden="true" className="flex w-full max-w-sm flex-col gap-3">
        {['w-full', 'w-5/6', 'w-2/3'].map((width) => (
          <div key={width} className={`h-5 ${width} animate-pulse rounded-full bg-surf2 motion-reduce:animate-none`} />
        ))}
      </div>
      {slow && <p className="max-w-sm text-ink2">{he.report.planningSlow}</p>}
    </div>
  )
}

export default function ReportScreen() {
  const { state, dispatch } = useLesson()
  const { settings, openPanel } = useSettings()
  const { ingest, teacherPrompt } = state
  const [planning, setPlanning] = useState(false)
  const [error, setError] = useState(null)
  const slow = useDelayed(planning, SLOW_MS)
  const request = useRef(null)
  useEffect(() => () => request.current?.abort(), [])

  async function start() {
    setError(null)
    setPlanning(true)
    request.current = new AbortController()
    try {
      const plan = await requestPlan({
        settings,
        teacherPrompt,
        passages: ingest.passages,
        signal: request.current.signal,
      })
      dispatch({ type: 'planReady', plan })
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(err)
      setPlanning(false)
    }
  }

  const text = ingest.passages.map((passage) => passage.text).join('\n\n')
  const preview = text.length > PREVIEW_CHARS ? `${text.slice(0, PREVIEW_CHARS)}…` : text

  return (
    <Screen>
      <header className="flex items-center gap-4">
        <TutorCharacter mood="talk" size={64} />
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold">{he.report.title}</h1>
          <p dir="auto" className="truncate text-ink2">
            {fmt(he.report.summary, { name: ingest.fileName, count: ingest.pages.length })}
          </p>
        </div>
      </header>

      <ul aria-label={he.report.title} className="flex flex-wrap gap-2">
        {ingest.pages.map(({ page, method }) => {
          const { tone, label, Icon } = METHODS[method]
          return (
            <li key={page} className="flex items-center gap-2 rounded-ctl bg-surf py-1.5 ps-3 pe-1.5 shadow-card">
              <span className="text-sm font-medium">{fmt(he.report.page, { number: page })}</span>{' '}
              <Chip tone={tone} icon={<Icon size={16} />}>
                {label}
              </Chip>
            </li>
          )
        })}
      </ul>

      {ingest.warnings.length > 0 && (
        <div role="note" className="flex flex-col gap-2 rounded-card bg-hint-soft p-4 text-hint-ink ring-1 ring-hint-line">
          {ingest.warnings.map((warning) => (
            <p key={`${warning.code}-${JSON.stringify(warning.params)}`} className="flex items-start gap-2">
              <InfoIcon className="mt-1" />
              <span>{describeWarning(warning)}</span>
            </p>
          ))}
        </div>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">{he.report.previewTitle}</h2>
        <Card
          role="region"
          aria-label={he.report.previewTitle}
          dir="auto"
          className="max-h-72 overflow-y-auto whitespace-pre-wrap text-base leading-relaxed"
        >
          {preview}
        </Card>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">{he.report.promptTitle}</h2>
        <Card>
          <p dir="auto" className={teacherPrompt ? '' : 'text-ink2'}>
            {teacherPrompt || he.report.noPrompt}
          </p>
        </Card>
      </section>

      {error && <ErrorBanner error={error} onRetry={start} onSettings={openPanel} />}

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => dispatch({ type: 'reset' })}>
          <ArrowEndIcon />
          {he.report.back}
        </Button>
        <Button onClick={start} className="flex-1">
          {he.report.start}
          <ArrowStartIcon />
        </Button>
      </div>

      {planning && <Planning slow={slow} />}
    </Screen>
  )
}
