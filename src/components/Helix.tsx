import { useEffect, useRef } from 'react'
import { reducedMotion } from '../lib/anim'
import { tokenOf } from '../lib/studio'

/*
 * A 3D coil drawn on a 2D canvas: points along a helix are projected with perspective, split
 * into short segments and painted back-to-front so the near side overlaps the far side.
 * The cursor tilts and spins it; `stretch` (0..1, driven by scroll) pulls the spring apart.
 */

type Props = { stretch: { current: number } }

export function Helix({ stretch }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    let W = 0
    let H = 0
    let dpr = 1
    let colors = { ink: '#eee', accent: '#f60' }
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    let spin = 0
    let visible = true
    let raf = 0

    const readColors = () => {
      colors = { ink: tokenOf(cv, '--sfg') || '#eee', accent: tokenOf(cv, '--accent') || '#f60' }
    }
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      W = cv.clientWidth
      H = cv.clientHeight
      cv.width = W * dpr
      cv.height = H * dpr
    }

    const TURNS = 11
    const N = 880
    const segs = Array.from({ length: N }, () => ({ x1: 0, y1: 0, x2: 0, y2: 0, z: 0, t: 0 }))

    const frame = (time: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06
      spin += 0.006 + mouse.x * 0.01
      const s = stretch.current

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      const R = Math.min(W * 0.17, H * 0.36)
      const span = H * (1.25 + s * 0.9)
      const tilt = 0.32 + mouse.y * 0.35
      const ct = Math.cos(tilt)
      const st = Math.sin(tilt)
      const f = 900
      const cx = W / 2 + mouse.x * 30
      const cy = H / 2

      let px = 0
      let py = 0
      let pz = 0
      for (let i = 0; i <= N; i++) {
        const t = i / N
        const th = t * TURNS * Math.PI * 2 + spin
        const x = R * Math.cos(th)
        const z0 = R * Math.sin(th)
        const y0 = (t - 0.5) * span
        // tilt the coil toward the viewer around the X axis
        const y = y0 * ct - z0 * st * 0.35
        const z = z0 * ct + y0 * st * 0.15
        const k = f / (f + z)
        const sx = cx + x * k
        const sy = cy + y * k
        if (i > 0) {
          const g = segs[i - 1]
          g.x1 = px
          g.y1 = py
          g.x2 = sx
          g.y2 = sy
          g.z = (pz + z) / 2
          g.t = t
        }
        px = sx
        py = sy
        pz = z
      }
      const order = segs.slice().sort((a, b) => b.z - a.z)
      const band = (time * 0.00004) % 1
      ctx.lineCap = 'round'
      for (const g of order) {
        const depth = 0.5 - g.z / (2 * R) // 0 back .. 1 front
        const near = Math.abs(((g.t - band + 1.5) % 1) - 0.5) < 0.035
        ctx.strokeStyle = near ? colors.accent : colors.ink
        ctx.globalAlpha = near ? 1 : 0.18 + depth * 0.82
        ctx.lineWidth = 2 + depth * 9
        ctx.beginPath()
        ctx.moveTo(g.x1, g.y1)
        ctx.lineTo(g.x2, g.y2)
        ctx.stroke()
      }
      // binary "bits" riding the front of the coil
      ctx.globalAlpha = 0.9
      ctx.fillStyle = colors.accent
      ctx.font = '500 10px "Geist Mono", monospace'
      for (let i = 0; i < N; i += 37) {
        const g = segs[i]
        if (g.z > -R * 0.55) continue
        ctx.fillText(i % 2 ? '1' : '0', g.x2 - 3, g.y2 + 3)
      }
      ctx.globalAlpha = 1
    }

    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2
    }

    resize()
    readColors()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(cv)
    window.addEventListener('pointermove', move)
    window.addEventListener('studio:change', readColors)
    const mo = new MutationObserver(readColors)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    if (reducedMotion()) frame(0)
    else raf = requestAnimationFrame(frame)
    if (reducedMotion()) cancelAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('studio:change', readColors)
    }
  }, [stretch])

  return <canvas className="helix" ref={ref} aria-hidden />
}
