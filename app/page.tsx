import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import TraceWaterfall from '@/components/TraceWaterfall'
import Projects from '@/components/Projects'
import Stack from '@/components/Stack'
import Education from '@/components/Education'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'

/**
 * Server Component. `new Date()` here resolves at build time and only seeds the
 * first render; the sections that care recompute from the live clock after
 * mount via `useNowYm`.
 *
 * Practical consequence: tenure, open-span durations and the copyright year
 * advance by themselves, with no redeploy.
 */
export default function Page() {
  /* Build-time month only — it seeds the first render so the static HTML and
     crawlers see a correct figure. Each section then recomputes from the live
     clock on mount, which is what removes the monthly-redeploy chore. */
  const now = new Date()
  const nowYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  return (
    <>
      <ScrollProgress />
      {/* First thing in the tab order: the nav is fixed and the page is long. */}
      <a className="skip-link" href="#trace">
        Skip to content
      </a>
      <Nav />
      <main id="content">
        <Hero nowYm={nowYm} />
        <TraceWaterfall nowYm={nowYm} />
        <Projects />
        <Stack />
        <Education />
        <About nowYm={nowYm} />
        <Contact />
      </main>
      <Footer year={now.getFullYear()} />
    </>
  )
}
