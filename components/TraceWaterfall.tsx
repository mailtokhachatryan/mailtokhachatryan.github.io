'use client'

import CountUp from './CountUp'
import { buildTrace } from '@/lib/career'
import { useNowYm } from '@/lib/useNowYm'

/**
 * The signature element.
 *
 * Built on `<details>/<summary>` rather than click handlers so expansion works
 * with the keyboard, with a screen reader, and with JavaScript switched off —
 * this is the most important content on the page and it should never depend on
 * a bundle loading.
 *
 * Bar geometry comes from `buildTrace`, so the picture cannot disagree with the
 * dates. Overlapping spans are concurrent roles the CV documents explicitly.
 */
export default function TraceWaterfall({ nowYm }: { nowYm: string }) {
  /* Derived from the live clock, so the open spans' durations and bar widths
     stay correct without a redeploy. */
  const trace = buildTrace(useNowYm(nowYm))

  return (
    <section className="section" id="trace">
      <div className="shell">
        <div className="section-head reveal">
          <h2 className="section-title">Experience</h2>
          <span className="micro">[ trace ]</span>
        </div>

        <div className="trace reveal">
          <div className="trace-meta mono reveal">
            <span>career/aghasi</span>
            <span>
              <CountUp value={trace.spans.length} /> spans
            </span>
            <span>
              <CountUp value={trace.employers} /> employers
            </span>
            <span>{trace.totalDuration}</span>
            <span>
              {trace.startYear}—{trace.endYear}
            </span>
          </div>

          <div className="trace-axis" aria-hidden="true">
            <span />
            <span />
            <span className="trace-axis-track">
              {trace.years.map((t) => (
                <span
                  key={t.year}
                  className="trace-tick"
                  style={{ left: `${t.left}%` }}
                >
                  {t.year}
                </span>
              ))}
            </span>
            <span />
          </div>

          {trace.spans.map((span) => (
            <details
              className="span reveal-item"
              key={span.id}
              data-depth={span.depth}
              style={{ '--i': span.index } as React.CSSProperties}
            >
              <summary>
                <span className="span-idx">
                  <svg
                    className="span-chev"
                    width="9"
                    height="9"
                    viewBox="0 0 10 10"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 1.5 7 5 3 8.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </span>

                <span className="span-label">
                  <span className="span-role">
                    {span.depth === 1 && (
                      <span className="span-branch" aria-hidden="true">
                        └
                      </span>
                    )}
                    {span.org}
                    {span.isOpen && <span className="span-live">live</span>}
                  </span>
                  <span className="span-org">
                    {span.client ? `${span.client} · ` : ''}
                    {span.role}
                  </span>
                </span>

                <span className="span-track">
                  <span
                    className="span-bar"
                    data-open={span.isOpen}
                    data-depth={span.depth}
                    style={{
                      left: `${span.left}%`,
                      width: `${span.width}%`,
                      // Stagger the draw so the bars cascade down the page.
                      animationDelay: `${span.index * 70}ms`,
                    }}
                  />
                </span>

                <span className="span-dur">{span.duration}</span>
              </summary>

              <div className="span-detail">
                <span aria-hidden="true" />
                <div className="span-detail-body">
                  <span className="span-range">
                    {span.range} · {span.location}
                  </span>

                  {span.context && <p className="span-context">{span.context}</p>}

                  {span.note && (
                    <p className="span-note">
                      <span aria-hidden="true">※ </span>
                      {span.note}
                    </p>
                  )}

                  {span.points.length > 0 && (
                    <ul className="span-points">
                      {span.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}

                  {span.stack.length > 0 && (
                    <ul className="tags">
                      {span.stack.map((t) => (
                        <li className="tag" key={t}>
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
