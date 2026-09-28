import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLayoutEffect, type MutableRefObject, type RefObject } from "react"

import type { PrismScene } from "@/scene/PrismScene"

gsap.registerPlugin(ScrollTrigger)

const MOBILE_BREAKPOINT = 768

interface StoryTimelineArgs {
  wrap: RefObject<HTMLDivElement | null>
  scene: MutableRefObject<PrismScene | null>
  labelAlpha: MutableRefObject<number>
}

/**
 * A história em três atos, amarrada à rolagem: o título sai, os fragmentos da
 * obra espalhada entram e são sugados pelo prisma, e as quatro frentes saem
 * dele como raios. Tudo é `scrub` — a rolagem é a agulha do tempo.
 */
export function useStoryTimeline({ wrap, scene, labelAlpha }: StoryTimelineArgs) {
  useLayoutEffect(() => {
    if (!wrap.current) return undefined
    const context = gsap.context(() => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      const target = () => scene.current?.prismStoryScreen() ?? { x: window.innerWidth * 0.42, y: window.innerHeight * 0.48 }

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            scene.current?.setScroll(self.progress)
            labelAlpha.current = gsap.utils.clamp(0, 1, (self.progress - 0.62) / 0.1)
          },
        },
      })

      timeline.to("[data-hero]", { autoAlpha: 0, y: -60, duration: 0.14 }, 0.06)
      timeline.to("[data-cue]", { autoAlpha: 0, duration: 0.05 }, 0.02)
      timeline.fromTo("[data-story1]", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.16)

      gsap.utils.toArray<HTMLElement>("[data-frag]").forEach((el, i) => {
        if (mobile && el.dataset.mobile !== "1") {
          gsap.set(el, { display: "none" })
          return
        }
        const tilt = Number(el.dataset.r)
        timeline.fromTo(
          el,
          { autoAlpha: 0, scale: 0.7, filter: "blur(8px)", rotate: tilt * 2 },
          { autoAlpha: 1, scale: 1, filter: "blur(0px)", rotate: tilt, duration: 0.1, ease: "power2.out" },
          0.17 + i * 0.022,
        )
        // Cada fragmento voa até o prisma: o destino é recalculado no refresh.
        timeline.to(
          el,
          {
            x: () => {
              const box = el.getBoundingClientRect()
              return target().x - (box.left + box.width / 2 - (gsap.getProperty(el, "x") as number))
            },
            y: () => {
              const box = el.getBoundingClientRect()
              return target().y - (box.top + box.height / 2 - (gsap.getProperty(el, "y") as number))
            },
            scale: 0.05,
            rotate: 0,
            autoAlpha: 0,
            filter: "blur(4px)",
            duration: 0.2,
            ease: "power2.in",
          },
          0.4 + i * 0.018,
        )
      })

      timeline.to("[data-story1]", { autoAlpha: 0, y: -30, duration: 0.08 }, 0.5)
      timeline.fromTo("[data-story2]", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.66)
      timeline.to({}, { duration: 0.14 }, 0.86)
    }, wrap)
    return () => context.revert()
  }, [wrap, scene, labelAlpha])
}
