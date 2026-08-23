import type { Metadata } from 'next'
import { Space_Grotesk, Fira_Code, Inter } from 'next/font/google'

/**
 * Space Grotesk for everything visible, Fira Code for anything monospaced,
 * Inter as the sans fallback.
 *
 * Space Grotesk earns its place here — its single-storey `a`, flat-sided `y`
 * and squared terminals are drawn from technical lettering, which suits a page
 * whose subject is backend systems, and it holds up at both 88px display and
 * 15px body.
 */
const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-body',
  display: 'swap',
})

const mono = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-face',
  display: 'swap',
})
import RevealObserver from '@/components/RevealObserver'
import { PROFILE } from '@/lib/career'
import { THEME_BOOTSTRAP } from '@/lib/useTheme'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(PROFILE.site),
  title: `${PROFILE.name} — ${PROFILE.role}`,
  description:
    'Senior Backend Engineer with 6+ years in Java and Go, building distributed systems — microservices, REST and gRPC APIs, event-driven pipelines on AWS, Docker and Kubernetes.',
  keywords: [
    'Java',
    'Go',
    'Golang',
    'Spring Boot',
    'Micronaut',
    'microservices',
    'distributed systems',
    'AWS',
    'Kubernetes',
    'Kafka',
    'market data',
    'Yerevan',
  ],
  authors: [{ name: PROFILE.name, url: PROFILE.site }],
  openGraph: {
    type: 'profile',
    title: `${PROFILE.name} — ${PROFILE.role}`,
    description: PROFILE.headline,
    url: PROFILE.site,
    siteName: PROFILE.name,
    images: ['/aghasi-khachatryan-og.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/aghasi-khachatryan-og.jpg'],
  },
  icons: { icon: '/favicon.svg' },
}

/** Structured data so a recruiter's tooling reads the profile correctly. */
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: PROFILE.name,
  jobTitle: PROFILE.role,
  email: `mailto:${PROFILE.email}`,
  telephone: PROFILE.phone,
  url: PROFILE.site,
  image: `${PROFILE.site}${PROFILE.photo}`,
  sameAs: [PROFILE.github, PROFILE.linkedin],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Yerevan',
    addressCountry: 'AM',
  },
  worksFor: { '@type': 'Organization', name: 'OMD' },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: PROFILE.education.school,
  },
  knowsLanguage: PROFILE.languages.map((l) => l.name),
  knowsAbout: [
    'Java',
    'Go',
    'Spring Boot',
    'Micronaut',
    'Distributed Systems',
    'Microservices',
    'Kubernetes',
    'AWS',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint so the stored theme is applied without a
            flash of the wrong palette. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#08090b"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#f7f7f5"
        />
        <script
          type="application/ld+json"
          // Static, author-controlled object — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>
        {/* Glass only reads as glass when something moves behind it. Below the
            hero the page had nothing but a flat field, so every frosted panel
            looked like a plain dark card. These three slow blobs give every
            surface on the page something to refract. */}
        <div className="aurora" aria-hidden="true">
          <span className="aurora-blob" data-b="1" />
          <span className="aurora-blob" data-b="2" />
          <span className="aurora-blob" data-b="3" />
        </div>
        <div className="bloom" aria-hidden="true" />
        {children}
        <RevealObserver />
      </body>
    </html>
  )
}
