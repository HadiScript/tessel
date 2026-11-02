import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/anim'
import { kit } from '../content'
import { Mark } from './Chrome'

/** A CSS-3D cube that slowly turns; faces are little interface fragments. */
function Cube() {
  return (
    <div className="cube-stage" aria-hidden>
      <div className="cube">
        {['front', 'back', 'right', 'left', 'top', 'bottom'].map((f) => (
          <span key={f} className={`face ${f}`}>
            <i className="f-grid" />
            <i className="f-dial" />
            <i className="f-dot" />
          </span>
        ))}
      </div>
    </div>
  )
}

/** The same cube unfolded into a net — the "parts list" of the product. */
function Net() {
  return (
    <div className="net" aria-hidden>
      {[
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 2],
      ].map(([x, y], i) => (
        <span key={i} className="face" style={{ gridColumn: x + 1, gridRow: y + 1 }}>
          <i className="f-grid" />
          {i === 3 && <i className="f-dial" />}
          {i % 2 === 0 && <i className="f-dot" />}
        </span>
      ))}
    </div>
  )
}

export function Kit() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.kit-card', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 80%' },
      })
      gsap.fromTo(
        '.net .face',
        { rotate: (i) => (i % 2 ? 25 : -25), y: 40, opacity: 0 },
        { rotate: 0, y: 0, opacity: 1, stagger: 0.08, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.net', start: 'top 80%' } },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="kit s-base" ref={root} data-tone="base">
      <div className="kit-grid">
        <div className="kit-left">
          <div className="kit-card card">
            <Cube />
          </div>
          <div className="kit-bar mono">
            {kit.bar.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
        </div>
        <div className="kit-card card kit-main">
          <span className="kit-corner">
            {kit.corner.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </span>
          <span className="kit-sym" aria-hidden>
            ⇵
          </span>
          <div className="kit-logo">
            <span className="kit-badge-mark">
              <Mark />
            </span>
            <b>{kit.name}</b>
            <em className="mono">{kit.badge}</em>
          </div>
          <p className="mono kit-tag">
            {kit.tagline.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </p>
          <div className="kit-actions">
            <a href="#studio" className="kit-about">
              {kit.about}
            </a>
            <a href="#contact" className="kit-live" data-cursor="Open">
              {kit.live}
              <svg viewBox="0 0 32 20" aria-hidden>
                <path d="M2 16c6-12 14-12 18-6s8 4 10-8M22 2h8v8" />
              </svg>
            </a>
          </div>
        </div>
        <div className="kit-card card kit-net">
          <Net />
        </div>
      </div>
    </section>
  )
}
