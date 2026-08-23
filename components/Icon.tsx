/**
 * One icon set, one geometry: 24-unit box, 1.6 stroke, round caps, no fills
 * except the two brand marks that only read as solids.
 *
 * Inline SVG rather than an icon font — the previous site pulled ~75KB of Font
 * Awesome to draw six glyphs, and mixing text glyphs like ★ and ⑂ with drawn
 * icons is what made the meta rows look assembled from spare parts.
 */

const PATHS: Record<string, React.ReactNode> = {
  github: (
    <path
      d="M9 19c-4 1.2-4-2.1-5.6-2.6M14.5 21v-3.4a2.9 2.9 0 0 0-.8-2.3c2.6-.3 5.3-1.3 5.3-5.8a4.5 4.5 0 0 0-1.3-3.1 4.2 4.2 0 0 0-.1-3.2s-1.4-.4-4.6 1.7a11.4 11.4 0 0 0-5.9 0C3.9 2.8 2.5 3.2 2.5 3.2a4.2 4.2 0 0 0-.1 3.2A4.5 4.5 0 0 0 1.1 9.5c0 4.5 2.7 5.5 5.3 5.8a2.9 2.9 0 0 0-.8 2.2V21"
      transform="translate(2 0)"
    />
  ),
  linkedin: (
    <>
      <path d="M4.5 9.5v10M4.5 5.2v.1" />
      <path d="M10.5 19.5v-5.6a3 3 0 0 1 6 0v5.6M10.5 9.5v10" />
      <rect x="1.5" y="2.5" width="19" height="19" rx="3" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </>
  ),
  phone: (
    <path d="M8.4 3.5H5.2A1.7 1.7 0 0 0 3.5 5.4c.5 4 2.2 7.6 5 10.4s6.4 4.5 10.4 5a1.7 1.7 0 0 0 1.9-1.7v-3.2a1.7 1.7 0 0 0-1.5-1.7l-2.6-.4a1.7 1.7 0 0 0-1.6.7l-.8 1.1a13 13 0 0 1-4.7-4.7l1.1-.8a1.7 1.7 0 0 0 .7-1.6l-.4-2.6a1.7 1.7 0 0 0-1.7-1.4Z" />
  ),
  download: <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M3.5 20.5h17" />,
  star: (
    <path d="m12 3.5 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 10l6.1-.9L12 3.5Z" />
  ),
  fork: (
    <>
      <circle cx="6.5" cy="5" r="2.5" />
      <circle cx="17.5" cy="5" r="2.5" />
      <circle cx="12" cy="19" r="2.5" />
      <path d="M6.5 7.5v2a2.5 2.5 0 0 0 2.5 2.5h6a2.5 2.5 0 0 0 2.5-2.5v-2M12 12v4.5" />
    </>
  ),
  arrow: <path d="M6 18 18 6m0 0h-8m8 0v8" />,
  education: (
    <>
      <path d="M2.5 8.5 12 4l9.5 4.5L12 13 2.5 8.5Z" />
      <path d="M6.5 10.4V16c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-5.6M20.5 9.8v5.4" />
    </>
  ),
  certificate: (
    <>
      <circle cx="12" cy="9.5" r="5.5" />
      <path d="M8.6 14.2 7.5 21l4.5-2.3L16.5 21l-1.1-6.8" />
    </>
  ),
  languages: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 9.5h17.6M3.2 14.5h17.6M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10.2" r="2.5" />
    </>
  ),
  repo: (
    <>
      <path d="M5 3.5h11a2 2 0 0 1 2 2v15H5.5A2 2 0 0 1 3.5 18.5V6a2.5 2.5 0 0 1 2.5-2.5Z" />
      <path d="M3.5 17h14.5" />
    </>
  ),
}

export type IconName = keyof typeof PATHS

export default function Icon({
  name,
  size = 16,
  className,
}: {
  name: IconName
  size?: number
  className?: string
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
