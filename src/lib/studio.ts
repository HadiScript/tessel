import { useSyncExternalStore } from 'react'
import { reducedMotion } from './anim'

/*
 * Theme Studio — every colour on the site is one of eight tokens, defined separately for the
 * light and dark modes, plus a few global "shape" settings. The studio edits them live, writes
 * a <style> block, and persists both the settings and the generated CSS (index.html re-applies
 * the CSS before first paint so a custom theme never flashes).
 */

export type Mode = 'light' | 'dark'

export const TOKENS = ['bg', 'ink', 'surface', 'surfaceInk', 'panel', 'panelInk', 'accent', 'accentInk'] as const
export type Token = (typeof TOKENS)[number]
export type Palette = Record<Token, string>

export const TOKEN_INFO: Record<Token, { label: string; hint: string; on?: Token }> = {
  bg: { label: 'Background', hint: 'Page canvas' },
  ink: { label: 'Ink', hint: 'Text on background', on: 'bg' },
  surface: { label: 'Surface', hint: 'Cards & widgets' },
  surfaceInk: { label: 'Surface ink', hint: 'Text on cards', on: 'surface' },
  panel: { label: 'Panel', hint: 'Contrast sections & pills' },
  panelInk: { label: 'Panel ink', hint: 'Text on panels', on: 'panel' },
  accent: { label: 'Accent', hint: 'Highlights & buttons', on: 'bg' },
  accentInk: { label: 'Accent ink', hint: 'Text on accent', on: 'accent' },
}

export const FONTS = {
  geist: { label: 'Geist', display: "'Geist'", body: "'Geist'", mono: "'Geist Mono'" },
  tight: { label: 'Inter Tight', display: "'Inter Tight'", body: "'Inter Tight'", mono: "'JetBrains Mono'" },
  grotesk: { label: 'Space Grotesk', display: "'Space Grotesk'", body: "'Space Grotesk'", mono: "'Space Mono'" },
  editorial: { label: 'Editorial serif', display: "'Instrument Serif'", body: "'Inter Tight'", mono: "'JetBrains Mono'" },
} as const
export type FontId = keyof typeof FONTS

export type Studio = {
  preset: string
  light: Palette
  dark: Palette
  radius: number // px, card corner radius
  font: FontId
  grain: number // 0..1
  scale: number // display type multiplier
}

const p = (
  bg: string,
  ink: string,
  surface: string,
  panel: string,
  panelInk: string,
  accent: string,
  accentInk: string,
  surfaceInk = ink,
): Palette => ({ bg, ink, surface, surfaceInk, panel, panelInk, accent, accentInk })

export const PRESETS: Record<string, { light: Palette; dark: Palette }> = {
  Lilac: {
    light: p('#c9c4d0', '#111114', '#f5f3f7', '#111214', '#ece9f0', '#ff4d1f', '#111114'),
    dark: p('#0e0f11', '#ece9f0', '#18191d', '#c9c4d0', '#0e0f11', '#ff6233', '#0e0f11'),
  },
  Bone: {
    light: p('#e6e1d6', '#1a1915', '#f8f6f0', '#1a1915', '#efebe1', '#2b48ff', '#f8f6f0'),
    dark: p('#13120e', '#efebe1', '#1f1d18', '#e6e1d6', '#13120e', '#6f84ff', '#0f0f12'),
  },
  Acid: {
    light: p('#dde2d3', '#0c0d0a', '#f6f8f1', '#0c0d0a', '#e4ecd0', '#4d7a00', '#f6f8f1'),
    dark: p('#0a0b09', '#e7edd9', '#151711', '#c5f02a', '#0a0b09', '#c5f02a', '#0a0b09'),
  },
  Ocean: {
    light: p('#ccd7dd', '#0b1418', '#f1f6f8', '#0b1418', '#dbe8ee', '#0066e0', '#ffffff'),
    dark: p('#081014', '#dbe8ee', '#0f1b21', '#a9c4cf', '#081014', '#43a6ff', '#04121d'),
  },
  Ember: {
    light: p('#e9d8cd', '#1c0f0a', '#fbf3ee', '#1c0f0a', '#f4e3d8', '#d42416', '#ffffff'),
    dark: p('#120a07', '#f4e3d8', '#21140e', '#e9d8cd', '#120a07', '#ff5440', '#120a07'),
  },
  Mono: {
    light: p('#d8d8d8', '#0a0a0a', '#f5f5f5', '#0a0a0a', '#ededed', '#0a0a0a', '#f5f5f5'),
    dark: p('#0a0a0a', '#ededed', '#161616', '#d8d8d8', '#0a0a0a', '#ededed', '#0a0a0a'),
  },
}

export const DEFAULT: Studio = {
  preset: 'Lilac',
  ...structuredClone(PRESETS.Lilac),
  radius: 22,
  font: 'geist',
  grain: 0.35,
  scale: 1,
}

/* ---------------- colour maths ---------------- */

export const isHex = (s: string) => /^#[0-9a-f]{6}$/i.test(s)

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const hex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')

function luminance(h: string) {
  const [r, g, b] = rgb(h).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio between two hex colours (1..21). */
export function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

function toHsl(h: string): [number, number, number] {
  const [r, g, b] = rgb(h).map((v) => v / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let hue = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  hue *= 60
  return [hue, s * 100, l * 100]
}

function fromHsl(h: number, s: number, l: number) {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return hex(f(0) * 255, f(8) * 255, f(4) * 255)
}

/** Nudge `fg` lighter or darker (keeping its hue) until it reaches `target` contrast on `bg`. */
export function fixContrast(fg: string, bg: string, target = 4.5) {
  if (contrast(fg, bg) >= target) return fg
  const [h, s, l] = toHsl(fg)
  const darker = luminance(bg) > 0.18
  for (let i = 1; i <= 100; i++) {
    const c = fromHsl(h, s, darker ? Math.max(0, l - i) : Math.min(100, l + i))
    if (contrast(c, bg) >= target) return c
  }
  return darker ? '#000000' : '#ffffff'
}

const readable = (bg: string) => (contrast('#0b0b0d', bg) >= contrast('#ffffff', bg) ? '#0b0b0d' : '#ffffff')

/** Build a full, contrast-safe palette for one mode from a single accent colour. */
export function harmonize(accent: string, mode: Mode): Palette {
  const [h, s] = toHsl(accent)
  const tint = Math.min(s, 22)
  if (mode === 'light') {
    const bg = fromHsl(h, tint * 0.6, 81)
    return {
      bg,
      ink: fromHsl(h, 10, 7),
      surface: fromHsl(h, tint, 97),
      surfaceInk: fromHsl(h, 10, 7),
      panel: fromHsl(h, 9, 7),
      panelInk: fromHsl(h, tint, 92),
      accent,
      accentInk: readable(accent),
    }
  }
  const bg = fromHsl(h, 9, 6)
  const acc = fixContrast(accent, bg, 4.5)
  return {
    bg,
    ink: fromHsl(h, tint * 0.7, 92),
    surface: fromHsl(h, 9, 11),
    surfaceInk: fromHsl(h, tint * 0.7, 92),
    panel: fromHsl(h, tint * 0.6, 80),
    panelInk: fromHsl(h, 10, 6),
    accent: acc,
    accentInk: readable(acc),
  }
}

export const randomAccent = () => fromHsl(Math.random() * 360, 70 + Math.random() * 25, 50 + Math.random() * 8)

/* ---------------- css output ---------------- */

const cssVar = (t: Token) => '--' + t.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())

export function toCss(s: Studio) {
  const block = (m: Mode) =>
    `html:root[data-theme='${m}'] {\n${TOKENS.map((t) => `  ${cssVar(t)}: ${s[m][t]};`).join('\n')}\n}`
  const f = FONTS[s.font]
  return [
    block('light'),
    block('dark'),
    `html:root {\n  --radius: ${s.radius}px;\n  --grain: ${s.grain};\n  --type-scale: ${s.scale};\n  --f-display: ${f.display}, system-ui, sans-serif;\n  --f-body: ${f.body}, system-ui, sans-serif;\n  --f-mono: ${f.mono}, ui-monospace, monospace;\n}`,
  ].join('\n')
}

/* ---------------- store ---------------- */

const KEY = 'tessel-studio'
const CSS_KEY = 'tessel-studio-css'
const MODE_KEY = 'tessel-mode'

function load(): Studio {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return sanitize(JSON.parse(raw))
  } catch {
    /* corrupted or blocked storage — fall back to defaults */
  }
  return structuredClone(DEFAULT)
}

/** Accept partial / hand-edited JSON (e.g. pasted into Import) without breaking the page. */
export function sanitize(input: unknown): Studio {
  const out = structuredClone(DEFAULT)
  if (!input || typeof input !== 'object') return out
  const o = input as Partial<Studio>
  for (const m of ['light', 'dark'] as const) {
    for (const t of TOKENS) {
      const v = o[m]?.[t]
      if (typeof v === 'string' && isHex(v)) out[m][t] = v.toLowerCase()
    }
  }
  if (typeof o.radius === 'number') out.radius = Math.max(0, Math.min(48, o.radius))
  if (typeof o.grain === 'number') out.grain = Math.max(0, Math.min(1, o.grain))
  if (typeof o.scale === 'number') out.scale = Math.max(0.8, Math.min(1.2, o.scale))
  if (typeof o.font === 'string' && o.font in FONTS) out.font = o.font as FontId
  if (typeof o.preset === 'string') out.preset = o.preset
  return out
}

let state: Studio = load()
const listeners = new Set<() => void>()

function apply() {
  const css = toCss(state)
  let el = document.getElementById('studio-vars') as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = 'studio-vars'
    document.head.appendChild(el)
  }
  el.textContent = css
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
    localStorage.setItem(CSS_KEY, css)
  } catch {
    /* storage blocked — theme still applies for this visit */
  }
  window.dispatchEvent(new Event('studio:change'))
}

export const studio = {
  get: () => state,
  set(patch: Partial<Studio> | ((s: Studio) => Studio)) {
    state = typeof patch === 'function' ? patch(structuredClone(state)) : { ...state, ...patch }
    apply()
    listeners.forEach((l) => l())
  },
  subscribe(l: () => void) {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  init: apply,
}

export const useStudio = () => useSyncExternalStore(studio.subscribe, studio.get)

/* ---------------- light / dark mode ---------------- */

export const getMode = (): Mode => (document.documentElement.dataset.theme as Mode) ?? 'light'

/** Switch mode; with an origin point the new theme grows out of it in a circular wipe. */
export function setMode(next: Mode, origin?: { x: number; y: number }) {
  if (next === getMode()) return
  const commit = () => {
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(MODE_KEY, next)
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event('studio:change'))
  }
  if (!origin || !document.startViewTransition || reducedMotion()) return commit()
  const { x, y } = origin
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  document.startViewTransition(commit).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 850, easing: 'cubic-bezier(.76,0,.24,1)', pseudoElement: '::view-transition-new(root)' },
    )
  })
}

/** Read a resolved token colour from an element's computed style (for canvases). */
export const tokenOf = (el: Element, name: string) => getComputedStyle(el).getPropertyValue(name).trim()
