import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/anim'
import { studioCopy as s, trust } from '../content'
import { Mark } from './Chrome'

export function StudioSection() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.st-statement .line > span', {
        yPercent: 110,
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.st-statement', start: 'top 85%' },
      })
      gsap.to('.st-orb .mark', {
        rotate: 360,
        ease: 'none',
        scrollTrigger: { trigger: '.st-lead', start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
      gsap.from('.st-lead p, .st-cols p', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.st-lead', start: 'top 85%' },
      })
      // giant letters rise out of the band as it scrolls through
      gsap.fromTo(
        '.st-letters .g',
        { yPercent: (i) => 18 + i * 8 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.st-giant', start: 'top bottom', end: 'center center', scrub: true },
        },
      )
      gsap.to('.tr-plus', {
        rotate: 360,
        ease: 'none',
        scrollTrigger: { trigger: '.trust', start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.from('.tr-card, .tr-head, .tr-pills > *', {
        y: 50,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.tr-card', start: 'top 85%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const words = s.manifesto.split(' ')
  const half = Math.ceil(words.length / 2)
  return (
    <div ref={root}>
      <section className="studio s-base" id="studio" data-tone="base">
        <h2 className="st-statement" aria-label={s.statement}>
          {[s.statement.split('. ')[0] + '.', s.statement.split('. ').slice(1).join('. ')].map((l) => (
            <span className="line" key={l} aria-hidden>
              <span>{l}</span>
            </span>
          ))}
        </h2>

        <div className="st-lead">
          <div className="st-orb" aria-hidden>
            <Mark />
          </div>
          <span className="mono st-label">
            {s.label.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </span>
          <p>{s.lead}</p>
        </div>

        <div className="st-cols">
          {s.cols.map((c) => (
            <p key={c}>{c}</p>
          ))}
        </div>
      </section>

      <div className="st-giant" aria-hidden>
        <div className="st-letters">
          {s.giant.split('').map((c, i) => (
            <span className="g" key={i}>
              {c}
            </span>
          ))}
        </div>
        <div className="st-band mono">
          {[words.slice(0, half), words.slice(half)].map((row, r) => (
            <div key={r}>
              {row.map((w, i) => (
                <span key={i}>{w}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="trust s-soft" data-tone="soft">
        <p className="tr-lead">{trust.lead}</p>
        <div className="tr-stage">
          <span className="tr-plus" aria-hidden>
            ✚
          </span>
          <div className="tr-card" aria-hidden>
            <div className="tr-bot">
              <i className="arm" />
              <i className="head" />
              <i className="body">
                <b />
                <b />
              </i>
            </div>
            <span className="tr-tag mono">{trust.tag}</span>
          </div>
        </div>
        <h3 className="tr-head">{trust.heading}</h3>
        <svg className="tr-icon" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="4" r="2" />
          <circle cx="5" cy="19" r="2" />
          <circle cx="12" cy="19" r="2" />
          <circle cx="19" cy="19" r="2" />
          <path d="M12 6v11M12 11c-5 0-7 2-7 6M12 11c5 0 7 2 7 6" />
        </svg>
        <div className="tr-pills">
          {trust.pills.map((p) => (
            <span key={p}>
              <i className="mono">W/</i>
              {p}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
