import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/anim'
import {
  DEFAULT,
  FONTS,
  PRESETS,
  TOKENS,
  TOKEN_INFO,
  contrast,
  fixContrast,
  harmonize,
  isHex,
  randomAccent,
  sanitize,
  setMode,
  studio,
  toCss,
  useStudio,
  type FontId,
  type Mode,
  type Studio,
  type Token,
} from '../lib/studio'
import { useMode } from './Chrome'

/* undo history lives outside React so every studio.set can be reverted */
const history: Studio[] = []
function commit(next: Studio | ((s: Studio) => Studio), custom = true) {
  history.push(structuredClone(studio.get()))
  if (history.length > 40) history.shift()
  studio.set((s) => {
    const n = typeof next === 'function' ? next(s) : next
    return custom ? { ...n, preset: 'Custom' } : n
  })
}
const undo = () => {
  const prev = history.pop()
  if (prev) studio.set(prev)
}

function Badge({ ratio, min }: { ratio: number; min: number }) {
  const grade = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail'
  return (
    <span className={`ts-badge ${ratio >= min ? 'is-ok' : 'is-bad'}`} title={`Contrast ${ratio.toFixed(2)}:1`}>
      {ratio.toFixed(1)} · {grade}
    </span>
  )
}

function TokenRow({ mode, token }: { mode: Mode; token: Token }) {
  const s = useStudio()
  const value = s[mode][token]
  const [draft, setDraft] = useState(value)
  useEffect(() => setDraft(value), [value])
  const info = TOKEN_INFO[token]
  const on = info.on ? s[mode][info.on] : null
  const min = token === 'accent' ? 3 : 4.5
  const ratio = on ? contrast(value, on) : 0

  const set = (v: string) => commit((st) => ({ ...st, [mode]: { ...st[mode], [token]: v.toLowerCase() } }))

  return (
    <div className="ts-row">
      <label className="ts-swatch" style={{ background: value }} data-cursor="Pick">
        <input type="color" value={value} onChange={(e) => set(e.target.value)} aria-label={`${info.label} colour`} />
      </label>
      <div className="ts-row-text">
        <b>{info.label}</b>
        <small>{info.hint}</small>
      </div>
      <input
        className="ts-hex mono"
        value={draft}
        spellCheck={false}
        maxLength={7}
        onChange={(e) => {
          const v = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`
          setDraft(v)
          if (isHex(v)) set(v)
        }}
        onBlur={() => setDraft(value)}
        aria-label={`${info.label} hex`}
      />
      <div className="ts-row-meta">
        {on && <Badge ratio={ratio} min={min} />}
        {on && ratio < min && (
          <button className="ts-fix mono" onClick={() => set(fixContrast(value, on, min))} data-cursor="Fix">
            Fix
          </button>
        )}
      </div>
    </div>
  )
}

function PresetChip({ name, active }: { name: string; active: boolean }) {
  const pr = PRESETS[name]
  return (
    <button
      className={`ts-preset ${active ? 'is-on' : ''}`}
      onClick={() => commit((st) => ({ ...st, ...structuredClone(pr), preset: name }), false)}
    >
      <span className="ts-preset-sw">
        {(['light', 'dark'] as const).map((m) => (
          <span key={m} style={{ background: pr[m].bg }}>
            <i style={{ background: pr[m].panel }} />
            <i style={{ background: pr[m].accent }} />
          </span>
        ))}
      </span>
      <span className="mono">{name}</span>
    </button>
  )
}

function MiniPreview({ mode }: { mode: Mode }) {
  const p = useStudio()[mode]
  return (
    <div className="ts-mini" style={{ background: p.bg, color: p.ink }} aria-hidden>
      <div className="ts-mini-top">
        <i style={{ background: p.panel }} />
        <i style={{ background: p.panel, flex: 2 }} />
      </div>
      <b style={{ fontFamily: 'var(--f-display)' }}>Aa</b>
      <div className="ts-mini-cards">
        <span style={{ background: p.surface, color: p.surfaceInk }}>card</span>
        <span style={{ background: p.panel, color: p.panelInk }}>panel</span>
        <span style={{ background: p.accent, color: p.accentInk }}>accent</span>
      </div>
    </div>
  )
}

type Tab = 'color' | 'shape' | 'share'

export function ThemeStudio({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useStudio()
  const mode = useMode()
  const [tab, setTab] = useState<Tab>('color')
  const [seed, setSeed] = useState(s[mode].accent)
  const [imp, setImp] = useState('')
  const [note, setNote] = useState('')
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => setSeed(s[mode].accent), [mode, s])

  useLayoutEffect(() => {
    const el = root.current!
    if (open) {
      gsap.set(el, { visibility: 'visible' })
      gsap.fromTo('.ts-panel', { xPercent: 105 }, { xPercent: 0, duration: 0.9, ease: 'expo.out' })
      gsap.fromTo('.ts-scrim', { opacity: 0 }, { opacity: 1, duration: 0.5 })
      gsap.fromTo('.ts-body > *', { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.04, delay: 0.15 })
    } else {
      gsap.to('.ts-panel', { xPercent: 105, duration: 0.6, ease: 'expo.in' })
      gsap.to('.ts-scrim', { opacity: 0, duration: 0.4, onComplete: () => gsap.set(el, { visibility: 'hidden' }) })
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !(e.target as HTMLElement).matches('input, textarea')) {
        e.preventDefault()
        undo()
      }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [open, onClose])

  const flash = (msg: string) => {
    setNote(msg)
    window.setTimeout(() => setNote(''), 1800)
  }
  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text)
      flash(`${what} copied`)
    } catch {
      flash('Clipboard blocked — select and copy manually')
    }
  }
  const json = JSON.stringify(s, null, 2)

  return (
    <div className={`theme-studio ${open ? 'is-open' : ''}`} ref={root} style={{ visibility: 'hidden' }}>
      <div className="ts-scrim" onClick={onClose} />
      <aside className="ts-panel" role="dialog" aria-modal="true" aria-label="Theme Studio" data-lenis-prevent>
        <header className="ts-head">
          <div>
            <span className="mono">Theme Studio</span>
            <h2 className="display">Make it yours.</h2>
          </div>
          <button className="ts-close" onClick={onClose} aria-label="Close Theme Studio" data-cursor="Close">
            ✕
          </button>
        </header>

        <div className="ts-body">
          <div className="ts-mode">
            {(['light', 'dark'] as const).map((m) => (
              <button
                key={m}
                className={mode === m ? 'is-on' : ''}
                onClick={(e) => setMode(m, { x: e.clientX, y: e.clientY })}
              >
                <span className="mono">{m === 'light' ? 'Light' : 'Dark'} mode</span>
                <MiniPreview mode={m} />
              </button>
            ))}
          </div>
          <p className="ts-tip">
            Editing the <b>{mode}</b> palette. Switch mode above to edit the other one — the site previews live.
          </p>

          <section>
            <h3 className="mono">Presets {s.preset === 'Custom' && <em>· Custom</em>}</h3>
            <div className="ts-presets">
              {Object.keys(PRESETS).map((n) => (
                <PresetChip key={n} name={n} active={s.preset === n} />
              ))}
            </div>
          </section>

          <nav className="ts-tabs mono" role="tablist">
            {(
              [
                ['color', 'Colours'],
                ['shape', 'Type & shape'],
                ['share', 'Export'],
              ] as [Tab, string][]
            ).map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>
                {l}
              </button>
            ))}
          </nav>

          {tab === 'color' && (
            <>
              <section className="ts-gen">
                <h3 className="mono">Generate from one colour</h3>
                <div className="ts-gen-row">
                  <label className="ts-swatch is-lg" style={{ background: seed }}>
                    <input type="color" value={seed} onChange={(e) => setSeed(e.target.value)} aria-label="Seed colour" />
                  </label>
                  <button className="ts-btn" onClick={() => commit((st) => ({ ...st, [mode]: harmonize(seed, mode) }))}>
                    This mode
                  </button>
                  <button
                    className="ts-btn"
                    onClick={() => commit((st) => ({ ...st, light: harmonize(seed, 'light'), dark: harmonize(seed, 'dark') }))}
                  >
                    Both modes
                  </button>
                  <button
                    className="ts-btn is-ghost"
                    data-cursor="Shuffle"
                    onClick={() => {
                      const a = randomAccent()
                      setSeed(a)
                      commit((st) => ({ ...st, light: harmonize(a, 'light'), dark: harmonize(a, 'dark') }))
                    }}
                  >
                    ⟳ Shuffle
                  </button>
                </div>
              </section>

              <section>
                <h3 className="mono">Tokens · {mode}</h3>
                <div className="ts-rows">
                  {TOKENS.map((t) => (
                    <TokenRow key={t} mode={mode} token={t} />
                  ))}
                </div>
                <button
                  className="ts-btn is-ghost is-wide"
                  onClick={() =>
                    commit((st) => {
                      const p = { ...st[mode] }
                      for (const t of TOKENS) {
                        const on = TOKEN_INFO[t].on
                        if (on) p[t] = fixContrast(p[t], p[on], t === 'accent' ? 3 : 4.5)
                      }
                      return { ...st, [mode]: p }
                    })
                  }
                >
                  Fix all contrast issues
                </button>
              </section>
            </>
          )}

          {tab === 'shape' && (
            <>
              <section>
                <h3 className="mono">Typeface</h3>
                <div className="ts-fonts">
                  {(Object.keys(FONTS) as FontId[]).map((f) => (
                    <button
                      key={f}
                      className={s.font === f ? 'is-on' : ''}
                      onClick={() => commit((st) => ({ ...st, font: f }))}
                    >
                      <b style={{ fontFamily: FONTS[f].display }}>Aa</b>
                      <span className="mono">{FONTS[f].label}</span>
                    </button>
                  ))}
                </div>
              </section>
              {(
                [
                  ['radius', 'Corner radius', 0, 48, 1, (v: number) => `${v}px`],
                  ['scale', 'Display size', 0.8, 1.2, 0.01, (v: number) => `${Math.round(v * 100)}%`],
                  ['grain', 'Film grain', 0, 1, 0.01, (v: number) => `${Math.round(v * 100)}%`],
                ] as const
              ).map(([k, label, min, max, step, fmt]) => (
                <section key={k} className="ts-slider">
                  <h3 className="mono">
                    {label} <em>{fmt(s[k])}</em>
                  </h3>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={s[k]}
                    onChange={(e) => studio.set({ [k]: Number(e.target.value) })}
                    onPointerDown={() => history.push(structuredClone(studio.get()))}
                    aria-label={label}
                  />
                </section>
              ))}
              <div className="ts-shape-demo" aria-hidden>
                <span className="card">Card</span>
                <span className="pill">Pill</span>
                <span className="ts-demo-accent">Accent</span>
              </div>
            </>
          )}

          {tab === 'share' && (
            <>
              <section>
                <h3 className="mono">CSS variables</h3>
                <textarea className="ts-code mono" readOnly value={toCss(s)} rows={10} />
                <button className="ts-btn is-wide" onClick={() => copy(toCss(s), 'CSS')}>
                  Copy CSS
                </button>
              </section>
              <section>
                <h3 className="mono">Theme JSON</h3>
                <textarea className="ts-code mono" readOnly value={json} rows={6} />
                <button className="ts-btn is-wide" onClick={() => copy(json, 'JSON')}>
                  Copy JSON
                </button>
              </section>
              <section>
                <h3 className="mono">Import a theme</h3>
                <textarea
                  className="ts-code mono"
                  placeholder="Paste theme JSON here…"
                  value={imp}
                  onChange={(e) => setImp(e.target.value)}
                  rows={4}
                />
                <button
                  className="ts-btn is-wide"
                  disabled={!imp.trim()}
                  onClick={() => {
                    try {
                      commit(sanitize(JSON.parse(imp)), false)
                      setImp('')
                      flash('Theme imported')
                    } catch {
                      flash('That isn’t valid JSON')
                    }
                  }}
                >
                  Apply import
                </button>
              </section>
            </>
          )}
        </div>

        <footer className="ts-foot">
          <button className="ts-btn is-ghost" onClick={undo} data-cursor="Undo">
            ↶ Undo
          </button>
          <span className="ts-note mono" aria-live="polite">
            {note}
          </span>
          <button className="ts-btn is-ghost" onClick={() => commit(structuredClone(DEFAULT), false)}>
            Reset
          </button>
        </footer>
      </aside>
    </div>
  )
}
