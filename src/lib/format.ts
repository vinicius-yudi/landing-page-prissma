const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })

/** Valor em reais, sem centavos — é assim que a obra fala de dinheiro na landing. */
export function money(value: number): string {
  return BRL.format(value)
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
