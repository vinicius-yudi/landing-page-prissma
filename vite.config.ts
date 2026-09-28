import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // PostCSS vazio: o Vite não sobe diretórios atrás de um postcss.config
  // perdido. O Tailwind 4 roda pelo plugin acima.
  css: { postcss: {} },
  resolve: {
    alias: { "@": `${import.meta.dirname}/src` },
  },
  server: { port: 3001 },
  build: {
    // three.js é grande e só a cena do prisma o usa: fica num chunk à parte,
    // carregado sob demanda. O núcleo dele passa de 500 kB sozinho.
    chunkSizeWarningLimit: 650,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "three"
          if (id.includes("node_modules/gsap") || id.includes("node_modules/lenis")) return "scroll"
          return undefined
        },
      },
    },
  },
})
