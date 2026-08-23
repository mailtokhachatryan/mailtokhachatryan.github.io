'use client'

import { useEffect, useRef, useState } from 'react'

/** Timings carried over from the original site so the cadence feels the same. */
const TYPE_MS = 55
const DELETE_MS = 25
const HOLD_MS = 2000
const GAP_MS = 400

export default function Typewriter({
  phrases,
  /** Read by assistive tech instead of the animating text. */
  label,
}: {
  phrases: string[]
  label: string
}) {
  const [text, setText] = useState('')
  const [reduced, setReduced] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    // Reduced motion gets the first phrase, printed and left alone.
    if (reduced) {
      setText(phrases[0])
      return
    }

    let phrase = 0
    let chars = 0
    let deleting = false
    let cancelled = false

    const step = () => {
      if (cancelled) return
      const current = phrases[phrase]

      if (!deleting) {
        chars++
        setText(current.slice(0, chars))
        if (chars >= current.length) {
          deleting = true
          timer.current = setTimeout(step, HOLD_MS)
          return
        }
        timer.current = setTimeout(step, TYPE_MS)
      } else {
        chars--
        setText(current.slice(0, chars))
        if (chars <= 0) {
          deleting = false
          phrase = (phrase + 1) % phrases.length
          timer.current = setTimeout(step, GAP_MS)
          return
        }
        timer.current = setTimeout(step, DELETE_MS)
      }
    }

    timer.current = setTimeout(step, GAP_MS)

    return () => {
      cancelled = true
      if (timer.current) clearTimeout(timer.current)
    }
  }, [phrases, reduced])

  return (
    <p className="hero-type mono">
      <span className="hero-prompt" aria-hidden="true">
        ~ ❯
      </span>
      {/* The animated text is hidden from assistive tech — announcing every
          keystroke would be unusable — and a stable label carries the meaning. */}
      <span aria-hidden="true">
        {text}
        <span className="type-caret" />
      </span>
      <span className="sr-only">{label}</span>
    </p>
  )
}
