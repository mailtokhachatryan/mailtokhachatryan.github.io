import Icon from './Icon'
import SpotlightGroup from './SpotlightGroup'
import { CERTIFICATIONS, PROFILE } from '@/lib/career'

/**
 * Its own section rather than three rows inside About.
 *
 * Buried in a definition list 4,500px down the page, the degree and the
 * certifications were effectively invisible — which for a hiring manager
 * skimming the page is the same as absent.
 */
export default function Education() {
  return (
    <section className="section" id="education">
      <div className="shell">
        <div className="section-head reveal">
          <h2 className="section-title">Education &amp; certifications</h2>
          <span className="micro">[ credentials ]</span>
        </div>

        <SpotlightGroup className="creds reveal">
          <article
            className="cred reveal-item"
            data-spot
            style={{ '--i': 0 } as React.CSSProperties}
          >
            <span className="cred-icon">
              <Icon name="education" size={18} />
            </span>
            <div>
              <h3 className="cred-title">{PROFILE.education.degree}</h3>
              <p className="cred-org">{PROFILE.education.school}</p>
              <span className="cred-meta mono">{PROFILE.education.years}</span>
            </div>
          </article>

          {CERTIFICATIONS.map((cert, i) => (
            <article
              className="cred reveal-item"
              data-spot
              key={cert.name}
              style={{ '--i': i + 1 } as React.CSSProperties}
            >
              <span className="cred-icon">
                <Icon name="certificate" size={18} />
              </span>
              <div>
                <h3 className="cred-title">
                  {cert.url ? <a href={cert.url} target="_blank" rel="noopener noreferrer">{cert.name}</a> : cert.name}
                </h3>
                <p className="cred-org">{cert.issuer}</p>
                {cert.year && (
                  <span className="cred-meta mono">{cert.year}</span>
                )}
                {cert.expires && <span className="cred-meta mono">Valid through {cert.expires}</span>}
                {cert.url && <a className="cred-verify" href={cert.url} target="_blank" rel="noopener noreferrer" aria-label={`Verify ${cert.name}`}>Verify credential ↗</a>}
                {cert.skills && (
                  <span className="cred-meta mono">
                    {cert.skills.join(' · ')}
                  </span>
                )}
                {/* Verifiable, so it belongs on the page — but it is a UUID,
                    not something anyone reads, so it stays at micro size. */}
                {cert.credential && (
                  <span className="cred-meta mono">ID {cert.credential}</span>
                )}
              </div>
            </article>
          ))}
        </SpotlightGroup>
        <p className="cred-org">Professional development: preparing for an Anthropic certification.</p>
      </div>
    </section>
  )
}
