'use client'

import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

export const THEME_KEY = 'theme'
export const THEME_EVENT = 'themechange'

/**
 * Applied by an inline script in <head> before first paint, so the page never
 * flashes the wrong theme. Kept as a plain string here because that script
 * cannot import anything — if you change one, change both.
 */
export const THEME_BOOTSTRAP = `
(function(){
  try {
    var t = localStorage.getItem('${THEME_KEY}');
    if (t !== 'light' && t !== 'dark') {
      t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.dataset.theme = t;
    document.documentElement.style.colorScheme = t;
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }
})();
`

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Private mode or blocked storage — the theme still applies this session.
  }
  window.dispatchEvent(new Event(THEME_EVENT))
}

/**
 * Reads the theme from the DOM rather than owning it in React state, since the
 * bootstrap script sets it before React exists. Components that need to react
 * to a change — the WebGL hero, which has to swap blend modes — subscribe here.
 */
export function useTheme(): Theme {
  // Always starts 'dark' so the server render and first client render agree;
  // the effect corrects it immediately after mount.
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const read = () => {
      setThemeState(
        document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
      )
    }
    read()
    window.addEventListener(THEME_EVENT, read)
    return () => window.removeEventListener(THEME_EVENT, read)
  }, [])

  return theme
}
