import { motion } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { tv } from "tailwind-variants"

import { SPRING, SPRING_SOFT } from "@/lib/motion"

import { DemoEquipes } from "./demos/DemoEquipes"
import { DemoEtapas } from "./demos/DemoEtapas"
import { DemoOrcamento } from "./demos/DemoOrcamento"
import { DemoTarefas } from "./demos/DemoTarefas"

interface Module {
  key: string
  token: string
  name: string
  title: string
  body: string
  demo: ReactNode
}

const MODULES: Module[] = [
  {
    key: "etapas",
    token: "--ray-1",
    name: "Etapas",
    title: "Um cronograma que mostra o atraso antes dele virar problema.",
    body: "Divida a obra em etapas com datas previstas, acompanhe o status de cada uma e veja em destaque o que passou do prazo.",
    demo: <DemoEtapas />,
  },
  {
    key: "equipes",
    token: "--ray-2",
    name: "Equipes",
    title: "Quem está em cada etapa, sem precisar perguntar.",
    body: "Monte a equipe da obra, defina o papel de cada pessoa e aloque quem vai trabalhar em cada dia. Quem recebe uma tarefa é avisado.",
    demo: <DemoEquipes />,
  },
  {
    key: "orcamento",
    token: "--ray-3",
    name: "Orçamento",
    title: "Previsto e gasto lado a lado, em cada categoria.",
    body: "Lance despesas com fornecedor e etapa. O saldo se atualiza na hora e a categoria que estourar aparece em destaque.",
    demo: <DemoOrcamento />,
  },
  {
    key: "tarefas",
    token: "--ray-4",
    name: "Tarefas",
    title: "Um quadro para o dia a dia do canteiro.",
    body: "Mova tarefas entre A fazer, Em andamento, Bloqueada e Concluída. O progresso da etapa e da obra acompanha sozinho.",
    demo: <DemoTarefas />,
  },
]

const navItem = tv({
  base: "relative flex h-12 w-full cursor-pointer items-center gap-3 rounded-[12px] px-4 text-left transition-colors",
  variants: { active: { true: "text-ink", false: "text-meta hover:text-ink-2" } },
})

const dot = tv({
  base: "relative size-2.5 rounded-full transition-transform",
  variants: { active: { true: "scale-130", false: "" } },
})

/** As quatro frentes, cada uma com uma demo que se usa de verdade. */
export function Modules() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(Number((entry.target as HTMLElement).dataset.i))),
      { rootMargin: "-45% 0px -45% 0px" },
    )
    refs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="frentes" className="relative mx-auto max-w-[1240px] px-5 py-24 sm:px-8 md:py-36">
      <div className="grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <div className="md:sticky md:top-[18vh] md:self-start">
          <h2 className="t-title max-w-[14ch] text-[clamp(32px,4vw,54px)] text-ink">Tudo o que a obra precisa, separado com clareza.</h2>
          <p className="mt-5 max-w-[40ch] text-[16px] leading-relaxed text-ink-2">
            Quatro frentes que conversam entre si: concluir uma tarefa avança a etapa, e lançar uma despesa atualiza o orçamento da obra.
          </p>
          <ol className="mt-10 hidden space-y-1 p-0 md:block">
            {MODULES.map((module, i) => (
              <li key={module.key} className="list-none">
                <button type="button" onClick={() => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })} className={navItem({ active: active === i })}>
                  {active === i && <motion.span layoutId="module-active" className="absolute inset-0 rounded-[12px] bg-surface hairline" transition={SPRING} />}
                  <i className={dot({ active: active === i })} style={{ background: `var(${module.token})` }} />
                  <span className="t-section relative text-[16px]">{module.name}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-20 md:space-y-[22vh] md:py-[10vh]">
          {MODULES.map((module, i) => (
            <article
              key={module.key}
              ref={(el) => {
                refs.current[i] = el
              }}
              data-i={i}
            >
              <p className="flex items-center gap-2 text-[14px] font-[620] text-ink-2">
                <i className="size-2.5 rounded-full" style={{ background: `var(${module.token})` }} />
                {module.name}
              </p>
              <h3 className="t-section mt-3 max-w-[26ch] text-[clamp(22px,2.2vw,30px)] leading-tight text-ink">{module.title}</h3>
              <p className="mt-3 max-w-[52ch] text-[15.5px] leading-relaxed text-ink-2">{module.body}</p>
              <motion.div
                className="mt-7 overflow-hidden rounded-[18px] bg-surface shadow-soft hairline"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={SPRING_SOFT}
              >
                <div className="h-1" style={{ background: `var(${module.token})` }} />
                {module.demo}
              </motion.div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
