import type { NextConfig } from 'next'

/**
 * GitHub Pages serves a plain static bundle, so the whole site is exported at
 * build time. This turns off every server-dependent Next.js feature: no SSR at
 * request time, no route handlers, no ISR, no image optimizer.
 *
 * `mailtokhachatryan.github.io` is a user site served from the domain root, so
 * no basePath or assetPrefix is needed. A project repo would need both.
 */
const nextConfig: NextConfig = {
  output: 'export',
  // No optimizer server exists in a static export; images are served as-is.
  images: { unoptimized: true },
  // Emit `about/index.html` rather than `about.html` so Pages resolves
  // extensionless URLs without redirects.
  trailingSlash: true,
  reactStrictMode: true,
  // Next writes AGENTS.md / CLAUDE.md into the repo root on first run; this is
  // a portfolio, not an agent workspace, so opt out.
  agentRules: false,
}

export default nextConfig
