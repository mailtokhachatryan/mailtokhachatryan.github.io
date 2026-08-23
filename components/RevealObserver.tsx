'use client'

import { useEffect } from 'react'

/**
 * Adds `is-in` to every `.reveal` as it enters the viewport.
 *
 * Fail-safe by construction. The hidden state is scoped to `html.reveal-ready`,
 * a class this component sets itself, so content is only ever hidden while
 * something is definitely running to un-hide it. If the bundle fails, an error
 * earlier on the page stops execution, or IntersectionObserver is unavailable,
 * the class is never set and every section renders plainly visible.
 *
 * That matters more than it sounds: hiding real content behind an observer means
 * any case where it doesn't fire — a jumped anchor, an odd zoom level, a
 * screenshot tool, reduced-motion quirks — shows the visitor an empty panel.
 */
export default function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (!nodes.length) return

    const revealAll = () => nodes.forEach((n) => n.classList.add('is-in'))

    // No observer support, or the visitor asked for no motion: show everything.
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      revealAll()
      return
    }

    root.classList.add('reveal-ready')

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -6% 0px' },
    )

    nodes.forEach((n) => io.observe(n))

    /* Backstop: anything still hidden after a few seconds gets shown anyway.
       A visitor should never be left looking at an empty panel because a
       callback didn't fire. */
    const backstop = window.setTimeout(() => {
      revealAll()
      io.disconnect()
    }, 4000)

    return () => {
      window.clearTimeout(backstop)
      io.disconnect()
    }
  }, [])

  return null
}
