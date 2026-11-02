import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/anim'
import { design } from '../content'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=/<>'

// Pixel-style arrow made of squares (pointing down by default).
function PixelArrow({ up = false }: { up?: boolean }) {
  const px = [
    [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [0, 2], [1, 3], [2, 4], [6, 2], [5, 3], [4, 4],
  ]
  return (
    <svg className={`px-arrow ${up ? 'is-up' : ''}`} viewBox="0 0 7 6" aria-hidden>
      {px.map(([x, y]) => (
        <rect key={`${x}${y}`} x={x} y={y} width="1" height="1" />
      ))}
    </svg>
  )
}

/*
 * "DESIGN / THAT ____" — the last word cycles on its own while the section is on screen:
 * each letter scrambles through random glyphs before settling (a decoder effect).
 */
export function Design() {
  const root = useRef<HTMLElement>(null)
  const word = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = word.current!
    let i = 0
    let timer = 0
    let raf = 0
    let visible = false

    const scramble = (to: string) => {
      const start = performance.now()
      const from = el.textContent ?? ''
      const len = Math.max(from.length, to.length)
      const step = (t: number) => {
        const p = (t - start) / 700
        let out = ''
        for (let c = 0; c < len; c++) {
          const settle = c / len
          if (p > settle + 0.35) out += to[c] ?? ''
          else if (p > settle) out += GLYPHS[(Math.random() * GLYPHS.length) | 0]
          else out += from[c] ?? ''
        }
        el.textContent = out
        if (p < 1.4) raf = requestAnimationFrame(step)
        else el.textContent = to
      }
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(step)
    }

    const loop = () => {
      if (visible && !reducedMotion()) {
        i = (i + 1) % design.words.length
        scramble(design.words[i])
      }
      timer = window.setTimeout(loop, 2200)
    }
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(root.current!)
    timer = window.setTimeout(loop, 2200)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dz-line > span', {
        yPercent: 110,
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.dz-title', start: 'top 80%' },
      })
      gsap.fromTo(
        '.dz-bracket',
        { scaleY: 0.4, opacity: 0 },
        {
          scaleY: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'center center', scrub: true },
        },
      )
      gsap.to('.dz-bracket.is-l', {
        xPercent: 60,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'center center', end: 'bottom top', scrub: true },
      })
      gsap.to('.dz-bracket.is-r', {
        xPercent: -60,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'center center', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="design s-panel" ref={root} data-tone="panel">
      <span className="dz-bracket is-l" aria-hidden />
      <span className="dz-bracket is-r" aria-hidden />
      <div className="dz-center">
        <PixelArrow />
        <h2 className="dz-title" aria-label={`Design that ${design.words.join(', ').toLowerCase()}`}>
          <span className="dz-line" aria-hidden>
            <span>DESIGN</span>
          </span>
          <span className="dz-line" aria-hidden>
            <span>
              THAT <span ref={word}>{design.words[0]}</span>
            </span>
          </span>
        </h2>
        <div className="dz-foot mono">
          <span>{design.left.join(' ')}</span>
          <div className="dz-chip" aria-hidden>
            <span className="dz-spark">✳</span>
            <span className="dz-chev">
              <i>›</i>
              <i>›</i>
              <i>›</i>
            </span>
            <span className="dz-rings">
              <i />
              <i />
            </span>
          </div>
          <span>{design.right.join(' ')}</span>
        </div>
        <PixelArrow up />
      </div>
    </section>
  )
}
