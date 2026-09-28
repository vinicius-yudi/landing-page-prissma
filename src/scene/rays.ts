/**
 * As quatro frentes que saem do prisma. A cor é o token `--ray-*` do
 * `index.css` (único arquivo que conhece hex): a cena lê o valor resolvido
 * no navegador, então trocar a paleta não exige mexer aqui.
 */
export const RAYS = [
  { key: "etapas", label: "Etapas", token: "--ray-1", angle: 15 },
  { key: "equipes", label: "Equipes", token: "--ray-2", angle: 5.5 },
  { key: "orcamento", label: "Orçamento", token: "--ray-3", angle: -4 },
  { key: "tarefas", label: "Tarefas", token: "--ray-4", angle: -13.5 },
] as const
