import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"

import { RAYS } from "./rays"

/** Valor resolvido de um token de cor do tema escuro (a cena é sempre escura). */
function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

const rayVert = /* glsl */ `
  uniform float uLen; uniform float uW0; uniform float uW1;
  varying vec2 vUv;
  void main(){
    vUv = uv;
    vec3 p = position;
    float t = p.x + 0.5;
    p.x = t * uLen;
    p.y = p.y * mix(uW0, uW1, t);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`
const rayFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uReveal; uniform float uIntensity; uniform float uTime;
  uniform float uFadeIn; uniform float uFadeOut; uniform float uFlip;
  varying vec2 vUv;
  void main(){
    float along = mix(vUv.x, 1.0 - vUv.x, uFlip);
    float across = abs(vUv.y - 0.5) * 2.0;
    float core = pow(clamp(1.0 - across, 0.0, 1.0), 1.8);
    float hot = pow(clamp(1.0 - across, 0.0, 1.0), 10.0) * 0.8;
    float fade = smoothstep(0.0, uFadeIn, along) * (1.0 - smoothstep(uFadeOut, 1.0, along));
    float rev = 1.0 - smoothstep(uReveal - 0.06, uReveal, along);
    float flick = 0.94 + 0.06 * sin(uTime * 1.7 + along * 14.0);
    float a = (core + hot) * fade * rev * uIntensity * flick;
    gl_FragColor = vec4(uColor * a + vec3(hot * a * 0.4), a);
  }
`

const gridVert = /* glsl */ `
  varying vec3 vW;
  void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }
`
const gridFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uOpacity; uniform float uTime;
  varying vec3 vW;
  float line(vec2 p, float s){ vec2 q = p / s; vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q); return 1.0 - min(min(g.x, g.y), 1.0); }
  void main(){
    float d = length(vW.xz - vec2(0.0, -1.0));
    float g = line(vW.xz, 0.5) * 0.35 + line(vW.xz, 2.5) * 0.9;
    float fade = 1.0 - smoothstep(1.5, 11.0, d);
    float a = g * fade * uOpacity;
    gl_FragColor = vec4(uColor * a, a);
  }
`

function makeRay(color: string, len: number, w0: number, w1: number, fadeIn: number, fadeOut: number, flip = 0) {
  const mat = new THREE.ShaderMaterial({
    vertexShader: rayVert,
    fragmentShader: rayFrag,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uReveal: { value: 0 },
      uIntensity: { value: 1 },
      uTime: { value: 0 },
      uLen: { value: len },
      uW0: { value: w0 },
      uW1: { value: w1 },
      uFadeIn: { value: fadeIn },
      uFadeOut: { value: fadeOut },
      uFlip: { value: flip },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  return new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 24, 1), mat)
}

export class PrismScene {
  renderer: THREE.WebGLRenderer
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
  composer: EffectComposer
  group = new THREE.Group()
  prism: THREE.Mesh
  edges: THREE.LineSegments
  beam: THREE.Mesh
  rays: THREE.Mesh[] = []
  dust: THREE.Points
  grid: THREE.Mesh
  clock = new THREE.Clock()
  raf = 0
  running = false
  pointer = new THREE.Vector2()
  pointerLerp = new THREE.Vector2()
  intro = 0
  scroll = 0
  reduced: boolean
  onFrame?: (labels: { x: number; y: number; o: number }[]) => void
  container: HTMLElement
  ro: ResizeObserver
  rayOrigin = new THREE.Vector3(0.42, 0.06, 0)
  rayLen = 11

  constructor(container: HTMLElement, reduced: boolean) {
    this.container = container
    this.reduced = reduced
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.setClearColor(0x000000, 0)
    container.appendChild(this.renderer.domElement)
    Object.assign(this.renderer.domElement.style, { width: "100%", height: "100%", display: "block" })

    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    this.scene.environmentIntensity = 0.55

    this.camera.position.set(0, 0.25, 10)
    this.scene.add(this.group)

    // floor: blueprint grid
    this.grid = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.ShaderMaterial({
        vertexShader: gridVert,
        fragmentShader: gridFrag,
        uniforms: { uColor: { value: new THREE.Color(token("--gold")) }, uOpacity: { value: 0.5 }, uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    )
    this.grid.rotation.x = -Math.PI / 2
    this.grid.position.y = -1.75
    this.group.add(this.grid)

    // incoming white beam
    this.beam = makeRay(token("--ink"), 9.5, 0.055, 0.1, 0.02, 0.98, 1)
    const beamEnd = new THREE.Vector3(-0.5, -0.02, 0)
    const beamAngle = THREE.MathUtils.degToRad(7)
    this.beam.position.set(beamEnd.x - Math.cos(beamAngle) * 9.5, beamEnd.y - Math.sin(beamAngle) * 9.5, -0.05)
    this.beam.rotation.z = beamAngle
    ;(this.beam.material as THREE.ShaderMaterial).uniforms.uFadeIn.value = 0.02
    ;(this.beam.material as THREE.ShaderMaterial).uniforms.uFadeOut.value = 0.75
    this.group.add(this.beam)

    // outgoing rays
    RAYS.forEach((r) => {
      const m = makeRay(token(r.token), this.rayLen, 0.06, 0.9, 0.04, 0.55)
      m.position.copy(this.rayOrigin).setZ(-0.1)
      m.rotation.z = THREE.MathUtils.degToRad(r.angle)
      this.rays.push(m)
      this.group.add(m)
    })

    // the prism (logo mark in glass)
    const R = 1.25
    const shape = new THREE.Shape()
    for (let i = 0; i < 3; i++) {
      const a = Math.PI / 2 + (i * Math.PI * 2) / 3
      const x = Math.cos(a) * R
      const y = Math.sin(a) * R
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    shape.closePath()
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 1.5, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.06, bevelSegments: 5, curveSegments: 1 })
    geo.center()
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.03,
      transmission: 1,
      thickness: 1.4,
      ior: 1.52,
      dispersion: 6,
      attenuationColor: new THREE.Color(token("--gold-hi")),
      attenuationDistance: 2.2,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      specularIntensity: 1,
      envMapIntensity: 0.75,
      transparent: false,
    })
    this.prism = new THREE.Mesh(geo, mat)
    this.prism.position.set(0, 0.02, 0.2)
    this.group.add(this.prism)

    this.edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), new THREE.LineBasicMaterial({ color: token("--gold-hi"), transparent: true, opacity: 0.35 }))
    this.prism.add(this.edges)

    // soft back light so the glass has something to refract
    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(2.6, 48),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color(token("--gold-deep")) } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
        fragmentShader: `uniform vec3 uColor; varying vec2 vUv; void main(){ float d = distance(vUv, vec2(0.5)); float a = pow(1.0 - smoothstep(0.0, 0.5, d), 2.0) * 0.55; gl_FragColor = vec4(uColor*a, a);} `,
      }),
    )
    glow.position.set(0.2, 0.1, -2.2)
    glow.scale.setScalar(1.6)
    this.group.add(glow)

    // construction dust
    const N = 420
    const pos = new Float32Array(N * 3)
    const seeds = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1
      seeds[i] = Math.random()
    }
    const dg = new THREE.BufferGeometry()
    dg.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    dg.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1))
    this.dust = new THREE.Points(
      dg,
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uPx: { value: this.renderer.getPixelRatio() } },
        vertexShader: `uniform float uTime; uniform float uPx; attribute float aSeed; varying float vA;
          void main(){ vec3 p = position; p.y += sin(uTime*0.25 + aSeed*20.0)*0.18; p.x += cos(uTime*0.18 + aSeed*12.0)*0.22;
            vec4 mv = modelViewMatrix*vec4(p,1.0); gl_Position = projectionMatrix*mv; gl_PointSize = (1.5 + aSeed*2.5) * uPx * (6.0 / -mv.z);
            vA = 0.25 + 0.5*aSeed; }`,
        fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); float a = (1.0 - smoothstep(0.2, 0.5, d)) * vA; gl_FragColor = vec4(vec3(0.62,0.9,0.85)*a, a);} `,
      }),
    )
    this.group.add(this.dust)

    // post
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.42, 0.55, 0.62)
    this.composer.addPass(bloom)
    this.composer.addPass(new OutputPass())

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(container)
    this.resize()
    window.addEventListener("pointermove", this.onPointer, { passive: true })
    if (reduced) this.intro = 1
  }

  onPointer = (e: PointerEvent) => {
    this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
  }

  resize() {
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.composer.setSize(w, h)
    this.camera.aspect = w / h
    // keep the scene framed on narrow screens
    this.camera.fov = w / h < 0.8 ? 46 : w / h < 1.2 ? 38 : 30
    this.camera.updateProjectionMatrix()
  }

  setScroll(p: number) {
    this.scroll = p
  }

  start() {
    if (this.running) return
    this.running = true
    this.clock.getDelta()
    const loop = () => {
      if (!this.running) return
      this.raf = requestAnimationFrame(loop)
      this.frame()
    }
    loop()
  }
  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  frame() {
    const dt = Math.min(this.clock.getDelta(), 0.05)
    const t = this.clock.elapsedTime
    if (this.intro < 1) this.intro = Math.min(1, this.intro + dt / 2.4)
    const ease = (x: number) => 1 - Math.pow(1 - x, 3)
    const ip = ease(this.intro)
    const s = this.scroll

    this.pointerLerp.lerp(this.pointer, this.reduced ? 1 : 0.05)
    const wide = this.camera.aspect > 1.2

    // hero framing → centered during the story
    const heroX = wide ? 2.45 : 0
    const heroY = wide ? -0.05 : 1.25
    const k = THREE.MathUtils.smoothstep(s, 0.05, 0.4)
    this.group.position.x = THREE.MathUtils.lerp(heroX, this.storyX(), k)
    this.group.position.y = THREE.MathUtils.lerp(heroY, this.storyY(), k)
    this.camera.position.z = THREE.MathUtils.lerp(10, 9, k)

    const idle = this.reduced ? 0 : Math.sin(t * 0.35) * 0.08
    this.prism.rotation.y = -0.45 + this.pointerLerp.x * 0.35 + idle + s * 1.1
    this.prism.rotation.x = 0.12 + this.pointerLerp.y * 0.12
    this.prism.rotation.z = Math.sin(t * 0.2) * (this.reduced ? 0 : 0.02)

    const beamU = (this.beam.material as THREE.ShaderMaterial).uniforms
    beamU.uReveal.value = THREE.MathUtils.clamp(ip * 1.6, 0, 1.06)
    beamU.uIntensity.value = 0.9 + s * 0.5
    beamU.uTime.value = t

    // rays fan out after the beam hits the glass; absorbing fragments makes them brighter
    const absorb = THREE.MathUtils.smoothstep(s, 0.35, 0.72)
    this.rays.forEach((m, i) => {
      const u = (m.material as THREE.ShaderMaterial).uniforms
      const local = THREE.MathUtils.clamp((ip - 0.45 - i * 0.05) / 0.5, 0, 1)
      u.uReveal.value = ease(local) * (0.62 + absorb * 0.44)
      u.uIntensity.value = (0.55 + absorb * 0.65) * (this.reduced ? 1 : 1)
      u.uTime.value = t + i
      u.uW1.value = 0.7 + absorb * 0.5
    })
    ;(this.dust.material as THREE.ShaderMaterial).uniforms.uTime.value = t
    ;(this.grid.material as THREE.ShaderMaterial).uniforms.uOpacity.value = 0.35 + absorb * 0.25

    this.composer.render()

    if (this.onFrame) {
      const w = this.container.clientWidth
      const h = this.container.clientHeight
      const labels = this.rays.map((m, i) => {
        const u = (m.material as THREE.ShaderMaterial).uniforms
        const along = Math.min(u.uReveal.value, 0.95) * this.rayLen * 0.3
        const a = THREE.MathUtils.degToRad(RAYS[i].angle)
        const p = new THREE.Vector3(this.rayOrigin.x + Math.cos(a) * along, this.rayOrigin.y + Math.sin(a) * along, 0)
        p.add(this.group.position).project(this.camera)
        return { x: (p.x * 0.5 + 0.5) * w, y: (-p.y * 0.5 + 0.5) * h, o: u.uReveal.value }
      })
      this.onFrame(labels)
    }
  }

  prismScreen() {
    const p = this.prism.position.clone().add(this.group.position).project(this.camera)
    return { x: (p.x * 0.5 + 0.5) * this.container.clientWidth, y: (-p.y * 0.5 + 0.5) * this.container.clientHeight }
  }

  storyX() {
    return this.camera.aspect > 1.2 ? 0.5 : 0
  }
  storyY() {
    return this.camera.aspect > 1.2 ? -0.22 : -0.35
  }

  /** Where the prism sits on screen once the story section has centered it. */
  prismStoryScreen() {
    const cam = this.camera.clone()
    cam.position.z = 9
    cam.updateMatrixWorld()
    const p = new THREE.Vector3(this.storyX(), this.storyY() + 0.02, 0.2).project(cam)
    return { x: (p.x * 0.5 + 0.5) * this.container.clientWidth, y: (-p.y * 0.5 + 0.5) * this.container.clientHeight }
  }

  dispose() {
    this.stop()
    this.ro.disconnect()
    window.removeEventListener("pointermove", this.onPointer)
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose?.()
      const mat = m.material as THREE.Material | undefined
      mat?.dispose?.()
    })
    this.composer.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}
