import { Check } from "lucide-react"
import { LayoutGroup, motion } from "motion/react"
import { useState } from "react"
import { tv } from "tailwind-variants"

import { SPRING } from "@/lib/motion"
import { Progress } from "@/ui/Progress"

const COLUMN = { TODO: "TODO", IN_PROGRESS: "IN_PROGRESS", DONE: "DONE" } as const
type Column = (typeof COLUMN)[keyof typeof COLUMN]

const COLUMNS: { key: Column; label: string }[] = [
  { key: COLUMN.TODO, label: "A fazer" },
  { key: COLUMN.IN_PROGRESS, label: "Em andamento" },
  { key: COLUMN.DONE, label: "Concluída" },
]

/** Tocar avança a tarefa uma coluna; da última, volta ao começo. */
const NEXT: Record<Column, Column> = { TODO: COLUMN.IN_PROGRESS, IN_PROGRESS: COLUMN.DONE, DONE: COLUMN.TODO }

const card = tv({
  base: "block w-full cursor-pointer rounded-[9px] bg-surface p-2.5 text-left text-[12px] leading-snug text-ink shadow-soft hairline",
  variants: { done: { true: "text-meta line-through decoration-ink-3/50" } },
})

/** Tarefas: o quadro do dia a dia; o progresso da etapa acompanha sozinho. */
export function DemoTarefas() {
  const [items, setItems] = useState([
    { id: 1, title: "Encunhamento das paredes", column: COLUMN.TODO as Column },
    { id: 2, title: "Quadro de distribuição", column: COLUMN.TODO as Column },
    { id: 3, title: "Alvenaria do pav. superior", column: COLUMN.IN_PROGRESS as Column },
    { id: 4, title: "Vergas do térreo", column: COLUMN.DONE as Column },
  ])
  const progress = Math.round((items.filter((item) => item.column === COLUMN.DONE).length / items.length) * 100)

  function advance(id: number) {
    setItems((list) => list.map((item) => (item.id === id ? { ...item, column: NEXT[item.column] } : item)))
  }

  return (
    <div className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[12px] text-meta">Toque numa tarefa para avançar</p>
        <div className="flex w-32 items-center gap-2">
          <Progress value={progress} height={6} className="flex-1" label="Progresso da etapa" />
          <span className="t-num text-[12px] text-ink-2">{progress}%</span>
        </div>
      </div>
      <LayoutGroup>
        <div className="grid grid-cols-3 gap-2">
          {COLUMNS.map((column) => (
            <div key={column.key} className="min-h-[190px] rounded-[12px] bg-raised p-2">
              <p className="mb-2 px-1 text-[11.5px] font-[620] text-ink-2">{column.label}</p>
              <div className="space-y-2">
                {items
                  .filter((item) => item.column === column.key)
                  .map((item) => (
                    <motion.button
                      layout
                      layoutId={`task-${item.id}`}
                      key={item.id}
                      type="button"
                      onClick={() => advance(item.id)}
                      transition={SPRING}
                      whileHover={{ y: -2 }}
                      className={card({ done: item.column === COLUMN.DONE })}
                    >
                      <span className="flex items-start gap-1.5">
                        {item.column === COLUMN.DONE && <Check size={12} className="mt-0.5 flex-none text-success" strokeWidth={3} />}
                        {item.title}
                      </span>
                    </motion.button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>
    </div>
  )
}
