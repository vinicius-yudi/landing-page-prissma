import { Check } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { tv } from "tailwind-variants"

import { Fachada } from "@/ui/Fachada"

const STEPS: [string, string][] = [
  ["Serviços preliminares", "Limpeza do terreno, tapume, canteiro e ligações provisórias."],
  ["Fundação", "Sapatas, vigas baldrame e impermeabilização."],
  ["Estrutura", "Pilares, vigas e lajes."],
  ["Alvenaria", "Vedação, vergas e contravergas."],
  ["Instalações", "Elétrica, hidráulica e esgoto embutidos."],
  ["Cobertura", "Madeiramento, telhas e calhas."],
  ["Revestimentos", "Reboco, contrapiso e cerâmica."],
  ["Acabamento", "Pintura, louças, metais e esquadrias."],
  ["Entrega das chaves", "Limpeza fina, vistoria e entrega."],
]

const marker = tv({
  base: "t-num relative z-10 flex size-8 flex-none items-center justify-center rounded-full text-[12px] font-[700] transition-all duration-500",
  variants: { reached: { true: "bg-gold text-on-gold", false: "bg-surface text-meta hairline" } },
})

const step = tv({
  base: "transition-opacity duration-500",
  variants: { current: { true: "opacity-100", false: "opacity-45" } },
})

/** Do gabarito à entrega: a fachada se desenha conforme a rolagem avança as etapas. */
export function Sequence() {
  const [current, setCurrent] = useState(-1)
  const refs = useRef<(HTMLLIElement | null)[]>([])
  const progress = ((current + 1) / STEPS.length) * 100

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setCurrent(Number((entry.target as HTMLElement).dataset.i))),
      { rootMargin: "-48% 0px -48% 0px" },
    )
    refs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="sequencia" className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 md:py-36">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="md:sticky md:top-[14vh] md:self-start">
          <h2 className="t-title max-w-[14ch] text-[clamp(32px,4vw,54px)] text-ink">Do gabarito à entrega das chaves.</h2>
          <p className="mt-5 max-w-[42ch] text-[16px] leading-relaxed text-ink-2">
            No PRISSMA, a fachada de cada obra é desenhada em traço de projeto. O que já foi executado ganha traço firme; o que falta continua tracejado.
          </p>
          <div className="blueprint mt-8 rounded-[20px] bg-surface p-4 hairline sm:p-6">
            <Fachada floors={2} progress={progress} seed={7} className="w-full" />
            <div className="mt-2 flex items-center justify-between text-[13px]">
              <span className="text-ink-2">{current >= 0 ? STEPS[current][0] : "Terreno"}</span>
              <span className="t-kpi text-[20px] text-gold-hi">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
        <ol className="relative p-0 md:py-[26vh]">
          <div className="absolute top-0 bottom-0 left-[15px] w-px bg-border md:top-[26vh] md:bottom-[26vh]" />
          {STEPS.map(([name, description], i) => (
            <li
              key={name}
              ref={(el) => {
                refs.current[i] = el
              }}
              data-i={i}
              className="relative flex list-none gap-5 pb-14 last:pb-0 md:pb-[14vh]"
            >
              <span className={marker({ reached: i <= current })}>{i < current ? <Check size={14} strokeWidth={3} /> : i + 1}</span>
              <div className={step({ current: i === current })}>
                <p className="t-section text-[22px] text-ink">{name}</p>
                <p className="mt-1.5 max-w-[40ch] text-[15px] leading-relaxed text-ink-2">{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
