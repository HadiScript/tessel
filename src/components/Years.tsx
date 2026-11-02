import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/anim'
import { years } from '../content'

// A pinned dark room: artwork drifts up past the camera at different depths while the
// years sit in the corners. x/w in vw, y = start offset in vh, s = speed (depth).
const TILES = [
  { x: 1, y: 70, w: 12, s: 1.1, label: 'Kairo — 2026' },
  { x: 30, y: 105, w: 14, s: 0.8, label: 'Type study' },
  { x: 50, y: 45, w: 11, s: 1.3, label: 'Nimbus' },
  { x: 74, y: 120, w: 14, s: 0.95, label: 'Motion kit' },
  { x: 12, y: 175, w: 9, s: 1.25, label: 'Arcade.fm' },
  { x: 58, y: 190, w: 15, s: 0.85, label: 'Field Notes' },
  { x: 83, y: 240, w: 9, s: 1.2, label: 'Grid system' },
  { x: 24, y: 260, w: 13, s: 1, label: 'Lumen Audio' },
  { x: 46, y: 320, w: 14, s: 0.9, label: 'Studio Nord' },
  { x: 4, y: 330, w: 10, s: 1.15, label: 'Signal' },
  { x: 70, y: 345, w: 12, s: 1.05, label: 'Packaging' },
]

export function Years() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.utils.toArray<HTMLElement>('.yr-tile').forEach((el, i) => {
        const t = TILES[i]
        tl.fromTo(el, { yPercent: 0, y: () => t.y * innerHeight * 0.01 }, { y: () => (t.y - 520 * t.s) * innerHeight * 0.01 }, 0)
      })
      gsap.from('.yr-num', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 60%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const from = String(years.from)
  const to = String(years.to)
  return (
    <section className="years s-panel" ref={root} data-tone="panel">
      <div className="yr-sticky">
        <div className="yr-tiles">
          {TILES.map((t, i) => (
            <figure key={t.label} className={`yr-tile art-${i % 9}`} style={{ left: `${t.x}vw`, width: `${t.w}vw` }}>
              <figcaption className="mono">{t.label}</figcaption>
            </figure>
          ))}
        </div>
        <span className="yr-num tl">{from.slice(0, 2)}</span>
        <span className="yr-num tr">{from.slice(2)}</span>
        <span className="yr-num bl">
          <i />
          {to.slice(0, 2)}
        </span>
        <span className="yr-num br">{to.slice(2)}</span>
        <span className="yr-label mono">{years.label}</span>
      </div>
    </section>
  )
}
