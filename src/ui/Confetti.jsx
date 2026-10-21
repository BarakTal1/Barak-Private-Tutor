import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './motion.js'

const COLORS = ['var(--acc)', 'var(--p)', 'var(--ok)', 'var(--hint)', 'var(--cheek)', 'var(--bolt-edge)']
const GOLDEN_ANGLE = 137.508

// The same number of particles always flies the same way: the spread comes from the golden angle, not from chance.
function particleStyle(index, durationMs) {
  const angle = (index * GOLDEN_ANGLE * Math.PI) / 180
  const distance = 50 + (index % 7) * 14
  const size = 6 + (index % 3) * 2
  return {
    '--dx': `${Math.round(Math.cos(angle) * distance)}px`,
    '--dy': `${Math.round(Math.sin(angle) * distance - 20)}px`,
    '--rot': `${(index * 47) % 360}deg`,
    width: size,
    height: size * 1.6,
    background: COLORS[index % COLORS.length],
    animationDuration: `${durationMs}ms`,
    animationDelay: `${(index % 5) * 20}ms`,
  }
}

// A burst of small pieces that removes itself. With reduced motion it shows nothing.
export default function Confetti({ count, durationMs, onDone }) {
  const reduced = useReducedMotion()
  const [done, setDone] = useState(false)
  const finish = useRef(onDone)
  useEffect(() => {
    finish.current = onDone
  })
  useEffect(() => {
    const timer = setTimeout(() => {
      setDone(true)
      finish.current?.()
    }, durationMs)
    return () => clearTimeout(timer)
  }, [durationMs])

  if (reduced || done) return null
  return (
    <div data-confetti aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-visible">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          data-particle
          className="absolute start-1/2 top-1/2 rounded-[2px] animate-[confetti-burst_ease-out_both]"
          style={particleStyle(index, durationMs)}
        />
      ))}
    </div>
  )
}
