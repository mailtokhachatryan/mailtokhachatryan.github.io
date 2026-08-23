/**
 * Generates brand icons into public/icons from the local `simple-icons`
 * package — no network, no CDN, no flakiness.
 *
 *   npm run icons
 *
 * Reading from an installed, version-pinned dependency makes the result
 * reproducible and reviewable in a diff, rather than depending on a third-party
 * host being reachable and on slugs not being renamed upstream.
 *
 * Icons are CC0. The marks themselves remain their owners' trademarks, which is
 * fine for referring to the products you actually use.
 *
 * Only real products are listed. Concepts — RBAC, SOLID, clean architecture,
 * code review, mentoring, p95 tuning — have no logo, and inventing marks for
 * them would be worse than leaving them as text.
 *
 * Anything absent from the installed simple-icons version is reported at the
 * end and simply renders as text: `SkillIcon` drops an icon whose file 404s, so
 * a missing mark never shows a broken-image glyph.
 *
 * Not generated here, deliberately:
 *   - oracle.svg — no longer published in the package (trademark), so the file
 *     is committed rather than regenerated. Do not delete it expecting a re-run
 *     to restore it.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as si from 'simple-icons'

// Resolved from this file, so the directory you run it from does not matter.
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public/icons')

/** output filename -> simple-icons export name */
const ICONS = {
  // languages
  'go.svg': 'siGo',
  'python.svg': 'siPython',
  // frameworks
  'spring.svg': 'siSpring',
  'micronaut.svg': 'siMicronaut',
  'hibernate.svg': 'siHibernate',
  'apachecamel.svg': 'siApachecamel',
  // messaging
  'kafka.svg': 'siApachekafka',
  'activemq.svg': 'siApacheactivemq',
  // data
  'postgresql.svg': 'siPostgresql',
  'mysql.svg': 'siMysql',
  'mongodb.svg': 'siMongodb',
  'redis.svg': 'siRedis',
  'elasticsearch.svg': 'siElasticsearch',
  'liquibase.svg': 'siLiquibase',
  // security
  'keycloak.svg': 'siKeycloak',
  'jwt.svg': 'siJsonwebtokens',
  // cloud & devops
  'docker.svg': 'siDocker',
  'kubernetes.svg': 'siKubernetes',
  'helm.svg': 'siHelm',
  'githubactions.svg': 'siGithubactions',
  'gitlab.svg': 'siGitlab',
  'nginx.svg': 'siNginx',
  'cloudflare.svg': 'siCloudflare',
  'linux.svg': 'siLinux',
  // testing, tooling, observability
  'junit.svg': 'siJunit5',
  'grafana.svg': 'siGrafana',
  'maven.svg': 'siApachemaven',
  'git.svg': 'siGit',
  'openapi.svg': 'siOpenapiinitiative',
  // ai engineering
  'claude.svg': 'siClaude',
  'anthropic.svg': 'siAnthropic',
}

/**
 * Clamps a brand colour into a mid-lightness band, preserving hue and
 * saturation.
 *
 * These icons sit on a near-black page AND on a paper one, so an official hex
 * at either extreme vanishes on one of them. Apache Kafka is #231F20 — all but
 * invisible on the dark theme — and the same is true of JWT and Keycloak. Only
 * lightness is touched, so each mark stays recognisably its own colour.
 */
function legible(hex) {
  const n = parseInt(hex, 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min

  const MIN_L = 0.42
  const MAX_L = 0.8
  if (l >= MIN_L && l <= MAX_L) return hex

  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }

  const L = Math.min(Math.max(l, MIN_L), MAX_L)
  const c = (1 - Math.abs(2 * L - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = L - c / 2
  const seg = Math.floor(h / 60) % 6
  const rgb = [
    [c, x, 0], [x, c, 0], [0, c, x],
    [0, x, c], [x, 0, c], [c, 0, x],
  ][seg]

  return rgb
    .map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

/**
 * simple-icons ships a 24x24 path and the official hex. The fill is baked in
 * rather than left to `currentColor`, because these sit on both a near-black and
 * a paper background and need to stay brand-coloured on each.
 */
function toSvg({ title, hex, path }) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ` +
    `fill="#${legible(hex)}" role="img"><title>${title}</title>` +
    `<path d="${path}"/></svg>\n`
  )
}

await mkdir(OUT, { recursive: true })

const written = []
const missing = []

for (const [file, exportName] of Object.entries(ICONS)) {
  const icon = si[exportName]
  if (!icon) {
    missing.push(`${file} -> ${exportName}`)
    continue
  }
  await writeFile(join(OUT, file), toSvg(icon), 'utf8')
  written.push(file)
}

console.log(`Output: ${OUT}`)
console.log(`Wrote ${written.length} icon(s).`)

if (missing.length) {
  console.log(`\n${missing.length} export(s) not found in this simple-icons version:`)
  missing.forEach((m) => console.log('  ✗', m))
  console.log('\nThese render as plain text, which is fine.')
  console.log('Look up the current name at https://simpleicons.org and update ICONS.')
}
