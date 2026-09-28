import { CalendarClock, FileSpreadsheet, Image as ImageIcon, MessageCircle, Mic, NotebookPen, Receipt } from "lucide-react"
import type { ReactNode } from "react"

export interface Fragment {
  key: string
  /** Posição em % da tela. */
  x: number
  y: number
  /** Inclinação em graus. */
  r: number
  /** Aparece também no celular (os outros somem para não entulhar). */
  mobile?: boolean
  node: ReactNode
}

const WAVE = [5, 9, 14, 8, 12, 6, 10, 15, 7, 11, 5, 9]

/**
 * "Hoje, a obra vive espalhada": os pedaços que o PRISSMA junta. Cada um
 * lembra a ferramenta de onde veio — planilha, conversa, nota, caderno —, mas
 * em tokens do DS, sem cor de marca alheia.
 */
export const FRAGMENTS: Fragment[] = [
  {
    key: "xls",
    x: 12,
    y: 22,
    r: -6,
    mobile: true,
    node: (
      <div className="flex items-center gap-2.5 rounded-[10px] bg-success-soft px-3 py-2.5 text-success shadow-lift">
        <FileSpreadsheet size={18} />
        <span className="text-[13px] font-[600]">orcamento_obra_v7_FINAL.xlsx</span>
      </div>
    ),
  },
  {
    key: "chat",
    x: 84,
    y: 27,
    r: 4,
    mobile: true,
    node: (
      <div className="w-[230px] rounded-[14px] rounded-tl-[4px] bg-inverse p-3 text-on-inverse shadow-lift">
        <p className="flex items-center gap-1.5 text-[11.5px] font-[650] opacity-70">
          <MessageCircle size={12} />
          Joaquim — mestre
        </p>
        <p className="mt-1 text-[13.5px] leading-snug">Engenheira, o tubo de 100 não chegou. Paro o esgoto?</p>
        <p className="t-num mt-1 text-right text-[10.5px] opacity-60">07:42</p>
      </div>
    ),
  },
  {
    key: "nf",
    x: 20,
    y: 68,
    r: 5,
    node: (
      <div data-theme="light" className="w-[180px] rounded-[6px] bg-surface p-3 text-ink shadow-lift">
        <p className="flex items-center gap-1.5 text-[11px] text-meta">
          <Receipt size={12} />
          Nota fiscal 004471
        </p>
        <p className="mt-1 text-[12.5px]">Blocos cerâmicos 14x19</p>
        <p className="t-num mt-2 text-right text-[15px] font-[700]">R$ 3.120,00</p>
      </div>
    ),
  },
  {
    key: "note",
    x: 76,
    y: 70,
    r: -4,
    mobile: true,
    node: (
      <div data-theme="light" className="w-[190px] rotate-1 bg-warning-soft p-3 text-warning shadow-lift">
        <p className="flex items-center gap-1.5 text-[11px] font-[600] opacity-80">
          <NotebookPen size={12} />
          caderno da obra
        </p>
        <p className="mt-1.5 text-[15px] leading-snug italic [font-variation-settings:'wdth'_70]">sapata 3 → refazer armação antes de concretar!!</p>
      </div>
    ),
  },
  {
    key: "img",
    x: 46,
    y: 80,
    r: 3,
    node: (
      <div className="w-[150px] rounded-[10px] bg-raised p-1.5 shadow-lift">
        <div className="hazard h-[74px] rounded-[7px] bg-surface" />
        <p className="mt-1.5 flex items-center gap-1 px-1 text-[11px] text-ink-2">
          <ImageIcon size={11} />
          IMG_0932.jpg
        </p>
      </div>
    ),
  },
  {
    key: "cal",
    x: 86,
    y: 52,
    r: 7,
    node: (
      <div data-theme="light" className="flex items-center gap-2 rounded-[10px] bg-surface px-3 py-2.5 text-ink shadow-lift">
        <CalendarClock size={16} className="text-danger" />
        <span className="text-[13px] font-[600]">Vistoria sexta, 9h?</span>
      </div>
    ),
  },
  {
    key: "audio",
    x: 6,
    y: 46,
    r: -3,
    node: (
      <div className="flex items-center gap-2 rounded-pill bg-inverse py-2 pr-3.5 pl-2 text-on-inverse shadow-lift">
        <span className="flex size-7 items-center justify-center rounded-full bg-gold text-on-gold">
          <Mic size={14} />
        </span>
        <span className="flex h-4 items-end gap-[2px]">
          {WAVE.map((h, i) => (
            // A onda é decorativa e fixa: posição + altura identificam a barra.
            <i key={`${i}-${h}`} className="w-[2px] rounded-full bg-gold/70" style={{ height: h }} />
          ))}
        </span>
        <span className="t-num text-[11.5px] opacity-60">0:48</span>
      </div>
    ),
  },
]
