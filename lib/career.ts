/**
 * Single source of truth, transcribed from `Aghasi_Khachatryan_CV.pdf`.
 *
 * Every bar width, offset, duration and count on the page is derived from this
 * file, so the timeline can never drift out of sync with the copy.
 */

export type Span = {
  id: string
  role: string
  /** Employer. */
  org: string
  location: string
  /** Product the role is remembered by, where one dominates the engagement. */
  client?: string
  /** Nesting level — 1 marks a product span inside its employer span. */
  depth: 0 | 1
  /** Inclusive month the role began, `YYYY-MM`. */
  start: string
  /** Exclusive month the role ended, or `null` while still open. */
  end: string | null
  /** One-line framing of the product or engagement. */
  context?: string
  /** Verbatim CV note explaining a deliberate overlap with another role. */
  note?: string
  points: string[]
  stack: string[]
}

/** Months elapsed since year 0 — a monotonic index that makes span math trivial. */
export function monthIndex(ym: string): number {
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + (m - 1)
}

const WORDS = [
  'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight',
  'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
]

/**
 * Whole years, spelled out, for running prose.
 *
 * "6y 6mo building distributed systems…" reads like a spreadsheet cell dropped
 * into a sentence. The precise figure belongs in the trace header, where it is
 * data; in a paragraph it should be a word. Rounds down, so it is never a claim
 * to more experience than there is.
 */
export function spellYears(months: number): string {
  const y = Math.floor(months / 12)
  return WORDS[y] ?? String(y)
}

export function formatDuration(months: number): string {
  const y = Math.floor(months / 12)
  const m = months % 12
  if (y === 0) return `${m}mo`
  if (m === 0) return `${y}y`
  return `${y}y ${m}mo`
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export function formatMonth(ym: string): string {
  const [y, m] = ym.split('-').map(Number)
  return `${MONTHS[m - 1]} ${y}`
}

export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'present'}`
}

/**
 * Chronological, oldest first.
 *
 * The waterfall reads top-down so bars step rightward down the page; reversing
 * this would flatten the whole shape. The Smart Code training contract overlaps
 * two full-time spans and is shown as-is — the CV documents that overlap
 * explicitly, and a trace that hid it would misreport the shape of the career.
 */
export const SPANS: Span[] = [
  {
    id: 'picsart',
    role: 'Java Developer Trainee',
    org: 'PicsArt Armenia',
    location: 'Yerevan, Armenia',
    depth: 0,
    start: '2020-02',
    end: '2020-08',
    points: [
      'Completed an intensive Java backend training program and contributed to production development tasks under senior mentorship.',
    ],
    stack: ['Java', 'Spring', 'OOP', 'Git', 'Agile'],
  },
  {
    id: 'codeex',
    role: 'Java Software Engineer',
    org: 'Codeex',
    location: 'Yerevan, Armenia',
    client: 'MLM',
    depth: 0,
    start: '2020-08',
    end: '2022-08',
    context:
      'Multi-level marketing e-commerce platform with white-label capability.',
    points: [
      'Migrated a monolithic application to microservices and built white-label-capable products on the new architecture.',
      'Developed a PASETO-secured authorization server and the e-commerce microservices behind it, and designed the user-management database architecture.',
      'Led code reviews and architecture decisions across the team.',
    ],
    stack: [
      'Java 17',
      'Spring Boot',
      'Spring Security',
      'Spring Cloud',
      'PostgreSQL',
      'Redis',
      'WebSockets',
      'Hibernate',
      'MyBatis',
      'Liquibase',
      'Docker',
      'Maven',
    ],
  },
  {
    id: 'itech',
    role: 'Java Backend Developer',
    org: 'I-Tech',
    location: 'Yerevan, Armenia',
    depth: 0,
    start: '2022-08',
    end: '2023-07',
    context:
      'Four production backends: Audit Trail (user-activity logging), T3 TMS (transportation management), TMT (GPS trip tracking) and Click Market (B2C e-commerce).',
    points: [
      'Delivered four production backend products as sole or lead developer on Spring Boot 3 and Spring Cloud.',
      'Built REST APIs, JWT security, search and notification features across those services.',
      'Built an audit-logging service on Elasticsearch and MongoDB that consumed Kafka events, tracking p95 / p99 query latency as the index grew.',
      'Shipped Click Market, a B2C e-commerce platform, as sole developer — payment integration, catalog, cart and checkout, admin dashboard and inventory logic.',
      'Engineered S3-backed file uploads and SSE streaming, and owned database migrations.',
      'Architected the multi-module application and database structure, then built the CI/CD pipelines and containerized every service with Docker.',
      'Owned code review and automated test coverage across the delivered services.',
    ],
    stack: [
      'Java 17 / 11',
      'Spring Boot 3',
      'Spring Security',
      'Spring Cloud',
      'Kafka',
      'Elasticsearch',
      'MongoDB',
      'PostgreSQL',
      'SSE',
      'JUnit 5',
      'Docker',
      'Kubernetes',
      'AWS S3',
    ],
  },
  {
    id: 'egs',
    role: 'Senior Java Software Engineer',
    org: 'Energize Global Services',
    location: 'Yerevan, Armenia',
    client: 'PGUI',
    depth: 0,
    start: '2023-07',
    end: '2024-07',
    context: 'Bank management system.',
    points: [
      'Engineered new features and resolved production incidents on a bank-management platform, sustaining service reliability.',
      'Designed REST APIs and built user-management and search functionality, backed by Keycloak for identity and access management.',
      'Tuned slow SQL queries to improve database performance and response times, and maintained schema integrity through versioned Liquibase migrations.',
    ],
    stack: [
      'Java 11',
      'Spring Boot',
      'Tapestry',
      'Keycloak',
      'Apache Camel',
      'Oracle',
      'Hibernate',
      'Liquibase',
      'Maven',
    ],
  },
  {
    id: 'smartcode',
    role: 'Java Trainer (part-time)',
    org: 'Smart Code',
    location: 'Yerevan, Armenia',
    depth: 0,
    start: '2023-07',
    end: '2024-09',
    context: 'Backend engineering course for aspiring Java developers.',
    note: 'Concurrent contract; ran alongside the Energize Global Services and OMD roles.',
    points: [
      'Trained aspiring Java developers in core Java, Spring and backend engineering practice.',
      'Authored the course materials and hands-on exercises covering OOP, data structures, algorithms and clean code.',
    ],
    stack: [
      'Core Java',
      'Spring',
      'OOP',
      'Data Structures',
      'Algorithms',
      'Clean Code',
    ],
  },
  {
    id: 'omd',
    role: 'Senior Java Software Engineer',
    org: 'OMD',
    location: 'Yerevan, Armenia',
    client: 'Tick Data',
    depth: 0,
    start: '2024-09',
    end: null,
    context:
      'Financial data analytics platform delivering historical market data, tick-level processing and analytics for trading and quantitative research.',
    points: [
      'Architected reactive microservices in Java 21 and Micronaut with GraalVM native builds, powering tick-level market-data processing over Micronaut Data, R2DBC and JDBC.',
      'Designed REST APIs for internal and external consumers, including pageable, searchable endpoints with server-side filtering and sorting.',
      'Engineered streaming file downloads that deliver large files as they are generated, reworking the generation pipeline to cut wait times and memory footprint.',
      'Integrated asynchronous messaging over ActiveMQ and AWS SQS, plus real-time WebSocket channels, for decoupled event-driven services.',
      'Secured the API surface: authentication, authorization, JWT token lifecycle and role-based access control.',
      'Built a custom API gateway, a centralized configuration service with Caffeine caching and dynamic reload, and data-migration services for scheduled and on-demand runs.',
      'Own a Go platform module built on goroutines, worker-pool patterns and sync primitives for high-throughput concurrent data processing.',
      'Standardized platform API contracts with contract-first OpenAPI and code generation, and authored reusable validation and exception-handling libraries now used by every service team.',
      'Built tickwrite-sdlc, an internal Claude Code plugin used by the team in daily development: five skills, eight specialized subagents, hooks, a PowerShell state CLI and onboarding documentation.',
      'Maintains workspace and service CLAUDE.md / AGENTS.md instructions; integrated Jira/Confluence, codebase impact analysis and library documentation through MCP.',
      'Implemented ticket-scoped plan approval, service boundaries, failing-test evidence and generated-source protection, with local end-to-end checks and human merge-request review.',
      'Led team-wide adoption of Claude Code and OpenCode CLI to accelerate refactoring, test generation and documentation, keeping human review as the final quality gate.',
      'Instrumented services with structured logging and Grafana metrics, giving the team observability into production behaviour.',
      'Drove scalability and performance optimization through targeted refactoring and query tuning, tracking p95 / p99 latency to locate slow paths.',
      'Drive core system-design decisions for the Java services, mentor engineers through code review and own support for legacy versions.',
    ],
    stack: [
      'Java 21',
      'Go',
      'GraalVM',
      'Micronaut',
      'R2DBC',
      'PostgreSQL',
      'ActiveMQ',
      'WebSockets',
      'Caffeine',
      'OpenAPI',
      'Kubernetes',
      'Helm',
      'AWS',
      'Grafana',
    ],
  },
]

export type SpanGeometry = Span & {
  /** Percentage offset of the bar from the left edge of the track. */
  left: number
  /** Percentage width of the bar. */
  width: number
  months: number
  duration: string
  range: string
  isOpen: boolean
  index: number
}

export type Trace = {
  spans: SpanGeometry[]
  /** Whole-year ticks spanning the trace, for the axis. */
  years: { year: number; left: number }[]
  totalMonths: number
  totalDuration: string
  /** Distinct employers, which is not the same as the span count. */
  employers: number
  startYear: number
  endYear: number
}

/**
 * Projects the spans onto a 0–100 track.
 *
 * `nowYm` is passed in rather than read from the clock so the value is fixed at
 * build time and serialised into the HTML — computing it during hydration would
 * desync from the server render whenever a build straddles a month boundary.
 */
export function buildTrace(nowYm: string): Trace {
  const startYear = Number(SPANS[0].start.slice(0, 4))
  const endYear = Number(nowYm.slice(0, 4))

  /* The track starts at January of the first year rather than at the first
     span, so every year tick lands inside it. Anchoring to the first span
     instead pushes the opening tick off the left edge, which reads as a
     misaligned axis even though the maths is right. */
  const originM = monthIndex(`${startYear}-01`)
  const nowM = monthIndex(nowYm)
  // Pad the right edge by a month so an open span always has a visible bar.
  const totalMonths = nowM - originM + 1

  /**
   * Display order is reverse-chronological — the CV convention, and what a
   * reader scanning for "what are they doing now" expects first.
   *
   * SPANS stays authored oldest-first because that is the order the dates make
   * sense in, so the flip happens here: group each employer span with any
   * nested product spans that follow it, reverse the groups, and reverse the
   * children inside each group. A plain `.reverse()` would put children above
   * parents.
   */
  const ordered: Span[] = []
  const groups: Span[][] = []
  for (const s of SPANS) {
    if (s.depth === 0) groups.push([s])
    else groups[groups.length - 1]?.push(s)
  }
  for (const group of groups.reverse()) {
    const [parent, ...children] = group
    ordered.push(parent, ...children.reverse())
  }

  const spans: SpanGeometry[] = ordered.map((s, index) => {
    const startM = monthIndex(s.start)
    // Elapsed months for the label — an open span runs to this month only.
    const months = Math.max((s.end ? monthIndex(s.end) : nowM) - startM, 1)
    // Bar width may exceed that by the padding month, so "started this month"
    // still draws something. Keeping them separate stops the padding from
    // inflating the duration text.
    const barMonths = s.end === null ? months + 1 : months
    return {
      ...s,
      index,
      left: ((startM - originM) / totalMonths) * 100,
      width: (barMonths / totalMonths) * 100,
      months,
      duration: formatDuration(months),
      range: formatRange(s.start, s.end),
      isOpen: s.end === null,
    }
  })

  const years = []
  for (let y = startYear; y <= endYear; y++) {
    years.push({
      year: y,
      left: ((monthIndex(`${y}-01`) - originM) / totalMonths) * 100,
    })
  }

  return {
    spans,
    years,
    totalMonths,
    // Tenure runs from the first role's start to today, not from the axis.
    totalDuration: formatDuration(nowM - monthIndex(SPANS[0].start)),
    employers: new Set(SPANS.map((s) => s.org)).size,
    startYear,
    endYear,
  }
}

/* -------------------------------------------------------------------------- */

/**
 * The eight things this CV is actually built on, shown large.
 *
 * A flat wall of equal pills tells a reader nothing about what you reach for
 * first — everything is the same size, so nothing is emphasised and the type has
 * to shrink to fit. These get the space; the full taxonomy stays below as
 * supporting detail.
 */
export const CORE = [
  { name: 'Java', note: '8 · 11 · 17 · 21', icon: 'java.svg' },
  { name: 'Go', note: 'goroutines · worker pools', icon: 'go.svg' },
  { name: 'Spring Boot', note: '3.x · Security · Cloud', icon: 'spring.svg' },
  { name: 'Micronaut', note: 'Data · R2DBC · GraalVM', icon: 'micronaut.svg' },
  { name: 'PostgreSQL', note: 'schema · index tuning', icon: 'postgresql.svg' },
  { name: 'Apache Kafka', note: 'event-driven pipelines', icon: 'kafka.svg' },
  { name: 'Kubernetes', note: 'Docker · Helm · EKS', icon: 'kubernetes.svg' },
  { name: 'AWS', note: 'EKS · S3 · SQS · IAM', icon: 'aws.svg' },
] as const

export type SkillGroup = {
  label: string
  items: { name: string; icon?: string }[]
}

/** Grouped as in the CV, so the taxonomy stays recognisable side by side. */
export const SKILLS: SkillGroup[] = [
  {
    label: 'languages',
    items: [
      { name: 'Java 8 / 11 / 17 / 21', icon: 'java.svg' },
      { name: 'Go', icon: 'go.svg' },
      { name: 'SQL' },
      { name: 'Python', icon: 'python.svg' },
    ],
  },
  {
    label: 'frameworks',
    items: [
      { name: 'Spring Boot 3.x', icon: 'spring.svg' },
      { name: 'Spring Security', icon: 'spring.svg' },
      { name: 'Spring Cloud', icon: 'spring.svg' },
      { name: 'Spring Data', icon: 'spring.svg' },
      { name: 'Micronaut', icon: 'micronaut.svg' },
      { name: 'Micronaut Data', icon: 'micronaut.svg' },
      { name: 'Hibernate', icon: 'hibernate.svg' },
      { name: 'JPA' },
      { name: 'Apache Camel', icon: 'apachecamel.svg' },
      { name: 'Uber FX' },
    ],
  },
  {
    label: 'architecture',
    items: [
      { name: 'distributed systems' },
      { name: 'microservices' },
      { name: 'REST APIs' },
      { name: 'gRPC / Protobuf' },
      { name: 'event-driven & streaming' },
      { name: 'reactive services' },
      { name: 'concurrency & multithreading' },
      { name: 'high availability' },
      { name: 'performance optimization' },
      { name: 'SOLID' },
      { name: 'Clean Architecture' },
      { name: 'design patterns' },
      { name: 'contract-first OpenAPI', icon: 'openapi.svg' },
    ],
  },
  {
    label: 'messaging',
    items: [
      { name: 'Apache Kafka', icon: 'kafka.svg' },
      { name: 'ActiveMQ', icon: 'activemq.svg' },
      { name: 'AWS SQS', icon: 'aws.svg' },
      { name: 'WebSockets' },
      { name: 'Server-Sent Events' },
    ],
  },
  {
    label: 'data',
    items: [
      { name: 'PostgreSQL', icon: 'postgresql.svg' },
      { name: 'MySQL', icon: 'mysql.svg' },
      { name: 'Oracle', icon: 'oracle.svg' },
      { name: 'H2' },
      { name: 'advanced SQL' },
      { name: 'indexing & query tuning' },
      { name: 'MongoDB', icon: 'mongodb.svg' },
      { name: 'Redis', icon: 'redis.svg' },
      { name: 'Elasticsearch', icon: 'elasticsearch.svg' },
      { name: 'Flyway' },
      { name: 'Liquibase', icon: 'liquibase.svg' },
      { name: 'R2DBC' },
      { name: 'JDBC' },
      { name: 'MyBatis' },
    ],
  },
  {
    label: 'security',
    items: [
      { name: 'Spring Security', icon: 'spring.svg' },
      { name: 'OAuth2' },
      { name: 'JWT lifecycle', icon: 'jwt.svg' },
      { name: 'RBAC' },
      { name: 'Keycloak', icon: 'keycloak.svg' },
      { name: 'PASETO' },
    ],
  },
  {
    label: 'cloud & devops',
    items: [
      { name: 'AWS', icon: 'aws.svg' },
      { name: 'EKS · S3 · SQS · IAM · SSO · EC2' },
      { name: 'Docker', icon: 'docker.svg' },
      { name: 'Kubernetes', icon: 'kubernetes.svg' },
      { name: 'Helm', icon: 'helm.svg' },
      { name: 'GitHub Actions', icon: 'githubactions.svg' },
      { name: 'GitLab CI', icon: 'gitlab.svg' },
      { name: 'Nginx', icon: 'nginx.svg' },
      { name: 'Cloudflare', icon: 'cloudflare.svg' },
      { name: 'Linux', icon: 'linux.svg' },
    ],
  },
  {
    label: 'testing & performance',
    items: [
      { name: 'JUnit 5', icon: 'junit.svg' },
      { name: 'Mockito' },
      { name: 'AssertJ' },
      { name: 'integration & E2E automation' },
      { name: 'p95 / p99 latency tuning' },
      { name: 'query & throughput profiling' },
    ],
  },
  {
    label: 'observability',
    items: [
      { name: 'structured logging' },
      { name: 'Grafana', icon: 'grafana.svg' },
      { name: 'performance metrics' },
      { name: 'production debugging' },
      { name: 'incident response' },
    ],
  },
  {
    label: 'ai engineering',
    items: [
      { name: 'Claude Code', icon: 'claude.svg' },
      { name: 'OpenCode CLI' },
      { name: 'Anthropic API', icon: 'anthropic.svg' },
      { name: 'LLM-assisted refactoring' },
      { name: 'test generation' },
      { name: 'prompt engineering' },
    ],
  },
  {
    label: 'practices',
    items: [
      { name: 'team leadership' },
      { name: 'technical direction' },
      { name: 'system-design ownership' },
      { name: 'code & PR review' },
      { name: 'mentoring' },
      { name: 'Git', icon: 'git.svg' },
      { name: 'Agile / Scrum' },
      { name: 'Maven', icon: 'maven.svg' },
      { name: 'technical documentation' },
    ],
  },
]

/**
 * Work that sits outside the employment trace.
 *
 * SoulsHub is the one thing on the CV architected end to end from an empty
 * repository, so it gets a section rather than a row.
 */
export const PROJECTS = [
  {
    name: 'SoulsHub',
    role: 'Architecture & DevOps Engineer',
    when: 'Freelance · Jan 2024',
    summary:
      'An LLM-powered platform for interacting with AI representations of famous personalities, historical figures and mentors. Designed the resilient application and database architecture, configured Nginx and Cloudflare for routing, TLS termination and edge protection, and built the GitHub Actions CI/CD pipeline — automated builds, quality gates, approval steps and Docker image deploys to staging and production. Provisioned and hardened the AWS EC2 instances with security groups and IAM roles, and automated S3 database backups with scheduled jobs and version-based rollback.',
    stack: [
      'GitHub Actions',
      'GitHub Container Registry',
      'Nginx',
      'Cloudflare',
      'Docker',
      'AWS EC2 · S3 · IAM',
      'Linux',
    ],
  },
] as const

export type Certification = {
  name: string
  issuer: string
  year: string
  /** Verifiable credential ID, where the issuer publishes one. */
  credential: string | null
  /** Skills the issuer attaches to a scored assessment. */
  skills?: string[]
  url?: string
  expires?: string
}

/**
 * Reverse-chronological, so the most recent scores lead.
 *
 * The TestGorilla percentiles are carried in the title rather than a meta line:
 * "99th percentile" is the whole reason the entry is worth reading, and buried
 * under the issuer it reads as a footnote.
 */
export const CERTIFICATIONS: Certification[] = [
  {"name": "ChatGPT Deployment Practitioner", "issuer": "OpenAI", "year": "Oct 2026", "credential": null, "url": "https://oaipartnernetwork.credential.net/1843ca2e-b8dd-41af-8c9e-383d8ff5555a", "expires": "Oct 2027"},
  {"name": "Codex Deployment Practitioner", "issuer": "OpenAI", "year": "Oct 2026", "credential": null, "url": "https://oaipartnernetwork.credential.net/3b1d93cb-88ee-4bb0-a47b-1ac0a182518a", "expires": "Oct 2027"},
  {"name": "OpenAI Cyber Deployment Practitioner", "issuer": "OpenAI", "year": "Oct 2026", "credential": null, "url": "https://oaipartnernetwork.credential.net/bd63a5af-a690-4a18-9f8f-f10f02888ec6#acc.vYdcKUMm", "expires": "Oct 2027"},
  {"name": "ChatGPT Solutions Practitioner", "issuer": "OpenAI", "year": "Oct 2026", "credential": null, "url": "https://oaipartnernetwork.credential.net/7d337959-a321-401f-8ff6-62a7fea2ddf3#acc.bzupN1cg", "expires": "Oct 2027"},
  {"name": "OpenAI Consultative Solutions Practitioner", "issuer": "OpenAI", "year": "Oct 2026", "credential": null, "url": "https://oaipartnernetwork.credential.net/7fac0709-addc-4413-aace-dbbadeaf442c#acc.r81yHpt9", "expires": "Oct 2027"},
  {"name": "Codex Solutions Practitioner", "issuer": "OpenAI", "year": "Oct 2026", "credential": null, "url": "https://oaipartnernetwork.credential.net/a8945357-d8d4-444b-8c4e-cb7e1b0da641#acc.XN8SR5ca", "expires": "Oct 2027"},
  {"name": "OpenAI Cyber Solutions Practitioner", "issuer": "OpenAI", "year": "Oct 2026", "credential": null, "url": "https://oaipartnernetwork.credential.net/99f99f3b-b3da-4cf1-8894-f2f931c843bb#acc.fkUFqxvg", "expires": "Oct 2027"},
  {"name": "OpenAI Technical Practitioner", "issuer": "OpenAI", "year": "Oct 2026", "credential": null, "url": "https://oaipartnernetwork.credential.net/ffb5b6a7-7d2b-44a8-b565-898585e6efc9#acc.9n41jSHF", "expires": "Oct 2027"},
  {"name": "Certified Partner Specialist Gemini Enterprise Deployment", "issuer": "Google", "year": "Sep 2026", "credential": null, "url": "https://www.credly.com/badges/e50c82f9-2852-4653-b95f-88e84ef4b379/linked_in_profile", "expires": "Mar 2027"},
  {"name": "Add Agents to Gemini Enterprise", "issuer": "Google", "year": "Sep 2026", "credential": null, "url": "https://www.credly.com/badges/28ce8ac4-54c5-4c6d-af74-bcc59e359ff6/linked_in_profile"},
  {
    name: 'Spring — 99th percentile',
    issuer: 'TestGorilla',
    year: 'Aug 2026',
    credential: null,
    skills: ['Spring Boot'],
  },
  {
    name: 'Clean Code — 98th percentile',
    issuer: 'TestGorilla',
    year: 'Aug 2026',
    credential: null,
    skills: ['Design Patterns'],
  },
  {
    name: 'English B2 (Upper Intermediate) — 93rd percentile',
    issuer: 'TestGorilla',
    year: 'Aug 2026',
    credential: null,
    skills: ['English'],
  },
  {
    name: 'NoSQL Databases — 85th percentile',
    issuer: 'TestGorilla',
    year: 'Aug 2026',
    credential: null,
    skills: ['Redis', 'MongoDB'],
  },
  {
    name: 'AWS Cloud Practitioner Essentials',
    issuer: 'Amazon Web Services',
    year: 'Feb 2023',
    credential: '1CD4437E-4111-40EB-A4E1-54105F6F3C6F',
  },
  {
    name: 'AWS Cloud Essentials',
    issuer: 'Amazon Web Services',
    year: 'Feb 2023',
    credential: '189192CE-ADCC-406C-BC2A-8EEBB954F784',
  },
  {
    name: 'Java Development',
    issuer: 'Basic IT Center',
    year: 'Sep 2020',
    credential: null,
  },
  {
    name: 'Java Backend Trainee Program',
    issuer: 'PicsArt Armenia — intensive full-time backend program',
    year: '2020',
    credential: null,
  },
  {
    name: 'Java & Spring Backend Curriculum',
    issuer: 'Smart Code — authored and taught as instructor',
    year: '2023 — 2024',
    credential: null,
  },
]

/**
 * Skill clusters plotted in the hero's embedding space.
 *
 * Centres sit close enough that the shells intersect, so the three clusters
 * read as one organic mass at a glance and only separate on hover — the
 * composition is a single object, not three balls.
 */
export const CLUSTERS = [
  {
    id: 'jvm',
    label: 'jvm',
    color: '#60A5FA',
    // Additive blending on paper turns light colours invisible, so the light
    // theme needs genuinely dark ink rather than the same hues dimmed.
    colorLight: '#1D4ED8',
    center: [-0.92, 0.5, 0.15] as [number, number, number],
  },
  {
    id: 'concurrency',
    label: 'concurrency',
    color: '#6EE7B7',
    colorLight: '#0F7A5E',
    center: [0.95, 0.16, -0.3] as [number, number, number],
  },
  {
    id: 'infra',
    label: 'infra',
    color: '#A78BFA',
    colorLight: '#6D28D9',
    center: [0.04, -0.9, 0.28] as [number, number, number],
  },
] as const

/** Shell radius shared by the cloud and its hit targets. */
export const CLUSTER_RADIUS = 1.0

export const PROFILE = {
  name: 'Aghasi Khachatryan',
  role: 'Senior Backend Engineer',
  headline:
    'Senior Backend Engineer | Java, Go, Spring Boot, Distributed Systems, Cloud',
  location: 'Yerevan, Armenia',
  timezone: 'UTC+4',
  email: 'aghasikhachatryan04@gmail.com',
  phone: '+374 94 657895',
  github: 'https://github.com/mailtokhachatryan',
  githubUser: 'mailtokhachatryan',
  linkedin: 'https://www.linkedin.com/in/aghasi-khachatryan/',
  linkedinHandle: 'aghasi-khachatryan',
  site: 'https://mailtokhachatryan.github.io',
  /** URL-safe copy in `public/`; `download` restores the readable filename. */
  cv: '/Aghasi-Khachatryan-CV.pdf',
  cvFilename: 'Aghasi Khachatryan - AI-Native Backend Engineer - CV.pdf',
  photo: '/aghasi-khachatryan.jpg',
  education: {
    school:
      'National University of Architecture and Construction of Armenia (NUACA)',
    degree: 'BSc, Informatics and Computer Science',
    years: '2014 — 2018',
  },
  languages: [
    { name: 'Armenian', level: 'Native', flag: 'am' as const },
    { name: 'Russian', level: 'Fluent', flag: 'ru' as const },
    { name: 'English', level: 'B2', flag: 'gb' as const },
  ],
  domains: [
    'fintech',
    'banking',
    'market data',
    'e-commerce',
    'logistics',
    'cloud infrastructure',
    'education',
  ],
} as const
