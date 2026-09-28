import { ArrowDown } from "lucide-react"
import { motion } from "motion/react"
import { useRef } from "react"

import { APP_LINKS } from "@/lib/appUrl"
import { SPRING_SOFT } from "@/lib/motion"
import { RAYS } from "@/scene/rays"
import { ButtonLink } from "@/ui/ButtonLink"

import { FRAGMENTS } from "./fragments"
import { PrismFallback } from "./PrismFallback"
import { usePrismScene } from "./usePrismScene"
import { useStoryTimeline } from "./useStoryTimeline"

/**
 * Abertura: o título, depois a obra espalhada (planilha, WhatsApp, caderno)
 * sendo sugada pelo prisma, que a devolve em quatro frentes. O palco fica
 * preso (`sticky`) enquanto a rolagem conduz a cena.
 */
export function Story() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvasBox = useRef<HTMLDivElement>(null)
  const { hasWebGL, scene, labels, labelAlpha } = usePrismScene(canvasBox)
  useStoryTimeline({ wrap, scene, labelAlpha })

  return (
    <div ref={wrap} className="relative h-[360vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_70%_40%,var(--gold-soft)_0%,var(--bg)_65%)]" />
        <div ref={canvasBox} className="absolute inset-0">
          {!hasWebGL && <PrismFallback />}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-bg to-transparent" />

        <div data-hero className="absolute inset-0 mx-auto flex max-w-[1240px] flex-col justify-end px-5 pb-[max(88px,12vh)] sm:px-8 md:justify-center md:pb-0">
          <motion.h1
            className="t-hero max-w-[11ch] text-[clamp(46px,8.4vw,118px)] text-ink"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SOFT, delay: 0.15 }}
          >
            Cada obra, sob controle.
          </motion.h1>
          <motion.p
            className="mt-6 max-w-[46ch] text-[clamp(15px,1.35vw,18px)] leading-relaxed text-ink-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SOFT, delay: 0.3 }}
          >
            O PRISSMA reúne etapas, equipes, tarefas e orçamento de obras e reformas de pequeno porte, para que engenheiro,
            arquiteto, mestre de obras e proprietário acompanhem o mesmo andamento.
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING_SOFT, delay: 0.45 }}>
            <ButtonLink href={APP_LINKS.signup} size="lg">
              Criar conta
            </ButtonLink>
            <ButtonLink href={APP_LINKS.login} size="lg" variant="outline">
              Entrar
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div data-cue className="absolute inset-x-0 bottom-6 flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
          <span className="inline-flex items-center gap-2 text-[12.5px] text-meta">
            <motion.span animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
              <ArrowDown size={14} />
            </motion.span>
            Role para ver a obra se organizar
          </span>
        </motion.div>

        <div data-story1 className="invisible absolute inset-x-0 top-[13vh] mx-auto max-w-[1240px] px-5 text-center sm:px-8">
          <h2 className="t-title mx-auto max-w-[18ch] text-[clamp(30px,4.2vw,56px)] text-ink">Hoje, a obra vive espalhada.</h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-[16px] leading-relaxed text-ink-2">
            Orçamento numa planilha, a equipe no WhatsApp, o diário num caderno. Cada um enxerga um pedaço diferente da mesma obra.
          </p>
        </div>

        {FRAGMENTS.map((fragment) => (
          <div
            key={fragment.key}
            data-frag
            data-r={fragment.r}
            data-mobile={fragment.mobile ? "1" : "0"}
            className="invisible absolute will-change-transform"
            style={{ left: `${fragment.x}%`, top: `${fragment.y}%` }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2">{fragment.node}</div>
          </div>
        ))}

        <div data-story2 className="invisible absolute inset-x-0 bottom-[9vh] mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="max-w-[40ch]">
            <h2 className="t-title text-[clamp(30px,4.2vw,56px)] text-ink">Quatro frentes. Uma obra.</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-2">
              Cada informação entra uma vez e aparece para quem precisa: etapas no cronograma, pessoas nas equipes, custos no
              orçamento e tarefas no quadro do dia.
            </p>
          </div>
        </div>

        {hasWebGL &&
          RAYS.map((ray, i) => (
            <div
              key={ray.key}
              ref={(el) => {
                labels.current[i] = el
              }}
              className="pointer-events-none absolute top-0 left-0 opacity-0 will-change-transform"
            >
              <span className="t-wide inline-flex h-8 items-center gap-2 rounded-pill bg-bg/70 px-3 text-[13px] font-[640] text-ink backdrop-blur-md hairline">
                <i className="size-2 rounded-full" style={{ background: `var(${ray.token})`, boxShadow: `0 0 12px var(${ray.token})` }} />
                {ray.label}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}
