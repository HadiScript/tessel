import { useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { gsap, scrollToHash } from '../lib/anim'
import { contact, site, voices } from '../content'
import { Mark } from './Chrome'

export function Voices() {
  const root = useRef<HTMLElement>(null)
  const [i, setI] = useState(0)

  const go = (dir: number) => {
    const q = root.current!.querySelector('.vo-body')!
    gsap.to(q, {
      opacity: 0,
      x: -40 * dir,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setI((v) => (v + dir + voices.length) % voices.length)
        gsap.fromTo(q, { opacity: 0, x: 40 * dir }, { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out' })
      },
    })
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.vo-head > *, .vo-body', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const v = voices[i]
  return (
    <section className="voices s-base" ref={root} data-tone="base">
      <div className="vo-head">
        <h2>
          Gather round <em>—</em> client notes, unfiltered.
        </h2>
        <p>Projects end; relationships don’t. A few words from the teams we’ve built with — the ideas, the pace, the small wins along the way.</p>
      </div>
      <div className="vo-stage">
        <button className="vo-btn mono" onClick={() => go(-1)} data-cursor="Prev">
          PREV
        </button>
        <span className="vo-count mono">
          {String(i + 1).padStart(2, '0')} <em>/ {String(voices.length).padStart(2, '0')}</em>
        </span>
        <div className="vo-body">
          <span className="vo-q" aria-hidden>
            “
          </span>
          <blockquote>{v.quote}</blockquote>
          <span className="vo-q" aria-hidden>
            ”
          </span>
          <footer>
            <span className="vo-avatar">{v.name.split(' ').map((n) => n[0]).join('')}</span>
            <span>
              <b>{v.name}</b>
              <em>{v.role}</em>
            </span>
          </footer>
          <span className="vo-src mono">
            SOURCE: <Mark />
          </span>
        </div>
        <button className="vo-btn mono" onClick={() => go(1)} data-cursor="Next">
          NEXT
        </button>
      </div>
    </section>
  )
}

export function Contact() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ct-title, .ct-card, .ct-send', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
      gsap.from('.ct-mono span', {
        opacity: 0,
        duration: 0.4,
        stagger: 0.02,
        scrollTrigger: { trigger: '.ct-mono', start: 'top 90%' },
      })
      gsap.fromTo(
        '.ct-obj',
        { rotate: -25, yPercent: 10 },
        { rotate: 15, yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.ct-card', start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.from('.ct-big .roll', {
        yPercent: 110,
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.ct-big', start: 'top 95%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    const h = e.currentTarget.getAttribute('href')!
    if (!h.startsWith('#')) return
    e.preventDefault()
    scrollToHash(h)
  }

  return (
    <section className="contact s-base" id="contact" ref={root} data-tone="base">
      <h2 className="ct-title">{contact.eyebrow}</h2>
      <div className="ct-card" aria-hidden>
        <div className="ct-obj">
          <i className="cap" />
          <i className="mid">
            <b />
            <b />
          </i>
          <i className="cap is-b" />
        </div>
        <span className="ct-notch">↶</span>
      </div>
      <p className="ct-mono mono">
        {contact.mono.split(' ').map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </p>
      <a href={`mailto:${site.email}`} className="ct-send" data-cursor="Write" aria-label={`Email ${site.email}`}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M20 5v8a3 3 0 0 1-3 3H5m5-5-5 5 5 5" />
        </svg>
      </a>

      <div className="ct-rule">
        <span className="ct-chip mono">
          <i /> {contact.footer}
        </span>
      </div>

      <nav className="ct-big">
        {site.nav.map((n) => (
          <a key={n.href} href={n.href} onClick={go}>
            <span className="roll" data-text={n.label}>
              <span>{n.label}</span>
            </span>
          </a>
        ))}
      </nav>

      <div className="ct-social">
        {site.socials.map((s) => (
          <a key={s} href="#" onClick={(e) => e.preventDefault()}>
            {s}
          </a>
        ))}
      </div>

      <footer className="ct-foot mono">
        <span>PRIVACY · COOKIE PREFERENCES</span>
        <span>©{new Date().getFullYear()}</span>
        <button onClick={() => scrollToHash('#top')}>BACK TO TOP ↑</button>
      </footer>
    </section>
  )
}
