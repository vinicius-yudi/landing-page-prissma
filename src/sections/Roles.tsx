import { Check, Lock } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { tv } from "tailwind-variants"

import { EASE_OUT_EXPO, SPRING } from "@/lib/motion"
import { Fachada } from "@/ui/Fachada"

const ROLES = [
  {
    key: "eng",
    label: "Engenheiro(a)",
    lead: "Planeja e responde pela obra.",
    can: ["Cria etapas, equipe e o orçamento", "Define o papel e as permissões de cada pessoa", "Aloca a equipe nos dias da obra", "Acompanha andamento e financeiro"],
    sees: ["Tudo da obra"],
    locked: [] as string[],
    progress: 51,
  },
  {
    key: "arq",
    label: "Arquiteto(a)",
    lead: "Cuida do projeto e das decisões de design.",
    can: ["Acompanha o andamento das etapas", "Envia plantas, memoriais e anexos", "Submete propostas de design para aprovação", "Gera prévias visuais de ambientes"],
    sees: ["Cronograma", "Documentos", "Propostas"],
    locked: ["Lançar despesas", "Alterar permissões"],
    progress: 50,
  },
  {
    key: "mestre",
    label: "Mestre de obras",
    lead: "Toca o canteiro no dia a dia.",
    can: ["Distribui tarefas para a equipe", "Organiza a escala dos integrantes", "Lança despesas de material", "Escreve o diário da obra"],
    sees: ["Tarefas", "Equipe", "Orçamento"],
    locked: ["Excluir etapas", "Alterar permissões"],
    progress: 48,
  },
  {
    key: "prop",
    label: "Proprietário(a)",
    lead: "Acompanha a obra sem precisar ligar para ninguém.",
    can: ["Vê o progresso geral e das etapas", "Acompanha previsto e gasto", "Vê o que está atrasado ou estourado", "Consulta fotos e documentos"],
    sees: ["Visão geral", "Documentos"],
    locked: ["Editar etapas", "Editar orçamento", "Mover tarefas"],
    progress: 52,
  },
]

const tab = tv({
  base: "relative flex h-12 flex-none cursor-pointer items-center rounded-[12px] px-4 text-left text-[15px] font-[600] transition-colors",
  variants: { active: { true: "text-on-gold", false: "text-ink-2 hover:text-ink" } },
})

/** Perfis: o que cada papel faz, vê e não pode — o mesmo que o app aplica. */
export function Roles() {
  const [index, setIndex] = useState(0)
  const role = ROLES[index]

  return (
    <section id="perfis" className="border-y border-border bg-raised/60">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 md:py-32">
        <h2 className="t-title max-w-[16ch] text-[clamp(32px,4vw,54px)] text-ink">Cada pessoa vê a sua parte da obra.</h2>
        <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-ink-2">
          O engenheiro responsável define o papel de cada integrante. O PRISSMA mostra a cada um o que ele precisa e bloqueia o que não é da sua alçada.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
          <div role="tablist" aria-label="Perfis" className="scrollbar-none -mx-5 flex gap-1 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:px-0">
            {ROLES.map((item, i) => (
              <button key={item.key} type="button" role="tab" aria-selected={index === i} onClick={() => setIndex(i)} className={tab({ active: index === i })}>
                {index === i && <motion.span layoutId="role-pill" className="absolute inset-0 rounded-[12px] bg-gold-grad" transition={SPRING} />}
                <span className="relative">{item.label}</span>
              </button>
            ))}
          </div>
          <div role="tabpanel" className="relative min-h-[340px] overflow-hidden rounded-[20px] bg-surface hairline">
            <AnimatePresence mode="wait">
              <motion.div
                key={role.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
                className="grid gap-8 p-6 sm:p-8 md:grid-cols-2"
              >
                <div>
                  <p className="t-section text-[22px] text-ink">{role.lead}</p>
                  <ul className="mt-6 space-y-3 p-0">
                    {role.can.map((item, i) => (
                      <motion.li key={item} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i + 0.1 }} className="flex list-none items-start gap-3 text-[15px] text-ink">
                        <span className="mt-0.5 flex size-5 flex-none items-center justify-center rounded-full bg-gold-soft text-gold-hi">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-[13px] font-[600] text-meta">Tela principal</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {role.sees.map((item) => (
                        <span key={item} className="inline-flex h-8 items-center rounded-pill bg-raised px-3 text-[13px] font-[560] text-ink hairline">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  {role.locked.length > 0 && (
                    <div>
                      <p className="text-[13px] font-[600] text-meta">Sem permissão para</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {role.locked.map((item) => (
                          <span key={item} className="hazard inline-flex h-8 items-center gap-1.5 rounded-pill px-3 text-[13px] text-ink-2 hairline">
                            <Lock size={12} />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="blueprint mt-auto rounded-[14px] bg-raised p-4 hairline">
                    <Fachada floors={2} progress={role.progress} seed={7} showDims={false} className="h-28 w-full" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
