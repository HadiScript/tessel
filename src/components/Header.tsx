import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { scrollToHash } from '../lib/anim'
import { site, work } from '../content'
import { ModeSwitch } from './Chrome'

/** Line-art brand mark: crosshair through a circle and a rounded tile, with two satellite dots. */
function LineMark() {
  return (
    <svg className="line-mark" viewBox="0 0 96 76" aria-hidden>
      <path d="M62 2v72M8 38h84" />
      <circle cx="50" cy="38" r="15" />
      <rect x="61" y="23" width="30" height="30" rx="10" />
      <circle cx="10" cy="31" r="2.6" className="dot" />
      <circle cx="17" cy="45" r="2.6" className="dot" />
    </svg>
  )
}

/*
 * Two pills like a split toolbar. At the top: a big dark brand block + a dark nav bar.
 * Once scrolled: the brand collapses into a small light pill and the nav bar drops its
 * background, its text colour following whatever section is underneath (data-tone).
 * The "+" grows the nav bar into a full menu panel.
 */
export function Header({ onStudio }: { onStudio: () => void }) {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => {
      const h = root.current!
      h.classList.toggle('is-compact', window.scrollY > 60)
      // tone of the section under the nav bar
      let tone = 'base'
      for (const s of document.querySelectorAll<HTMLElement>('[data-tone]')) {
        const r = s.getBoundingClientRect()
        if (r.top <= 24 && r.bottom > 24) tone = s.dataset.tone!
      }
      h.dataset.tone = tone
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [open])

  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setOpen(false)
    scrollToHash(e.currentTarget.getAttribute('href')!)
  }

  return (
    <header className={`site-header ${open ? 'menu-open' : ''}`} ref={root} data-tone="base">
      <a href="#top" className="logo-pill" onClick={go} aria-label={`${site.brand} — back to top`}>
        <span className="logo-type">
          <span className="logo-word">{site.brand}</span>
          <span className="logo-jp">{site.jp}</span>
        </span>
        <span className="logo-cap mono">{site.caption}</span>
        <LineMark />
        <span className="logo-ring" aria-hidden />
      </a>

      <div className="nav-wrap">
        <div className="nav-bg" />
        <nav className="nav-row">
          {site.nav.map((n) => (
            <a key={n.href} href={n.href} onClick={go} className="nav-item">
              <span className="roll" data-text={n.label}>
                <span>{n.label}</span>
              </span>
              {n.sup && <sup>{n.sup === '*' ? '*' : `(${n.sup})`}</sup>}
            </a>
          ))}
          <span className="nav-tools">
            <ModeSwitch />
            <button className="studio-btn" onClick={onStudio} aria-label="Open Theme Studio" data-cursor="Studio">
              <svg viewBox="0 0 24 24" aria-hidden>
                <circle cx="7.5" cy="9" r="2" />
                <circle cx="12" cy="6" r="2" />
                <circle cx="16.5" cy="9" r="2" />
                <path d="M12 21a9 9 0 1 1 9-9c0 2-1.6 3-3.5 3H16a2 2 0 0 0-1.4 3.4c.6.7.2 2.6-2.6 2.6z" />
              </svg>
              <span className="mono">Theme</span>
            </button>
            <button
              className="menu-btn"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <i />
              <i />
            </button>
          </span>
        </nav>

        <div className="menu-panel" aria-hidden={!open}>
          <div className="menu-team">
            {site.team.map((t, i) => (
              <span key={t} className={`avatar a${i}`}>
                {t}
              </span>
            ))}
          </div>
          <div className="menu-links">
            {site.nav.map((n) => (
              <a key={n.href} href={n.href} onClick={go} tabIndex={open ? 0 : -1}>
                {n.label}
                {n.sup && <sup>{n.sup === '*' ? '*' : `(${n.sup})`}</sup>}
              </a>
            ))}
          </div>
          <div className="menu-feat">
            {work.map((p) => (
              <a key={p.id} href={`#${p.id}`} onClick={go} tabIndex={open ? 0 : -1}>
                <i style={{ background: `linear-gradient(135deg, ${p.hues[0]}, ${p.hues[1]})` }} />
                {p.name}
                <sup>↗</sup>
              </a>
            ))}
          </div>
          <div className="menu-social">
            {site.socials.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <a className="menu-mail" href={`mailto:${site.email}`} tabIndex={open ? 0 : -1}>
            {site.email}
          </a>
          <span className="menu-copy">©{new Date().getFullYear()}</span>
          <span className="menu-note">{site.menuNote}</span>
        </div>
      </div>
    </header>
  )
}
