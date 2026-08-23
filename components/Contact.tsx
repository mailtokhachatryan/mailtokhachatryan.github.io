import Icon, { type IconName } from './Icon'
import SpotlightGroup from './SpotlightGroup'
import { PROFILE } from '@/lib/career'

const CHANNELS: { label: string; value: string; href: string; icon: IconName }[] =
  [
    {
      label: 'email',
      value: PROFILE.email,
      href: `mailto:${PROFILE.email}`,
      icon: 'mail',
    },
    {
      label: 'phone',
      value: PROFILE.phone,
      href: `tel:${PROFILE.phone.replace(/\s/g, '')}`,
      icon: 'phone',
    },
    {
      label: 'linkedin',
      value: PROFILE.linkedinHandle,
      href: PROFILE.linkedin,
      icon: 'linkedin',
    },
    {
      label: 'github',
      value: PROFILE.githubUser,
      href: PROFILE.github,
      icon: 'github',
    },
  ]

export default function Contact() {
  return (
    <section className="section" id="contact">
      <div className="shell">
        <div className="section-head reveal">
          <h2 className="section-title">Get in touch</h2>
          <span className="micro">[ {PROFILE.timezone} ]</span>
        </div>

        <SpotlightGroup className="contact-grid reveal">
          {CHANNELS.map((channel, i) => {
            const external = channel.href.startsWith('http')
            return (
              <a
                className="contact-cell reveal-item"
                data-spot
                key={channel.label}
                style={{ '--i': i } as React.CSSProperties}
                href={channel.href}
                {...(external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                <span className="micro">
                  <Icon name={channel.icon} size={13} /> {channel.label}
                </span>
                <span className="contact-value">{channel.value}</span>
              </a>
            )
          })}

          {/* Two ways to the same file. A recruiter skimming on a phone wants
              to read it now; one filing it for later wants it saved under a
              readable name. `download` forces the latter, so the browser view
              needs its own link rather than a second use of this one. */}
          <a
            className="contact-cell reveal-item"
            data-spot
            style={{ '--i': CHANNELS.length } as React.CSSProperties}
            href={PROFILE.cv}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="micro">
              <Icon name="arrow" size={13} /> cv
            </span>
            <span className="contact-value">Open in browser</span>
          </a>

          <a
            className="contact-cell reveal-item"
            data-spot
            style={{ '--i': CHANNELS.length + 1 } as React.CSSProperties}
            href={PROFILE.cv}
            download={PROFILE.cvFilename}
          >
            <span className="micro">
              <Icon name="download" size={13} /> cv
            </span>
            <span className="contact-value">Download PDF</span>
          </a>
        </SpotlightGroup>
      </div>
    </section>
  )
}
