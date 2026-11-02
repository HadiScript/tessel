import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { gsap, scrollToHash } from '../lib/anim'
import { intro, site, work } from '../content'

const ICONS = {
  eye: (
    <svg viewBox="0 0 32 32">
      <path d="M3 16s5-8 13-8 13 8 13 8-5 8-13 8S3 16 3 16z" />
      <circle cx="16" cy="16" r="4" className="fill" />
    </svg>
  ),
  gear: (
    <svg viewBox="0 0 32 32">
      <path d="M16 4l10.4 6v12L16 28 5.6 22V10z" />
      <circle cx="16" cy="16" r="4.5" />
    </svg>
  ),
}

const MARKS: Record<string, ReactNode> = {
  sotd: (
    <svg viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="17" className="fill" />
      <path d="M10 18c8 4 20 4 28 0M8 26c9 4 23 4 32 0M11 34c8 3 18 3 26 0" className="cut" />
    </svg>
  ),
  dev: (
    <svg viewBox="0 0 48 48">
      <path d="M17 14 7 24l10 10M31 14l10 10-10 10M27 10l-6 28" />
    </svg>
  ),
  pod: (
    <svg viewBox="0 0 48 48">
      <path d="M8 36V12h9l7 14 7-14h9v24" />
    </svg>
  ),
  soy: (
    <svg viewBox="0 0 48 48">
      <path d="M14 10h14l-8 14h14L20 38l4-10H12z" className="solid" />
    </svg>
  ),
}

function useNow() {
  const [now, set] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => set(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

function Clock() {
  const now = useNow()
  const at = (tz: string) => {
    const s = now.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false })
    const [h, m] = s.split(':').map(Number)
    return { s, h, m }
  }
  const a = at(intro.zones[0].tz)
  const b = at(intro.zones[1].tz)
  const sec = now.getSeconds()
  return (
    <div className="clock">
      <span className="mono clock-zone is-a">
        <i />
        {intro.zones[0].city}
        <br />
        {a.s}
      </span>
      <svg viewBox="0 0 100 100" className="clock-face" role="img" aria-label={`Lisbon time ${a.s}`}>
        <circle cx="50" cy="50" r="49" className="disc" />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="50" y1="6" x2="50" y2={i % 3 ? 10 : 12} transform={`rotate(${i * 30} 50 50)`} />
        ))}
        <line className="hand" x1="50" y1="50" x2="50" y2="28" transform={`rotate(${(a.h % 12) * 30 + a.m / 2} 50 50)`} />
        <line className="hand" x1="50" y1="50" x2="50" y2="16" transform={`rotate(${a.m * 6} 50 50)`} />
        <line className="hand s" x1="50" y1="56" x2="50" y2="12" transform={`rotate(${sec * 6} 50 50)`} />
        <circle cx="50" cy="50" r="4" className="pin" />
        <circle cx="50" cy="50" r="1.6" className="pin-in" />
      </svg>
      <span className="mono clock-zone is-b">
        {intro.zones[1].city}
        <br />
        {b.s}
      </span>
    </div>
  )
}

export function Intro() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.intro-text .w', {
        yPercent: 60,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.015,
        scrollTrigger: { trigger: '.intro-text', start: 'top 85%' },
      })
      gsap.from('.award', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.07,
        scrollTrigger: { trigger: '.awards', start: 'top 90%' },
      })
      gsap.from('.shot', {
        clipPath: 'inset(0 0 100% 0 round 20px)',
        duration: 1.3,
        ease: 'expo.inOut',
        stagger: 0.1,
        scrollTrigger: { trigger: '.shots', start: 'top 92%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const tilt = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget.querySelector('.award-mark')
    const r = e.currentTarget.getBoundingClientRect()
    gsap.to(el, {
      x: ((e.clientX - r.left) / r.width - 0.5) * 24,
      y: ((e.clientY - r.top) / r.height - 0.5) * 24,
      duration: 0.6,
      ease: 'power3.out',
    })
  }
  const untilt = (e: PointerEvent<HTMLElement>) =>
    gsap.to(e.currentTarget.querySelector('.award-mark'), { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' })

  let k = 0
  return (
    <section className="intro s-base" ref={root} data-tone="base">
      <div className="brief">
        <p className="intro-text">
          {intro.parts.map((part, i) =>
            typeof part === 'string' ? (
              part.split(' ').map((w) => (
                <span className="w" key={`${i}-${k++}`}>
                  {w}{' '}
                </span>
              ))
            ) : part.sup ? (
              <sup key={i} className="w">
                {part.sup}
              </sup>
            ) : (
              <span key={i} className="w glyph">
                {ICONS[part.icon!]}{' '}
              </span>
            ),
          )}
          <span className="w brief-arrow" aria-hidden>
            ↓
          </span>
        </p>
        <button className="btn-light" onClick={() => scrollToHash('#contact')}>
          <span className="roll" data-text={intro.cta}>
            <span>{intro.cta}</span>
          </span>
        </button>
      </div>

      <div className="awards">
        {intro.awards.map((a) => (
          <article key={a.title} className="award card" onPointerMove={tilt} onPointerLeave={untilt}>
            <header>
              <span>
                {a.title} <em>{a.note}</em>
              </span>
              <small>{a.year}</small>
            </header>
            <div className="award-mark">{MARKS[a.mark]}</div>
            <footer className="mono">{a.src}</footer>
          </article>
        ))}
      </div>

      <div className="about-time">
        <Clock />
        <div className="shots">
          {work.slice(0, 2).map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="shot"
              style={{ '--h1': p.hues[0], '--h2': p.hues[1], '--h3': p.hues[2] } as CSSProperties}
              onClick={(e) => {
                e.preventDefault()
                scrollToHash(`#${p.id}`)
              }}
              data-cursor="View"
            >
              <span className="shot-glyph">{p.name[0]}</span>
              <span className="mono">{p.name}</span>
            </a>
          ))}
          <div className="shot shot-brand">
            <span className="mono sb-top">Brand identity · Web</span>
            <div className="sb-logo">
              <span>
                {site.brand}
                <small>{site.jp}</small>
              </span>
              <span className="mono">{site.caption}</span>
            </div>
            <div className="sb-cols">
              <span>House of considered interfaces ©</span>
              <span>Where well-built products are born.</span>
              <span>End-to-end design and engineering.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
