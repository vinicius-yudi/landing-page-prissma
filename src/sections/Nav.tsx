import { Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

import { APP_LINKS } from "@/lib/appUrl"
import { ButtonLink } from "@/ui/ButtonLink"
import { Logo } from "@/ui/Logo"

const LINKS = [
  { id: "frentes", label: "Como funciona" },
  { id: "perfis", label: "Perfis" },
  { id: "sequencia", label: "Etapas da obra" },
]

interface NavProps {
  /** Sobre o trecho claro da página: a barra troca de tema junto. */
  light: boolean
  onJump: (id: string) => void
}

/** Barra fixa com vidro fosco; no celular, os atalhos vão para um menu. */
export function Nav({ light, onJump }: NavProps) {
  const [open, setOpen] = useState(false)

  function jump(id: string) {
    setOpen(false)
    onJump(id)
  }

  return (
    <header data-theme={light ? "light" : "dark"} className="fixed inset-x-0 top-0 z-(--z-nav) pt-[env(safe-area-inset-top)]">
      <div className="mx-auto mt-3 flex h-14 max-w-[1240px] items-center justify-between rounded-[16px] bg-surface/70 px-3 pl-4 backdrop-blur-xl transition-colors duration-500 hairline sm:mx-6 xl:mx-auto">
        <a href="#topo" aria-label="PRISSMA, início" className="text-ink">
          <Logo />
        </a>
        <nav aria-label="Seções" className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <button key={link.id} type="button" onClick={() => jump(link.id)} className="h-9 cursor-pointer rounded-[9px] px-3 text-[13.5px] font-[560] text-ink-2 transition-colors hover:text-ink">
              {link.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <ButtonLink href={APP_LINKS.login} variant="quiet" size="sm" className="hidden sm:inline-flex">
            Entrar
          </ButtonLink>
          <ButtonLink href={APP_LINKS.signup} size="sm">
            Criar conta
          </ButtonLink>
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 cursor-pointer items-center justify-center rounded-[9px] text-ink md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Seções"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-3 mt-2 flex flex-col rounded-[16px] bg-surface p-2 hairline md:hidden"
          >
            {LINKS.map((link) => (
              <button key={link.id} type="button" onClick={() => jump(link.id)} className="h-11 cursor-pointer rounded-[10px] px-3 text-left text-[15px] font-[560] text-ink hover:bg-raised">
                {link.label}
              </button>
            ))}
            <a href={APP_LINKS.login} className="flex h-11 items-center rounded-[10px] px-3 text-[15px] font-[560] text-ink hover:bg-raised">
              Entrar
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
