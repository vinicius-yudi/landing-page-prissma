import { AlertTriangle, Plus, RotateCcw } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { tv } from "tailwind-variants"

import { money } from "@/lib/format"
import { Progress } from "@/ui/Progress"

const PLANNED = 64000
const START = 53080
const ENTRY = 4200

const spentValue = tv({
  base: "t-kpi text-[26px] leading-none",
  variants: { over: { true: "text-danger", false: "text-ink" } },
})

/** Orçamento: lançar uma despesa e ver o saldo — e o estouro — na hora. */
export function DemoOrcamento() {
  const [spent, setSpent] = useState(START)
  const over = spent > PLANNED

  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] text-meta">Categoria</p>
          <p className="t-section text-[16px] text-ink">Alvenaria</p>
        </div>
        <div className="text-right">
          <motion.p key={spent} initial={{ y: -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} className={spentValue({ over })}>
            {money(spent)}
          </motion.p>
          <p className="mt-1 text-[12px] text-meta">de {money(PLANNED)} planejados</p>
        </div>
      </div>
      <Progress value={(spent / PLANNED) * 100} tone={over ? "danger" : "gold"} height={14} className="mt-5" label="Gasto da categoria" />
      <AnimatePresence>
        {over && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-4 flex items-start gap-2.5 rounded-[12px] bg-danger-soft p-3 text-[13px] text-danger">
              <AlertTriangle size={16} className="mt-0.5 flex-none" />
              <span>
                <b className="font-[680]">Estourou {money(spent - PLANNED)}.</b> A despesa foi registrada e a categoria ficou em destaque no painel.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => setSpent((s) => s + ENTRY)}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] bg-gold-grad px-3.5 text-[13px] font-[620] text-on-gold"
        >
          <Plus size={15} /> Lançar {money(ENTRY)} em argamassa
        </motion.button>
        {spent !== START && (
          <button type="button" onClick={() => setSpent(START)} className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[10px] px-3 text-[13px] text-ink-2 hover:bg-raised">
            <RotateCcw size={14} /> Desfazer
          </button>
        )}
      </div>
    </div>
  )
}
