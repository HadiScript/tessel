import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../lib/anim'
import { getMode, setMode, type Mode } from '../lib/studio'
import { site } from '../content'

export function useMode() {
  const [mode, set] = useState<Mode>(getMode)
  useEffect(() => {
    const mo = new MutationObserver(() => set(getMode()))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])
  return mode
}

export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion()) {
      onDone()
      return
    }
    const ctx = gsap.context(() => {
      const n = { v: 0 }
      const num = root.current!.querySelector('.pre-count')!
      gsap
        .timeline({ onComplete: onDone })
        .from('.pre-tile', { scale: 0, rotate: -90, duration: 0.9, ease: 'expo.out', stagger: 0.06 })
        .from('.pre-name span', { yPercent: 110, duration: 0.8, ease: 'expo.out', stagger: 0.04 }, 0.1)
        .to(n, { v: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: () => (num.textContent = String(Math.round(n.v)).padStart(3, '0')) }, 0)
        .to('.pre-tile', { rotate: 90, duration: 0.8, ease: 'expo.inOut', stagger: 0.04 }, 0.9)
        .to('.pre-name span, .pre-tile', { yPercent: -120, opacity: 0, duration: 0.5, ease: 'expo.in', stagger: 0.02 }, '+=0.05')
        .to(root.current, { clipPath: 'inset(0 0 100% 0 round 0 0 40px 40px)', duration: 0.9, ease: 'expo.inOut' }, '-=0.2')
    }, root)
    return () => ctx.revert()
  }, [onDone])

  return (
    <div className="preloader" ref={root}>
      <div className="pre-mark">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} className="pre-tile" />
        ))}
      </div>
      <div className="pre-name display">
        {site.brand.split('').map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
      <span className="pre-count mono">000</span>
    </div>
  )
}

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    const x = gsap.quickTo(dot.current, 'x', { duration: 0.35, ease: 'power3' })
    const y = gsap.quickTo(dot.current, 'y', { duration: 0.35, ease: 'power3' })
    const label = dot.current!.querySelector('span')!
    const move = (e: PointerEvent) => {
      x(e.clientX)
      y(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('a, button, input, select, label, [data-cursor]')
      dot.current!.classList.toggle('is-hover', !!t)
      label.textContent = t?.dataset.cursor ?? ''
      dot.current!.classList.toggle('has-label', !!t?.dataset.cursor)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <div className="cursor" ref={dot}>
      <span className="mono" />
    </div>
  )
}

/** Logo mark: four tiles that tessellate — they rotate as the page scrolls. */
export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`mark ${className}`} aria-hidden>
      <rect x="2" y="2" width="9" height="9" rx="2.5" />
      <rect x="13" y="2" width="9" height="9" rx="4.5" />
      <rect x="2" y="13" width="9" height="9" rx="4.5" />
      <rect x="13" y="13" width="9" height="9" rx="2.5" className="is-accent" />
    </svg>
  )
}

export function ModeSwitch() {
  const mode = useMode()
  return (
    <button
      className={`mode-switch is-${mode}`}
      aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      data-cursor={mode === 'dark' ? 'Light' : 'Dark'}
      onClick={(e) => setMode(mode === 'dark' ? 'light' : 'dark', { x: e.clientX, y: e.clientY })}
    >
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="5.5" className="sun" />
        <g className="rays">
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1="12" y1="2.5" x2="12" y2="4.5" transform={`rotate(${i * 45} 12 12)`} />
          ))}
        </g>
        <circle cx="16.5" cy="8.5" r="5" className="bite" />
      </svg>
    </button>
  )
}

