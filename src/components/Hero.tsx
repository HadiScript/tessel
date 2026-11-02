import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/anim'
import { hero } from '../content'
import { Helix } from './Helix'

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const stretch = useRef(0)

  useLayoutEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.hero-media', { clipPath: 'inset(0% 0% 100% 0% round 30px)', duration: 1.6, ease: 'expo.inOut' })
        .fromTo('.arrow path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'expo.inOut' }, 0.15)
        .from('.hero-rule', { scaleX: 0, transformOrigin: 'left', duration: 1.4 }, 0.4)
        .from('.hero-words > *, .hero-since', { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.07 }, 0.6)
        .from('.hero-chip', { y: -10, opacity: 0, duration: 0.8 }, 1)

      gsap.to('.arrow', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (st) => (stretch.current = st.progress),
      })
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section className="hero s-base" id="top" ref={root} data-tone="base">
      <div className="hero-visual">
        <svg className="arrow" viewBox="0 0 300 330" aria-hidden>
          <path pathLength={1} d="M205 22 L 95 68 Q 40 92 40 150 Q 40 185 66 211 L 205 300" />
          <path pathLength={1} d="M70 300 H 222 V 150" />
        </svg>
        <div className="hero-media s-panel" data-cursor="Spin">
          <Helix stretch={stretch} />
          <span className="hero-coords mono">
            38.72° N
            <br />
            9.14° W
          </span>
          <span className="hero-count mono">
            /01
            <br />
            CRAFT
          </span>
        </div>
        <span className="hero-chip mono">
          <i /> {hero.chip}
        </span>
      </div>
      <div className="hero-words">
        <h1>{hero.cols[0]}</h1>
        <p>{hero.cols[1]}</p>
        <p>{hero.cols[2]}</p>
      </div>
      <div className="hero-rule" />
      <span className="hero-since mono">{hero.since}</span>
    </section>
  )
}
