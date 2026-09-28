import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import { useEffect, useRef } from "react"

import { prefersReducedMotion } from "./format"

/** Distância do topo ao pular para uma seção (a barra fixa não cobre o título). */
const JUMP_OFFSET = -80

/**
 * Rolagem suave (Lenis) sincronizada com o ScrollTrigger do gsap. Com
 * movimento reduzido fica a rolagem nativa — é ela que a pessoa pediu.
 */
export function useSmoothScroll() {
  const lenis = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const instance = new Lenis({ lerp: 0.11, smoothWheel: true })
    lenis.current = instance
    instance.on("scroll", ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis.current = null
    }
  }, [])

  return function jumpTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    if (lenis.current) lenis.current.scrollTo(el, { offset: JUMP_OFFSET })
    else el.scrollIntoView({ behavior: "smooth" })
  }
}
