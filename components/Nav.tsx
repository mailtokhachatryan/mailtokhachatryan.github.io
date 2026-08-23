'use client'

import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'

const LINKS = [
  { href: '#trace', label: 'Work' },
  { href: '#projects', label: 'Projects' },
  { href: '#stack', label: 'Stack' },
  { href: '#education', label: 'Education' },
  { href: '#about', label: 'About' },
]

/** Six-spoke asterisk, echoing the mark in the reference layout. */
function Mark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M12 2.5v19M3.8 7.2l16.4 9.6M20.2 7.2L3.8 16.8" />
      </g>
    </svg>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)

  // Close on Escape and lock the page behind the sheet.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <nav className="nav" aria-label="Primary">
        <a className="nav-brand" href="#top">
          <Mark />
          <span>Aghasi</span>
        </a>

        {/* Layout lives in CSS, not an inline style — an inline `display` wins
            over the stylesheet and would defeat the mobile media query. */}
        <div className="nav-links">
          {LINKS.map((l) => (
            <a key={l.href} className="nav-link" href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        <a className="nav-cta" href="#contact">
          Get in touch&nbsp;·
        </a>

        <ThemeToggle />

        <button
          className="nav-burger"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="nav-sheet"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
            {open ? (
              <path
                d="M3 3l9 9M12 3l-9 9"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M2 5h11M2 10h11"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="nav-sheet" id="nav-sheet">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)}>
            Get in touch
          </a>
        </div>
      )}
    </>
  )
}
