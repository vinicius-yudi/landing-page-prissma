/** O navegador consegue desenhar a cena 3D? Sem isso, o prisma vira SVG. */
export function webglAvailable() {
  try {
    const c = document.createElement("canvas")
    return !!(c.getContext("webgl2") || c.getContext("webgl"))
  } catch {
    return false
  }
}
