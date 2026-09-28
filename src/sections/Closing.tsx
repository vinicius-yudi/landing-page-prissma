import { APP_LINKS } from "@/lib/appUrl"
import { ButtonLink } from "@/ui/ButtonLink"
import { Logo } from "@/ui/Logo"
import { LogoMark } from "@/ui/LogoMark"

/** Fechamento e rodapé: o convite final e os créditos do TCC. */
export function Closing() {
  return (
    <section data-theme="dark" className="relative overflow-hidden bg-bg text-ink">
      <div className="blueprint absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex max-w-[1240px] flex-col items-start px-5 py-24 sm:px-8 md:py-32">
        <LogoMark size={56} />
        <h2 className="t-hero mt-8 max-w-[13ch] text-[clamp(40px,6.4vw,92px)]">Comece pela próxima obra.</h2>
        <p className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-ink-2">
          Crie a conta da sua construtora, cadastre a obra e convide a equipe. Etapas, tarefas, orçamento e diário ficam no mesmo lugar desde o primeiro dia.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={APP_LINKS.signup} size="lg">
            Criar conta
          </ButtonLink>
          <ButtonLink href={APP_LINKS.login} size="lg" variant="outline">
            Entrar
          </ButtonLink>
        </div>
      </div>
      <footer className="relative border-t border-border">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-10 text-[13px] text-meta sm:px-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Logo size={22} />
            <p className="mt-4 max-w-[60ch] leading-relaxed">Trabalho de conclusão de curso do Bacharelado em Sistemas de Informação da PUCPR, Curitiba, 2026.</p>
          </div>
          <p className="max-w-[46ch] leading-relaxed md:text-right">Giordano Diniz Serafini, Guilherme Sampaio Furquim, Julia Tatim Castro e Vinicius Yudi Sumiyoshi Alves.</p>
        </div>
      </footer>
    </section>
  )
}
