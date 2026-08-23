import { PROJECTS } from '@/lib/career'

/**
 * The work that sits outside the employment trace gets its own section.
 *
 * SoulsHub is the only entry that was taken from an empty repository through
 * architecture, infrastructure and delivery by one person, so it should not be
 * one row among thirty in the repository list below.
 */
export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="shell">
        <div className="section-head reveal">
          <h2 className="section-title">Selected project</h2>
          <span className="micro">
            [ {PROJECTS.length} project{PROJECTS.length === 1 ? '' : 's'} ]
          </span>
        </div>

        {PROJECTS.map((project) => (
          <article className="project reveal" key={project.name}>
            <div className="project-head">
              <h3 className="project-name mono">{project.name}</h3>
              <span className="project-link mono">{project.when}</span>
            </div>
            <p className="project-summary">
              <strong style={{ fontWeight: 500 }}>{project.role}.</strong>{' '}
              {project.summary}
            </p>
            <ul className="tags">
              {project.stack.map((t) => (
                <li className="tag" key={t}>
                  {t}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
