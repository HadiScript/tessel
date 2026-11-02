import { useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, reducedMotion, scroll } from './lib/anim'
import { studio } from './lib/studio'
import { Cursor, Preloader } from './components/Chrome'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Intro } from './components/Intro'
import { Work } from './components/Work'
import { Design } from './components/Design'
import { Kit } from './components/Kit'
import { StudioSection } from './components/Studio'
import { Years } from './components/Years'
import { Contact, Voices } from './components/Outro'
import { ThemeStudio } from './components/ThemeStudio'

studio.init()

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [studioOpen, setStudioOpen] = useState(false)
  const onDone = useCallback(() => setLoaded(true), [])
  const closeStudio = useCallback(() => setStudioOpen(false), [])

  useEffect(() => {
    if (reducedMotion()) return
    const lenis = new Lenis({ lerp: 0.09, anchors: { duration: 1.6 } })
    scroll.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      scroll.lenis = null
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !loaded)
    if (loaded) {
      scroll.lenis?.start()
      ScrollTrigger.refresh()
    } else {
      window.scrollTo(0, 0)
      scroll.lenis?.stop()
    }
  }, [loaded])

  // fonts / type scale change layout — re-measure every trigger
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    let t = 0
    const on = () => {
      window.clearTimeout(t)
      t = window.setTimeout(() => ScrollTrigger.refresh(), 250)
    }
    window.addEventListener('studio:change', on)
    return () => window.removeEventListener('studio:change', on)
  }, [])

  useEffect(() => {
    if (studioOpen) scroll.lenis?.stop()
    else if (loaded) scroll.lenis?.start()
  }, [studioOpen, loaded])

  return (
    <>
      <Cursor />
      {!loaded && <Preloader onDone={onDone} />}
      <Header onStudio={() => setStudioOpen(true)} />
      <main>
        <Hero ready={loaded} />
        <Intro />
        <Work />
        <Design />
        <Kit />
        <StudioSection />
        <Years />
        <Voices />
        <Contact />
      </main>
      <ThemeStudio open={studioOpen} onClose={closeStudio} />
      <div className="grain" aria-hidden />
    </>
  )
}
