import type { AnchorHTMLAttributes } from "react"
import { tv } from "tailwind-variants"

/**
 * CTA da landing: um link com cara de botão do DS v2 — navegar para o app é
 * sair da página, então é `<a>`, não `<button>`.
 *
 * - `primary`: gradiente ouro. A ação que move a pessoa (Criar conta).
 * - `outline`: contorno sobre `surface` (Entrar).
 * - `quiet`: só texto, para a navegação.
 */
const link = tv({
  base: [
    "inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap font-[620]",
    "transition-[transform,filter,background-color,color] duration-150 active:scale-[0.97]",
  ],
  variants: {
    variant: {
      primary: "bg-gold-grad text-on-gold hover:brightness-108",
      outline: "bg-surface/70 text-ink backdrop-blur hairline-strong hover:bg-raised",
      quiet: "text-ink-2 hover:bg-raised hover:text-ink",
    },
    size: {
      sm: "h-9 gap-1.5 rounded-sm px-3.5 text-[13.5px]",
      md: "h-11 gap-2 rounded-md px-4 text-[14px]",
      lg: "h-13 gap-2 rounded-md px-6 text-[15.5px]",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
})

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "outline" | "quiet"
  size?: "sm" | "md" | "lg"
}

export function ButtonLink({ variant, size, className, children, ...props }: ButtonLinkProps) {
  return (
    <a className={link({ variant, size, className })} {...props}>
      {children}
    </a>
  )
}
