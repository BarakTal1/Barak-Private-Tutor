import { useRef, useState } from 'react'
import { MAX_FILE_BYTES } from '../../shared/limits.js'
import { transcribePages } from '../ai/client.js'
import { useSettings } from '../ai/SettingsProvider.jsx'
import { ParseError } from '../ingest/errors.js'
import { checkFile, ingestFile } from '../ingest/index.js'
import { useLesson } from '../lesson/LessonProvider.jsx'
import Button from './Button.jsx'
import Card from './Card.jsx'
import ErrorBanner from './ErrorBanner.jsx'
import { fmt } from './he.js'
import { useStrings } from './i18n.jsx'
import { ArrowStartIcon, CloseIcon, FileIcon, InfoIcon, SlidersIcon, UploadIcon } from './icons.jsx'
import { describeError } from './messages.js'
import Screen from './Screen.jsx'
import Spinner from './Spinner.jsx'
import TutorCharacter from './TutorCharacter.jsx'

const MB = 1024 * 1024

const formatSize = (bytes) => (bytes < MB ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / MB).toFixed(1)} MB`)

function StepTitle({ number, children, id }) {
  return (
    <h2 id={id} className="flex items-center gap-3 text-xl font-bold">
      <span className="grid size-8 place-items-center rounded-full bg-p text-base text-on-p">{number}</span>
      {children}
    </h2>
  )
}

function progressText(progress, he) {
  if (progress.stage === 'vision') return fmt(he.setup.readingVision, progress)
  return progress.total > 1 ? fmt(he.setup.readingPages, progress) : he.setup.reading
}

export default function SetupScreen() {
  const he = useStrings()
  const { dispatch } = useLesson()
  const { settings, openPanel } = useSettings()
  const [file, setFile] = useState(null)
  const [problem, setProblem] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState(null)
  const input = useRef(null)
  const busy = progress !== null

  function choose(picked) {
    if (!picked) return
    setError(null)
    setFile(picked)
    try {
      checkFile(picked)
      setProblem(null)
    } catch (err) {
      if (!(err instanceof ParseError)) throw err
      setProblem(err)
    }
  }

  function removeFile() {
    setFile(null)
    setProblem(null)
    setError(null)
    input.current.value = ''
  }

  async function read() {
    setError(null)
    setProgress({ stage: 'reading', done: 0, total: 1 })
    try {
      const ingest = await ingestFile(file, {
        provider: settings.provider,
        transcribe: (pages) => transcribePages({ settings, pages }),
        onProgress: setProgress,
      })
      dispatch({ type: 'ingested', ingest, teacherPrompt: prompt.trim() })
    } catch (err) {
      setError(err)
      setProgress(null)
    }
  }

  const noKey = !settings.key.trim()
  const reason = busy
    ? he.setup.reasonBusy
    : !file || problem
      ? he.setup.reasonNoFile
      : noKey
        ? he.setup.reasonNoKey
        : !settings.provider.model.trim() || !settings.provider.baseUrl.trim()
          ? he.setup.reasonNoModel
          : null

  return (
    <Screen>
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <TutorCharacter mood="encourage" size={64} />
          <button
            type="button"
            onClick={openPanel}
            className="flex min-h-11 items-center gap-2 rounded-full bg-surf px-4 font-medium shadow-card"
          >
            <SlidersIcon size={18} />
            {he.setup.settings}
          </button>
        </div>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{he.appName}</h1>
        <p className="text-lg text-ink2">{he.setup.tagline}</p>
      </header>

      {noKey && (
        <div className="flex flex-col items-start gap-3 rounded-card bg-info-soft p-5 text-info-ink ring-1 ring-info-line">
          <p className="text-lg font-bold">{he.setup.noKeyTitle}</p>
          <p>{he.setup.noKeyBody}</p>
          <Button variant="secondary" onClick={openPanel} className="min-h-11 px-4 text-base">
            {he.setup.openSettings}
          </Button>
        </div>
      )}

      <section aria-labelledby="file-step" className="flex flex-col gap-3">
        <StepTitle number="1" id="file-step">
          {he.setup.fileStep}
        </StepTitle>
        <div
          data-dropzone
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            choose(event.dataTransfer.files[0])
          }}
        >
          <input ref={input} id="file-input" type="file" className="peer sr-only" onChange={(event) => choose(event.target.files[0])} disabled={busy} />
          {file ? (
            <Card className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-ctl bg-p-soft text-p-ink">
                  <FileIcon size={24} />
                </span>
                <div className="min-w-0 flex-1">
                  <p dir="auto" className="truncate font-semibold">{file.name}</p>
                  <p className="text-sm text-ink2">{problem ? formatSize(file.size) : fmt(he.setup.fileReady, { size: formatSize(file.size) })}</p>
                </div>
                <button type="button" onClick={removeFile} disabled={busy} aria-label={he.setup.removeFile} className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-surf2">
                  <CloseIcon />
                </button>
              </div>
              {problem && (
                <div className="flex flex-col gap-3 rounded-ctl bg-hint-soft p-4 text-hint-ink">
                  <p className="flex items-center gap-2 font-semibold">
                    <InfoIcon /> {describeError(problem, he).title}
                  </p>
                  <p>{describeError(problem, he).body}</p>
                  <Button variant="secondary" onClick={() => input.current.click()} className="min-h-11 self-start px-4 text-base">
                    {he.setup.anotherFile}
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            <label
              htmlFor="file-input"
              className={`flex cursor-pointer flex-col items-center gap-3 rounded-card border-2 border-dashed px-4 py-10 text-center transition-colors duration-160 ${dragging ? 'border-p bg-p-soft' : 'border-line-strong bg-surf'} peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-p`}
            >
              <TutorCharacter mood={dragging ? 'cheer' : 'sleepy'} size={64} />
              <span className="flex items-center gap-2 text-lg font-semibold">
                <UploadIcon />
                {dragging ? he.setup.dropOver : he.setup.dropTitle}
              </span>
              <span className="text-sm text-ink2">{fmt(he.setup.dropHint, { size: MAX_FILE_BYTES / MB })}</span>
              <span className="text-sm text-ink2">{he.setup.sleepy}</span>
            </label>
          )}
        </div>
      </section>

      <section aria-labelledby="prompt-step" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <StepTitle number="2" id="prompt-step">
            {he.setup.promptStep}
          </StepTitle>
          <button type="button" onClick={() => setPrompt(he.setup.promptExample)} className="min-h-11 px-2 font-medium text-p-ink underline underline-offset-4">
            {he.setup.tryExample}
          </button>
        </div>
        <label htmlFor="teacher-prompt" className="sr-only">
          {he.setup.promptLabel}
        </label>
        <textarea
          id="teacher-prompt"
          dir="auto"
          rows={4}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={he.setup.promptPlaceholder}
          className="w-full resize-y rounded-card bg-surf p-4 text-lg leading-relaxed shadow-card placeholder:text-ink2/60"
        />
      </section>

      {busy && (
        <p className="flex items-center gap-3 text-ink2">
          <Spinner />
          {progressText(progress, he)}
        </p>
      )}
      {error && <ErrorBanner error={error} onRetry={read} onSettings={openPanel} />}

      <Button disabled={Boolean(reason)} reason={reason} onClick={read} fullWidth>
        {he.setup.next}
        <ArrowStartIcon />
      </Button>
    </Screen>
  )
}
