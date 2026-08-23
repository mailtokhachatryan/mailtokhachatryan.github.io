'use client'

import { useCallback, useRef } from 'react'

/**
 * Mouse-tracked spotlight, carried over from the original site.
 *
 * One `pointermove` listener on the container rather than one per card, and it
 * writes CSS custom properties instead of setting React state — a state update
 * per mouse move would re-render the whole grid on every frame.
 *
 * Any descendant carrying `data-spot` becomes a target.
 */
export default function SpotlightGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const last = useRef<HTMLElement | null>(null)

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('[data-spot]')

    if (card !== last.current) {
      last.current?.style.removeProperty('--spot')
      last.current = card
    }
    if (!card) return

    const r = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${e.clientX - r.left}px`)
    card.style.setProperty('--my', `${e.clientY - r.top}px`)
    card.style.setProperty('--spot', '1')
  }, [])

  const onLeave = useCallback(() => {
    last.current?.style.removeProperty('--spot')
    last.current = null
  }, [])

  return (
    <div className={className} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  )
}
