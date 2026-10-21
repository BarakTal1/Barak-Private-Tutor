import Button from './Button.jsx'
import { he } from './he.js'
import HintLamps from './HintLamps.jsx'
import { ArrowStartIcon, BookIcon, BulbIcon } from './icons.jsx'
import Markdown from './Markdown.jsx'
import PraiseBadge from './PraiseBadge.jsx'
import TutorCharacter from './TutorCharacter.jsx'

const AVATAR = { correct: 'cheer', hint: 'encourage', stuck: 'lean' }
const BUBBLE = {
  correct: 'bg-ok-soft ring-ok-line',
  hint: 'bg-hint-soft ring-hint-line',
  stuck: 'bg-info-soft ring-info-line',
}

function avatarMood({ message, isLast, streaming }) {
  if (!isLast) return 'still'
  if (streaming) return message.text ? 'talk' : 'think'
  return AVATAR[message.mood] ?? 'still'
}

// The words of the interface (a hint title, "waiting...") are Hebrew, whatever the lesson language is.
function BubbleTitle({ children }) {
  return (
    <p dir="rtl" className="mb-2 flex items-center gap-2 font-bold">
      {children}
    </p>
  )
}

export default function ChatMessage({ message, praise, hintLevel, isLast, streaming, slow, dir, onSource, onContinue }) {
  if (message.role === 'student') {
    return (
      <article data-role="student" data-message-id={message.id} className="max-w-[85%] self-end">
        {message.kind === 'hint' ? (
          <p className="flex items-center gap-2 rounded-full bg-hint-soft px-4 py-2 text-hint-ink ring-1 ring-hint-line">
            <BulbIcon size={18} />
            {he.lesson.hintAsked}
          </p>
        ) : (
          <p dir="auto" className="whitespace-pre-wrap rounded-card bg-p px-4 py-3 text-lg leading-relaxed text-on-p shadow-card">
            {message.text}
          </p>
        )}
      </article>
    )
  }

  const waiting = isLast && streaming && !message.text
  const showSource = message.passageIds.length > 0 && message.text && !(isLast && streaming)
  const hintTitle = he.lesson.hintTitles[Number(message.id.slice(1)) % he.lesson.hintTitles.length]
  return (
    <article data-role="tutor" data-message-id={message.id} className="flex max-w-[92%] items-start gap-3 self-start">
      <div className="shrink-0">
        <TutorCharacter mood={avatarMood({ message, isLast, streaming })} size={44} />
      </div>
      <div className="flex min-w-0 flex-col items-start gap-2">
        {message.mood === 'correct' && <PraiseBadge text={he.praises[praise % he.praises.length]} />}
        <div
          data-bubble
          dir={waiting ? undefined : dir}
          className={`rounded-card px-4 py-3 text-lg ring-1 ring-line ${BUBBLE[message.mood] ?? 'bg-surf shadow-card'}`}
        >
          {message.mood === 'hint' && (
            <BubbleTitle>
              <BulbIcon size={20} /> {hintTitle}
              {hintLevel > 0 && <HintLamps level={hintLevel} />}
            </BubbleTitle>
          )}
          {message.mood === 'stuck' && <BubbleTitle>{he.lesson.stuckTitle}</BubbleTitle>}
          {waiting ? (
            <p className="text-ink2">
              {he.lesson.thinking}
              {slow && <span className="mt-1 block text-sm">{he.lesson.waking}</span>}
            </p>
          ) : (
            <Markdown text={message.text} />
          )}
        </div>
        {(showSource || (message.stopped && isLast && !streaming)) && (
          <div className="flex flex-wrap items-center gap-3">
            {showSource && (
              <button
                type="button"
                onClick={() => onSource(message.id)}
                className="flex min-h-11 items-center gap-2 rounded-full bg-surf px-4 text-sm font-medium text-p-ink shadow-card"
              >
                <BookIcon size={16} />
                {he.lesson.source}
              </button>
            )}
            {message.stopped && isLast && !streaming && (
              <>
                <span className="text-sm text-ink2">{he.lesson.stopped}</span>
                <Button variant="secondary" onClick={onContinue} className="min-h-11 px-4 text-base">
                  {he.lesson.continueAnswer}
                  <ArrowStartIcon size={18} />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
