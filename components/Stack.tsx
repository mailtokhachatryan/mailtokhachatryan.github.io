import SpotlightGroup from './SpotlightGroup'
import SkillIcon from './SkillIcon'
import { CORE, SKILLS } from '@/lib/career'

/**
 * Two tiers, not one wall.
 *
 * The eight core technologies get real size, an icon, and a spotlight on hover.
 * The full taxonomy follows as grouped text with middot separators rather than
 * eighty pills — a pill per item adds a border and padding around every word,
 * which is what forces the type down to 12px and makes the section unreadable.
 */
export default function Stack() {
  return (
    <section className="section" id="stack">
      <div className="shell">
        <div className="section-head reveal">
          <h2 className="section-title">Stack</h2>
          <span className="micro">[ what I reach for ]</span>
        </div>

        {/* Marquee: the set is rendered twice and the track slides exactly
            -50%, so the loop is seamless. Hover pauses it so a card can
            actually be read. */}
        <SpotlightGroup className="marquee">
          <div className="marquee-track">
            {[0, 1].map((pass) => (
              <div
                className="marquee-set"
                key={pass}
                /* The duplicate exists only to close the loop — hiding it keeps
                   a screen reader from reading the stack twice. */
                aria-hidden={pass === 1 ? true : undefined}
              >
                {CORE.map((tool) => (
                  <div className="core-card" key={tool.name} data-spot>
                    {/* Via SkillIcon so a mark absent from simple-icons drops
                        out rather than rendering a broken-image glyph. */}
                    <SkillIcon file={tool.icon} size={30} />
                    <span className="core-name">{tool.name}</span>
                    <span className="core-note mono">{tool.note}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </SpotlightGroup>

        <dl className="skills reveal">
          {SKILLS.map((group, i) => (
            <div
              className="skill-row reveal-item"
              key={group.label}
              style={{ '--i': i } as React.CSSProperties}
            >
              <dt className="skill-label">{group.label}</dt>
              <dd className="skill-items">
                {group.items.map((item, n) => (
                  <span key={item.name}>
                    {n > 0 && <span className="skill-sep">·</span>}
                    <span className="skill-item">
                      {item.icon && <SkillIcon file={item.icon} />}
                      {item.name}
                    </span>
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
