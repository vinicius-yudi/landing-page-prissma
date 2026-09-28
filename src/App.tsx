import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MotionConfig } from "motion/react"
import { useLayoutEffect, useRef, useState } from "react"

import { useSmoothScroll } from "@/lib/useSmoothScroll"
import { Closing } from "@/sections/Closing"
import { Modules } from "@/sections/Modules"
import { Nav } from "@/sections/Nav"
import { Roles } from "@/sections/Roles"
import { Sequence } from "@/sections/Sequence"
import { Story } from "@/sections/story/Story"

gsap.registerPlugin(ScrollTrigger)

/** Altura da barra fixa: é onde a troca de tema da barra acontece. */
const NAV_LINE = "72px"

/**
 * A página: abre no escuro (Barroco) com o prisma, passa para o claro
 * (Canteiro) nas frentes, perfis e sequência, e fecha no escuro. A barra fixa
 * troca de tema quando cruza o trecho claro.
 */
export function App() {
  const [navLight, setNavLight] = useState(false)
  const lightRef = useRef<HTMLDivElement>(null)
  const jumpTo = useSmoothScroll()

  useLayoutEffect(() => {
    if (!lightRef.current) return undefined
    const trigger = ScrollTrigger.create({
      trigger: lightRef.current,
      start: `top ${NAV_LINE}`,
      end: `bottom ${NAV_LINE}`,
      onToggle: (self) => setNavLight(self.isActive),
    })
    return () => trigger.kill()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div id="topo" data-theme="dark" className="min-h-screen bg-bg text-ink">
        <Nav light={navLight} onJump={jumpTo} />
        <main>
          <Story />
          <div ref={lightRef} data-theme="light" className="relative bg-bg text-ink">
            <div className="pointer-events-none absolute inset-x-0 -top-40 h-40 bg-linear-to-b from-transparent to-bg" />
            <Modules />
            <Roles />
            <Sequence />
          </div>
          <Closing />
        </main>
      </div>
    </MotionConfig>
  )
}
