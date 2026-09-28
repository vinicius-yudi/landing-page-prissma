import { useEffect, useRef, useState, type RefObject } from "react"

import { prefersReducedMotion } from "@/lib/format"
import type { PrismScene } from "@/scene/PrismScene"
import { webglAvailable } from "@/scene/webgl"

/** Distância mínima do rótulo até a borda da tela, em px. */
const LABEL_EDGE = 90

/**
 * Monta a cena do prisma (three.js) dentro de `container` e reposiciona os
 * rótulos dos raios a cada quadro. A cena só roda enquanto está na tela.
 * `labelAlpha` é escrito pela linha do tempo do scroll: os rótulos aparecem
 * quando o prisma já separou os raios.
 */
export function usePrismScene(container: RefObject<HTMLDivElement | null>) {
  const [hasWebGL] = useState(webglAvailable)
  const scene = useRef<PrismScene | null>(null)
  const labels = useRef<(HTMLDivElement | null)[]>([])
  const labelAlpha = useRef(0)

  useEffect(() => {
    const box = container.current
    if (!hasWebGL || !box) return undefined
    // three.js é o maior pedaço da página: só baixa quando a cena vai rodar.
    let instance: PrismScene | null = null
    let observer: IntersectionObserver | null = null
    let cancelled = false
    void import("@/scene/PrismScene").then(({ PrismScene: Scene }) => {
      if (cancelled) return
      const current = new Scene(box, prefersReducedMotion())
      instance = current
      scene.current = current
      current.onFrame = (positions) => {
        positions.forEach((position, i) => {
          const el = labels.current[i]
          if (!el) return
          const alpha = labelAlpha.current * Math.min(1, position.o * 1.4)
          const x = Math.min(window.innerWidth - LABEL_EDGE, Math.max(LABEL_EDGE, position.x))
          el.style.transform = `translate3d(${x}px, ${position.y}px, 0) translate(-50%, -50%) scale(${0.9 + alpha * 0.1})`
          el.style.opacity = String(alpha)
        })
      }
      observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? current.start() : current.stop()), { threshold: 0 })
      observer.observe(box)
    })
    return () => {
      cancelled = true
      observer?.disconnect()
      instance?.dispose()
      scene.current = null
    }
  }, [container, hasWebGL])

  return { hasWebGL, scene, labels, labelAlpha }
}
