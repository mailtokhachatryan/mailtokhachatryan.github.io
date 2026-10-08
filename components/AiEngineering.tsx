import Icon from './Icon'
import SpotlightGroup from './SpotlightGroup'

const CAPABILITIES = [
  { title: 'Reusable team workflows', detail: 'Built tickwrite-sdlc, an internal Claude Code plugin used by my team in daily development. Five skills and eight specialized subagents connect ticket planning, test-first implementation, verification and review.' },
  { title: 'Context and integrations', detail: 'Shared CLAUDE.md / AGENTS.md instructions capture architecture and conventions. MCP connects Jira/Confluence, cross-service code analysis and library documentation.' },
  { title: 'Verification and human control', detail: 'Ticket-scoped hooks check plan approval, service boundaries and test evidence. Local end-to-end checks and fresh-agent review support human merge-request approval.' },
]

export default function AiEngineering() {
  return (
    <section className="section" id="ai">
      <div className="shell">
        <div className="section-head reveal">
          <h2 className="section-title">AI engineering &amp; team enablement</h2>
          <span className="micro">[ agentic SDLC ]</span>
        </div>
        <SpotlightGroup className="panels reveal">
          {CAPABILITIES.map((item, i) => (
            <article className="panel reveal-item" data-spot key={item.title} style={{ '--i': i } as React.CSSProperties}>
              <h3 className="panel-head"><span className="panel-icon" data-tone="violet"><Icon name="repo" size={15} /></span>{item.title}</h3>
              <p className="cred-org">{item.detail}</p>
            </article>
          ))}
        </SpotlightGroup>
        <p className="cred-org">Claude Code · OpenCode CLI · MCP · AI-assisted TDD and review</p>
        <a className="cred-verify" href="#education">Explore AI certifications ↓</a>
      </div>
    </section>
  )
}
