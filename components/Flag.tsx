/**
 * Inline SVG flags rather than emoji.
 *
 * Flag emoji are regional-indicator pairs, and Windows ships no glyphs for
 * them — Chrome on Windows renders 🇦🇲 as the letters "AM". Drawing them keeps
 * the row identical everywhere and lets them match the icon set's corner radius.
 */

const FLAGS: Record<string, React.ReactNode> = {
  // Armenia — red / blue / apricot.
  am: (
    <>
      <rect width="20" height="4.667" y="0" fill="#D90012" />
      <rect width="20" height="4.666" y="4.667" fill="#0033A0" />
      <rect width="20" height="4.667" y="9.333" fill="#F2A800" />
    </>
  ),
  // United Kingdom — simplified Union Flag: saltires under the cross.
  gb: (
    <>
      <rect width="20" height="14" fill="#012169" />
      <path d="M0 0l20 14M20 0L0 14" stroke="#fff" strokeWidth="2.8" />
      <path d="M0 0l20 14M20 0L0 14" stroke="#C8102E" strokeWidth="1.4" />
      <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4.6" />
      <path d="M10 0v14M0 7h20" stroke="#C8102E" strokeWidth="2.6" />
    </>
  ),
  // Russia — white / blue / red.
  ru: (
    <>
      <rect width="20" height="4.667" y="0" fill="#fff" />
      <rect width="20" height="4.666" y="4.667" fill="#0039A6" />
      <rect width="20" height="4.667" y="9.333" fill="#D52B1E" />
    </>
  ),
}

export type FlagCode = keyof typeof FLAGS

export default function Flag({ code }: { code: FlagCode }) {
  return (
    <svg
      className="flag"
      width="20"
      height="14"
      viewBox="0 0 20 14"
      aria-hidden="true"
      focusable="false"
    >
      <g clipPath="url(#flag-clip)">{FLAGS[code]}</g>
      <defs>
        <clipPath id="flag-clip">
          <rect width="20" height="14" rx="2.5" />
        </clipPath>
      </defs>
    </svg>
  )
}
