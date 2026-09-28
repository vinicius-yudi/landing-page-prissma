/**
 * Endereço do app (prissma-front). A landing é só a porta de entrada: "Entrar"
 * e "Criar conta" levam para as rotas reais do produto.
 */
const BASE = (import.meta.env.VITE_APP_URL ?? "http://localhost:3000").replace(/\/$/, "")

export const APP_LINKS = {
  login: `${BASE}/login`,
  signup: `${BASE}/cadastro`,
} as const
