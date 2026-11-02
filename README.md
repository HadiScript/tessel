# Tessel — Design-led engineering studio

A concept website for **Tessel**, a design and engineering studio. Pill navigation, pinned project scenes, a word-scrambling "Design that ___" section and a scroll-driven gallery.

**Stack:** React 19 · TypeScript · Vite · GSAP + ScrollTrigger · Lenis

- **Theme Studio** — edit 8 colour tokens for light and dark separately, presets, generate a palette from one colour, WCAG contrast checks with one-click fixes, fonts / radius / type size / grain, export CSS & JSON, import, undo
- 3D canvas coil in the hero, expanding "+" menu, header that adapts to the section beneath it
- Fully responsive, light and dark

```bash
npm install
npm run dev
```

All copy lives in `src/content.ts`; awards, quotes and numbers are sample data.
