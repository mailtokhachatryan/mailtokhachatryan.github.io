'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import SplitText from './SplitText'
import CodeWindow from './CodeWindow'
import Typewriter from './Typewriter'
import Icon, { type IconName } from './Icon'
import { CLUSTERS, PROFILE, buildTrace } from '@/lib/career'
import { useNowYm } from '@/lib/useNowYm'
import { useTheme } from '@/lib/useTheme'

/**
 * The canvas is client-only: WebGL has nothing to render during a static export,
 * and prerendering it would only ship dead markup. `ssr: false` is legal here
 * because this file is already a Client Component.
 */
const ParticleField = dynamic(() => import('./ParticleField'), {
  ssr: false,
  loading: () => null,
})

/**
 * The rail doubles as the legend for the hero object's three regions — hovering
 * a region of the point cloud lights the matching entry. That keeps the object
 * unlabelled while still making the structure legible.
 */
const RAIL = [
  { region: 'jvm', label: 'java · spring · micronaut' },
  { region: 'concurrency', label: 'go · streaming · events' },
  { region: 'infra', label: 'aws · kubernetes · ci/cd' },
]

const LINKS: { label: string; href: string; icon: IconName }[] = [
  { label: 'GitHub', href: PROFILE.github, icon: 'github' },
  { label: 'LinkedIn', href: PROFILE.linkedin, icon: 'linkedin' },
  { label: 'Email', href: `mailto:${PROFILE.email}`, icon: 'mail' },
]

export default function Hero({ nowYm }: { nowYm: string }) {
  const trace = buildTrace(useNowYm(nowYm))
  const tenure = trace.totalDuration
  const years = Math.floor(trace.totalMonths / 12)

  const [active, setActive] = useState(-1)
  const activeRegion = CLUSTERS[active]?.id
  const theme = useTheme()

  return (
    <header className="hero" id="top">
      <ParticleField theme={theme} onActiveChange={setActive} />

      <div className="shell hero-main">
        <div className="hero-copy">
          <div className="hero-id">
            {/* Sized explicitly to reserve layout space before it loads. */}
            <img
              className="hero-avatar"
              src={PROFILE.photo}
              alt={PROFILE.name}
              width={104}
              height={104}
              loading="eager"
              decoding="async"
            />
            <p className="hero-status mono">
              <span className="status-dot" aria-hidden="true" />
              status =={' '}
              <span className="hero-status-value">&apos;open_to_work&apos;</span>
            </p>
          </div>

          <h1 className="hero-title">
            <SplitText text="Hi, I’m Aghasi" />
            <span className="hero-title-line">
              <SplitText text="Khachatryan" delay={0.5} />
              <span className="hero-caret" aria-hidden="true" />
            </span>
          </h1>

          <Typewriter
            /* Short phrases on purpose: a long one spends most of its life
               half-typed, and a truncated clause reads as a broken string
               rather than an animation. */
            phrases={[
              `${PROFILE.role}`,
              `${tenure} of backend work`,
              'Java 21 · Micronaut · Spring Boot',
              'Go concurrency · goroutines',
              'Tick-level market data at OMD',
              'Distributed systems on AWS',
            ]}
            label={`${PROFILE.role}, ${tenure} of experience. Java, Go, Spring Boot, Micronaut and distributed systems on AWS.`}
          />

          <div className="hero-links">
            {LINKS.map((link) => (
              <a
                className="btn-ghost"
                key={link.label}
                href={link.href}
                {...(link.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                <Icon name={link.icon} size={15} />
                {link.label}
              </a>
            ))}
            <a
              className="btn-solid"
              href={PROFILE.cv}
              download={PROFILE.cvFilename}
            >
              Download CV
              <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M8 2v9m0 0 3.2-3.2M8 11 4.8 7.8M2.5 13.5h11"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </a>
          </div>
        </div>

        <CodeWindow years={years} />
      </div>

      <div className="hero-band">
        <div className="shell">
          <div className="hero-band-grid">
            <p className="hero-statement">
              {tenure} of backend work — fintech, banking, market data,
              e-commerce, logistics. Now on tick-level market data.
            </p>
            <p className="hero-note">
              {PROFILE.role} in {PROFILE.location}. I build distributed systems
              in Java and Go — microservices, REST and gRPC APIs, and the
              event-driven pipelines that move data between them.
            </p>
          </div>

          <div className="hero-rail">
            {RAIL.map((item, i) => (
              <span
                key={item.region}
                style={{ display: 'inline-flex', gap: '0.75rem' }}
              >
                {i > 0 && <span className="hero-rail-dot">·</span>}
                <span
                  className="micro rail-item"
                  data-active={activeRegion === item.region}
                >
                  [ {item.label} ]
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
