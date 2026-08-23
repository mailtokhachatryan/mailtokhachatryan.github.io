'use client'

import { PROFILE } from '@/lib/career'
import { useNowYear } from '@/lib/useNowYm'

export default function Footer({ year }: { year: number }) {
  // Rolls over on New Year without a deploy.
  const live = useNowYear(year)

  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <span className="mono" style={{ color: 'var(--color-fg-3)' }}>
          © {live} {PROFILE.name}
        </span>

        <span className="status mono">
          <span className="status-dot" aria-hidden="true" />
          Open to opportunities
        </span>
      </div>
    </footer>
  )
}
