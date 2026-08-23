/**
 * Splits a string into per-character spans for the blur-up entrance.
 *
 * Driven by a CSS animation with an inline `animation-delay` rather than a
 * JS-toggled class, so it runs on first paint with no hydration step and no
 * observer. Words are wrapped in their own inline-block so a line break can
 * only ever fall between words.
 *
 * The base state is fully visible; the hidden keyframe start only exists inside
 * a `prefers-reduced-motion: no-preference` block, so a reduced-motion visitor
 * — or anyone whose CSS fails — sees plain, complete text.
 */
export default function SplitText({
  text,
  step = 0.035,
  delay = 0,
}: {
  text: string
  /** Seconds between consecutive characters. */
  step?: number
  /** Seconds before the first character starts. */
  delay?: number
}) {
  let index = 0

  return (
    <>
      {text.split(/(\s+)/).map((chunk, ci) => {
        if (/^\s+$/.test(chunk)) return ' '
        return (
          <span className="word" key={ci}>
            {Array.from(chunk).map((char, k) => (
              <span
                className="char"
                key={k}
                style={{ animationDelay: `${(delay + index++ * step).toFixed(3)}s` }}
              >
                {char}
              </span>
            ))}
          </span>
        )
      })}
    </>
  )
}
