import { fmt } from './he.js'
import { useStrings } from './i18n.jsx'
import { useReducedMotion } from './motion.js'

// Barak, the tutor: a small lightning bolt. Ported from the design file Tutor.dc.html.
const EYES_X = [39, 60]
const EYES_Y = 46
const MOUTH = { x: 50, y: 55 }
const INK = '#2a1d05'
const BOLT = 'var(--bolt)'
const EDGE = 'var(--bolt-edge)'

const BODY_MOTION = {
  talk: 'tt-bob 2.6s ease-in-out infinite',
  think: 'tt-bob 1.4s ease-in-out infinite',
  cheer: 'tt-jump .7s cubic-bezier(.3,1.5,.5,1) 2',
  encourage: 'tt-breathe 2.6s ease-in-out infinite',
  lean: 'tt-lean 2.8s ease-in-out infinite',
  sleepy: 'tt-breathe 3.4s ease-in-out infinite',
  dance: 'tt-dance .55s ease-in-out infinite',
  still: 'none',
}
const HAPPY = new Set(['cheer', 'dance'])
const SPARKLES = [[14, 14], [88, 60], [24, 82]]

const fromBottom = { transformBox: 'fill-box', transformOrigin: '50% 100%' }
const fromCenter = { transformBox: 'fill-box', transformOrigin: '50% 50%' }

function Arm({ cx, cy, rotate, animation }) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx="4.5"
      ry="8.5"
      fill={BOLT}
      stroke={EDGE}
      strokeWidth="2.5"
      transform={`rotate(${rotate} ${cx} ${cy})`}
      style={animation ? { ...fromBottom, animation } : undefined}
    />
  )
}

function Eyes({ mood, move }) {
  if (HAPPY.has(mood) || mood === 'sleepy') {
    const lift = mood === 'sleepy' ? -5 : 6
    return (
      <g stroke={INK} strokeWidth={mood === 'sleepy' ? 3.2 : 3.6} fill="none" strokeLinecap="round">
        {EYES_X.map((x) => (
          <path key={x} d={`M${x - 6} ${EYES_Y + (mood === 'sleepy' ? 0 : 2)} Q${x} ${EYES_Y - lift} ${x + 6} ${EYES_Y + (mood === 'sleepy' ? 0 : 2)}`} />
        ))}
      </g>
    )
  }
  const look = mood === 'think' ? { dx: -2, dy: -3 } : { dx: 1, dy: 1 }
  return (
    <g style={{ ...fromCenter, animation: move('tt-blink 4.2s infinite') }}>
      {EYES_X.map((x) => (
        <g key={x}>
          <circle cx={x} cy={EYES_Y} r="7" fill="#fff" />
          <circle cx={x + look.dx} cy={EYES_Y + look.dy} r="3.8" fill={INK} />
          <circle cx={x + look.dx + 1.3} cy={EYES_Y + look.dy - 1.3} r="1.3" fill="#fff" />
        </g>
      ))}
    </g>
  )
}

function Mouth({ mood, move }) {
  const { x, y } = MOUTH
  if (mood === 'talk') {
    return (
      <path
        d={`M${x - 8} ${y - 2} Q${x} ${y + 10} ${x + 8} ${y - 2} Z`}
        fill={INK}
        style={{ transformBox: 'fill-box', transformOrigin: '50% 0%', animation: move('tt-talk .3s ease-in-out infinite alternate') }}
      />
    )
  }
  if (HAPPY.has(mood)) return <path d={`M${x - 8} ${y - 3} Q${x} ${y + 10} ${x + 8} ${y - 3} Z`} fill={INK} />
  if (mood === 'think') {
    return <path d={`M${x - 4} ${y + 1} Q${x} ${y - 1} ${x + 5} ${y}`} stroke={INK} strokeWidth="3.2" fill="none" strokeLinecap="round" />
  }
  if (mood === 'sleepy') return <circle cx={x} cy={y + 1} r="2.6" fill={INK} />
  return <path d={`M${x - 7} ${y - 2} Q${x} ${y + 6} ${x + 7} ${y - 2}`} stroke={INK} strokeWidth="3.4" fill="none" strokeLinecap="round" />
}

function Extras({ mood, move }) {
  if (mood === 'think') {
    return [0, 1, 2].map((i) => (
      <circle key={i} data-part="dot" cx={80 + i * 6} cy={18 - i * 5} r={2.2 + i * 0.8} fill={EDGE} style={{ animation: move(`tt-dot 1.2s ${i * 0.2}s ease-in-out infinite`) }} />
    ))
  }
  if (mood === 'sleepy') {
    return (
      <text x="78" y="22" fontSize="16" fontWeight="700" fill={EDGE} style={{ animation: move('tt-z 2.4s ease-in-out infinite') }}>
        z
      </text>
    )
  }
  if (!HAPPY.has(mood)) return null
  return SPARKLES.map(([x, y], i) => (
    <path
      key={i}
      data-part="sparkle"
      d={`M${x} ${y - 6} L${x + 1.6} ${y - 1.6} L${x + 6} ${y} L${x + 1.6} ${y + 1.6} L${x} ${y + 6} L${x - 1.6} ${y + 1.6} L${x - 6} ${y} L${x - 1.6} ${y - 1.6} Z`}
      fill={EDGE}
      style={{ ...fromCenter, animation: move(`tt-spark .9s ${i * 0.25}s ease-in-out infinite`) }}
    />
  ))
}

export default function TutorCharacter({ mood = 'talk', size = 48 }) {
  const he = useStrings()
  const reduced = useReducedMotion()
  const move = (animation) => (reduced ? 'none' : animation)
  const happy = HAPPY.has(mood)
  const waving = mood === 'encourage' || mood === 'lean'
  return (
    <svg
      data-tutor={mood}
      data-motion={reduced ? 'off' : 'on'}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={fmt(he.tutor.label, { mood: he.tutor.moods[mood] })}
      style={{ overflow: 'visible', display: 'block' }}
    >
      <ellipse cx="50" cy="97" rx="20" ry="3" fill="#000" opacity=".1" />
      <g style={{ ...fromBottom, animation: move(BODY_MOTION[mood]) }}>
        {happy ? <Arm cx={16} cy={34} rotate={-35} animation={move('tt-wave .4s ease-in-out infinite')} /> : <Arm cx={12} cy={56} rotate={30} />}
        {happy ? (
          <Arm cx={86} cy={26} rotate={35} animation={move('tt-wave .4s .2s ease-in-out infinite')} />
        ) : waving ? (
          <Arm cx={86} cy={36} rotate={-50} animation={move('tt-wave 1.2s ease-in-out infinite')} />
        ) : (
          <Arm cx={88} cy={44} rotate={-25} />
        )}
        <path d="M63 4 L14 58 L42 58 L31 96 L87 37 L58 37 L73 4 Z" fill={BOLT} stroke={EDGE} strokeWidth="7" strokeLinejoin="round" />
        <path d="M63 12 L52 25" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".6" />
        <circle cx="27" cy="53" r="4.5" fill="var(--cheek)" opacity=".7" />
        <circle cx="71" cy="49" r="4.5" fill="var(--cheek)" opacity=".7" />
        <Eyes mood={mood} move={move} />
        <Mouth mood={mood} move={move} />
      </g>
      <Extras mood={mood} move={move} />
    </svg>
  )
}
