'use client'

import Icon from './Icon'
import Flag from './Flag'
import SpotlightGroup from './SpotlightGroup'
import { PROFILE, buildTrace, spellYears } from '@/lib/career'
import { useNowYm } from '@/lib/useNowYm'

export default function About({ nowYm }: { nowYm: string }) {
  // Live, so the paragraph rolls from "Six years" to "Seven" on its own.
  const trace = buildTrace(useNowYm(nowYm))

  return (
    <section className="section" id="about">
      <div className="shell">
        <div className="section-head reveal">
          <h2 className="section-title">About</h2>
          <span className="micro">[ profile ]</span>
        </div>

        <div className="about-grid reveal">
          <p className="about-lead">
            {spellYears(trace.totalMonths)} years building distributed systems
            in Java and Go — microservices, REST and gRPC APIs, and
            event-driven pipelines — for platforms in{' '}
            {PROFILE.domains.slice(0, -1).join(', ')}, and{' '}
            {PROFILE.domains.at(-1)}. I own systems from the design decision
            through deployment to production support, and I model the data
            behind them across relational and NoSQL stores with advanced SQL and
            query tuning. Currently building OMD&rsquo;s tick-level market-data
            platform on Java 21, Micronaut and Go; previously led architecture
            decisions and code review across e-commerce teams, and taught the
            Java backend curriculum at Smart Code.
          </p>

          <SpotlightGroup className="panels reveal">
            <div
              className="panel reveal-item"
              data-spot
              style={{ '--i': 0 } as React.CSSProperties}
            >
              <h3 className="panel-head">
                <span className="panel-icon" data-tone="blue">
                  <Icon name="languages" size={15} />
                </span>
                Languages
              </h3>
              <ul className="langs">
                {PROFILE.languages.map((lang) => (
                  <li key={lang.name}>
                    <Flag code={lang.flag} />
                    <span className="lang-name">{lang.name}</span>
                    <span className="lang-level mono">{lang.level}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="panel reveal-item"
              data-spot
              style={{ '--i': 1 } as React.CSSProperties}
            >
              <h3 className="panel-head">
                <span className="panel-icon" data-tone="amber">
                  <Icon name="pin" size={15} />
                </span>
                Based
              </h3>
              <p className="panel-value">{PROFILE.location}</p>
              <p className="panel-note mono">
                {PROFILE.timezone} · open to remote
              </p>
            </div>

            <div
              className="panel reveal-item"
              data-spot
              style={{ '--i': 2 } as React.CSSProperties}
            >
              <h3 className="panel-head">
                <span className="panel-icon" data-tone="violet">
                  <Icon name="repo" size={15} />
                </span>
                Domains
              </h3>
              <ul className="chips">
                {PROFILE.domains.map((d) => (
                  <li className="chip" key={d}>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </SpotlightGroup>
        </div>
      </div>
    </section>
  )
}
