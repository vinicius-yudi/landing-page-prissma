# prissma-landing

Página pública do PRISSMA — gestão de obras e reformas de pequeno porte. É a porta de entrada: os botões **Entrar** e
**Criar conta** levam para o app ([prissma-front](../prissma-front)).

## Stack

Vite 8 · React 19 · TypeScript · Tailwind 4 · motion · gsap + ScrollTrigger · lenis · three.js · lucide-react ·
tailwind-variants.

## Comandos

```bash
bun install
bun run dev        # http://localhost:3001
bun run lint
bun run build      # trava de cor + tipos + bundle estático em dist/
bun run preview
```

Copie `.env.example` para `.env` e ajuste `VITE_APP_URL` para o endereço do app em cada ambiente.

## Design system

Os tokens são os do DS v2 "Barroco ouro", copiados do app (`src/styles/index.css`), que é o **único** arquivo com hex —
`scripts/check-colors.mjs` reprova o build se aparecer cor crua em outro lugar. A página abre no escuro (Barroco),
passa ao claro (Canteiro) nas seções de conteúdo e fecha no escuro, trocando `data-theme` por trecho.

Os quatro raios do prisma (`--ray-1…4`: Etapas, Equipes, Orçamento, Tarefas) são tokens **só da landing**, em tons
derivados do ouro. A cena 3D lê os tokens resolvidos no navegador, então mudar a paleta não exige mexer no three.js.

Fachada, Trena e logos são cópias dos componentes do app (`src/ui/`). Se mudarem lá, atualize aqui.

## Estrutura

```
src/
├── App.tsx              # composição da página e troca de tema da barra
├── sections/            # uma seção por arquivo (Nav, Story, Modules, Roles, Sequence, Closing)
│   ├── story/           # abertura rolável: fragmentos, prisma, linha do tempo do scroll
│   └── demos/           # as demos interativas das quatro frentes
├── scene/PrismScene.ts  # cena three.js do prisma
├── ui/                  # Logo, Fachada, Trena (Progress), ButtonLink
├── lib/                 # molas, links do app, rolagem suave, formatação
└── styles/index.css     # tokens do DS
```

Movimento reduzido: sem Lenis (rolagem nativa), sem animações de CSS e com o `MotionConfig reducedMotion="user"`. Sem
WebGL, o prisma cai num SVG estático.
