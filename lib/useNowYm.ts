'use client'

import { useEffect, useState } from 'react'

/**
 * Current `YYYY-MM`, resolved live in the browser.
 *
 * Everything time-dependent on this page — tenure, the open spans' durations,
 * their bar widths, the copyright year — used to be fixed when the site was
 * built, which meant a redeploy every month just to stay truthful.
 *
 * The build-time value is still what renders first, so the server HTML, a
 * crawler, and a visitor with JavaScript off all see a correct figure. After
 * mount this swaps in the real clock. Returning `initial` on the first client
 * render is deliberate: computing the date during render would disagree with
 * the server HTML and trip a hydration mismatch.
 */
export function useNowYm(initial: string): string {
  const [ym, setYm] = useState(initial)

  useEffect(() => {
    const read = () => {
      const now = new Date()
      setYm(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      )
    }
    read()
    // A long-lived tab should still be right after midnight on the 1st.
    const id = setInterval(read, 60 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  return ym
}

/** Current year, same build-first-then-live contract as above. */
export function useNowYear(initial: number): number {
  const [year, setYear] = useState(initial)
  useEffect(() => setYear(new Date().getFullYear()), [])
  return year
}
