'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Counts an integer up when it first scrolls into view.
 *
 * Used only on the trace header, where the numbers are the point of the row —
 * a count-up on decorative figures is noise, but here it draws the eye to
 * "9 spans / 5 employers / 7y 2mo" at the moment the waterfall appears.
 *
 * Renders the final value on the server so the number is correct with no JS.
 */
export default function CountUp({
  value,
  suffix = '',
  duration = 900,
}: {
  value: number
  suffix?: string
  duration?: number
}) {
  const [shown, setShown] = useState(value)
  const ref = useRef<HTMLSpanElement>(null)
  const done = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return

    setShown(0)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return
        done.current = true
        io.disconnect()

        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          // Ease-out cubic, so it decelerates onto the final value.
          const eased = 1 - Math.pow(1 - t, 3)
          setShown(Math.round(value * eased))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [value, duration])

  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  )
}
