import { RAYS } from "@/scene/rays"

/** O prisma em SVG estático, para navegador sem WebGL. */
export function PrismFallback() {
  return (
    <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        {RAYS.map((ray) => (
          <linearGradient key={ray.key} id={`fallback-${ray.key}`} x1="0" x2="1">
            <stop offset="0" stopColor={`var(${ray.token})`} stopOpacity="0.9" />
            <stop offset="1" stopColor={`var(${ray.token})`} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      <line x1="0" y1="290" x2="470" y2="252" stroke="var(--ink)" strokeWidth="3" opacity="0.8" />
      {RAYS.map((ray, i) => (
        <polygon key={ray.key} points={`540,246 800,${150 + i * 60} 800,${190 + i * 60}`} fill={`url(#fallback-${ray.key})`} />
      ))}
      <polygon points="520,150 600,300 440,300" fill="var(--gold-soft)" fillOpacity="0.5" stroke="var(--gold-hi)" strokeOpacity="0.6" />
    </svg>
  )
}
