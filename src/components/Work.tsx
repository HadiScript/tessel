import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import { gsap, scrollToHash } from '../lib/anim'
import { work, type Project } from '../content'
import { AudioMock, BankMock, ClimateMock } from './Mocks'

const MOCKS = { bank: BankMock, climate: ClimateMock, audio: AudioMock }

// A few "pixels" that drift around the device frame like a dissolving image.
const PIXELS = [
  [0.72, 0, 0.9],
  [0.78, 0, 0.6],
  [0.84, 0, 0.3],
  [0.9, 0, 0.75],
  [0.78, 0.07, 0.45],
  [0.84, 0.07, 0.8],
  [0.9, 0.07, 0.2],
  [0.84, 0.14, 0.55],
  [0.9, 0.14, 0.35],
  [0.06, 0.86, 0.3],
  [0.12, 0.86, 0.15],
  [0.18, 0.93, 0.25],
]

function Featured({ p }: { p: Project }) {
  const Mock = MOCKS[p.mock]
  return (
    <article className="featured" id={p.id} style={{ '--h1': p.hues[0], '--h2': p.hues[1], '--h3': p.hues[2] } as CSSProperties}>
      <div className="cover" aria-hidden>
        <i className="b1" />
        <i className="b2" />
        <i className="b3" />
      </div>
      <div className="feat-inner">
        <div className="feat-card" data-cursor="View case">
          <span className="feat-line" />
          {PIXELS.map(([x, y, o], i) => (
            <i key={i} className="px" style={{ left: `${x * 100}%`, top: `${y * 100}%`, opacity: o }} />
          ))}
          <div className="feat-screen">
            <Mock />
          </div>
          <span className="feat-name">{p.name}</span>
        </div>
        <p className="feat-desc">
          <span className="mono">{p.kind}</span>
          <span>
            <i>↳</i> {p.blurb}
          </span>
        </p>
      </div>
    </article>
  )
}

export function Work() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.featured').forEach((f) => {
        const st = { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true }
        gsap.fromTo(f.querySelector('.cover'), { yPercent: -12 }, { yPercent: 12, ease: 'none', scrollTrigger: st })
        gsap.fromTo(f.querySelector('.feat-screen'), { yPercent: 18 }, { yPercent: -18, ease: 'none', scrollTrigger: st })
        gsap.fromTo(
          f.querySelectorAll('.px'),
          { x: 0, y: 0 },
          { x: (i) => (i % 2 ? 30 : -20) * (1 + (i % 3)), y: (i) => -20 * (1 + (i % 4)), ease: 'none', scrollTrigger: st },
        )
        gsap.from(f.querySelector('.feat-card'), {
          clipPath: 'inset(12% 12% 12% 12%)',
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: f, start: 'top 70%' },
        })
        gsap.from(f.querySelectorAll('.feat-desc > *'), {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: f.querySelector('.feat-desc'), start: 'top 92%' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="work" id="work" ref={root} data-tone="media">
      <div className="work-frame" aria-hidden>
        <i className="corner c1" />
        <i className="corner c2" />
        <i className="corner c3" />
        <i className="corner c4" />
      </div>
      <a
        className="work-title"
        href="#contact"
        onClick={(e) => {
          e.preventDefault()
          scrollToHash('#contact')
        }}
      >
        <span className="mono">Featured</span>
        <span className="roll" data-text="Start one">
          <span>Work</span>
        </span>
      </a>
      {work.map((p) => (
        <Featured key={p.id} p={p} />
      ))}
    </section>
  )
}
