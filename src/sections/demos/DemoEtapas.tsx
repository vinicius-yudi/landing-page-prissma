import { motion } from "motion/react"
import { useState } from "react"
import { tv } from "tailwind-variants"

import { SPRING } from "@/lib/motion"

type StageState = "done" | "doing" | "late" | "todo"

const GANTT: { name: string; start: number; end: number; state: StageState }[] = [
  { name: "Fundação", start: 0, end: 18, state: "done" },
  { name: "Estrutura", start: 16, end: 38, state: "done" },
  { name: "Alvenaria", start: 36, end: 58, state: "doing" },
  { name: "Instalações", start: 44, end: 66, state: "late" },
  { name: "Cobertura", start: 60, end: 76, state: "todo" },
  { name: "Acabamento", start: 74, end: 100, state: "todo" },
]

/** Posição de "hoje" na régua, em %. */
const TODAY = 55

const bar = tv({
  base: "absolute inset-y-1 rounded-[5px]",
  variants: {
    state: {
      done: "bg-success",
      doing: "bg-gold",
      late: "hazard bg-danger",
      todo: "border border-dashed border-border-strong bg-transparent",
    },
  },
})

const name = tv({
  base: "w-[84px] flex-none truncate text-[12.5px] transition-colors",
  variants: { active: { true: "text-ink", false: "text-ink-2" } },
})

const LEGEND: { state: StageState; label: string }[] = [
  { state: "done", label: "Concluída" },
  { state: "doing", label: "Em andamento" },
  { state: "late", label: "Atrasada" },
  { state: "todo", label: "Planejada" },
]

const swatch = tv({
  base: "size-2.5 rounded-[3px]",
  variants: {
    state: { done: "bg-success", doing: "bg-gold", late: "bg-danger", todo: "border border-dashed border-border-strong" },
  },
})

/** Etapas: o cronograma mostra o atraso antes dele virar problema. */
export function DemoEtapas() {
  const [hover, setHover] = useState<number | null>(null)

  return (
    <div className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between text-[12px] text-meta">
        <span>Residência Mercês</span>
        <span className="t-num">jul — dez</span>
      </div>
      <div className="relative space-y-2.5">
        <div className="pointer-events-none absolute inset-y-[-8px] z-10 w-px bg-gold-hi" style={{ left: `calc(96px + (100% - 96px) * ${TODAY / 100})` }}>
          <span className="absolute -top-5 -translate-x-1/2 rounded-pill bg-gold px-1.5 text-[10px] font-[700] text-on-gold">hoje</span>
        </div>
        {GANTT.map((stage, i) => (
          <div key={stage.name} className="flex items-center gap-3" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <span className={name({ active: hover === i })}>{stage.name}</span>
            <div className="relative h-7 flex-1 rounded-[6px] bg-raised">
              <motion.div
                className={bar({ state: stage.state })}
                style={{ left: `${stage.start}%` }}
                initial={{ width: 0 }}
                whileInView={{ width: `${stage.end - stage.start}%` }}
                viewport={{ once: true }}
                animate={{ scaleY: hover === i ? 1.12 : 1 }}
                transition={{ ...SPRING, delay: i * 0.06 }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-ink-2">
        {LEGEND.map((item) => (
          <span key={item.state} className="inline-flex items-center gap-1.5">
            <i className={swatch({ state: item.state })} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}
