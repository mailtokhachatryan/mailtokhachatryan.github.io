'use client'

import { useEffect, useRef } from 'react'

/**
 * A 1px reading-progress line pinned to the top edge.
 *
 * The previous site had one in four gradient colours; this is a single mint
 * hairline, because its job is to tell you how far down a long page you are,
 * not to be looked at. Width is written straight to the style on a rAF so it
 * never triggers a React render while scrolling.
 */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let queued = false
    const update = () => {
      queued = false
      const el = bar.current
      if (!el) return
      const max =
        document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0
      el.style.transform = `scaleX(${(pct / 100).toFixed(4)})`
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div className="scroll-progress" ref={bar} aria-hidden="true" />
}
