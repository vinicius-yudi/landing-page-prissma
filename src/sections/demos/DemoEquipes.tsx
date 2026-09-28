import { Bell, Plus } from "lucide-react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { useRef, useState, type CSSProperties } from "react"

import { SPRING } from "@/lib/motion"

const CREW = [
  { name: "Anderson", role: "Pedreiro", hue: 12 },
  { name: "Pedro", role: "Encanador", hue: 195 },
  { name: "Carlos", role: "Eletricista", hue: 48 },
  { name: "Tiago", role: "Pintor", hue: 250 },
]

const NOTICE_MS = 2200

function Initial({ name, hue }: { name: string; hue: number }) {
  return (
    <span className="avatar-hue flex size-7 items-center justify-center rounded-full text-[11px] font-[700]" style={{ "--hue": hue } as CSSProperties}>
      {name[0]}
    </span>
  )
}

/** Equipes: tocar em alguém aloca na etapa e mostra o aviso que a pessoa recebe. */
export function DemoEquipes() {
  const [team, setTeam] = useState<string[]>(["Anderson"])
  const [notice, setNotice] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function toggle(name: string) {
    const joining = !team.includes(name)
    setTeam((current) => (joining ? [...current, name] : current.filter((n) => n !== name)))
    if (!joining) return
    setNotice(name)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setNotice(null), NOTICE_MS)
  }

  return (
    <div className="relative p-5 sm:p-6">
      <p className="text-[12px] text-meta">Etapa</p>
      <p className="t-section text-[16px] text-ink">Instalações elétricas e hidráulicas</p>
      <LayoutGroup>
        <div className="mt-4 min-h-[52px] rounded-[12px] border border-dashed border-border-strong p-2">
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {CREW.filter((c) => team.includes(c.name)).map((c) => (
                <motion.button
                  layout
                  layoutId={`crew-${c.name}`}
                  key={c.name}
                  type="button"
                  onClick={() => toggle(c.name)}
                  className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-pill bg-surface pr-3 pl-1 text-[13px] font-[600] text-ink shadow-soft hairline"
                  transition={SPRING}
                >
                  <Initial name={c.name} hue={c.hue} />
                  {c.name}
                </motion.button>
              ))}
            </AnimatePresence>
            {team.length === 0 && <span className="p-2 text-[13px] text-meta">Toque em alguém abaixo</span>}
          </div>
        </div>
        <p className="mt-4 mb-2 text-[12px] text-meta">Disponíveis</p>
        <div className="flex flex-wrap gap-2">
          {CREW.filter((c) => !team.includes(c.name)).map((c) => (
            <motion.button
              layout
              layoutId={`crew-${c.name}`}
              key={c.name}
              type="button"
              onClick={() => toggle(c.name)}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-pill bg-raised pr-3 pl-1 text-[13px] text-ink-2 hairline hover:text-ink"
              transition={SPRING}
            >
              <Initial name={c.name} hue={c.hue} />
              {c.name} <span className="text-meta">{c.role}</span>
              <Plus size={14} className="text-gold-hi" />
            </motion.button>
          ))}
        </div>
      </LayoutGroup>
      <AnimatePresence>
        {notice && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={SPRING}
            className="absolute right-4 bottom-4 flex items-center gap-2 rounded-[12px] bg-inverse px-3 py-2.5 text-[12.5px] text-on-inverse shadow-lift"
          >
            <Bell size={14} /> {notice} foi avisado da alocação
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
