import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Send, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { GateResult } from '@/hooks/useStades'

interface GatePanelProps {
  gate: GateResult
  statut: string
  onSoumettre: () => void
  submitting: boolean
}

export function GatePanel({ gate, statut, onSoumettre, submitting }: GatePanelProps) {
  const [open, setOpen] = useState(false)
  const peutSoumettre = gate.peut_soumettre && (statut === 'BROUILLON' || statut === 'EN_REVISION')
  const dejaSOumis = statut === 'SOUMIS'
  const isValide = statut === 'VALIDE'

  if (isValide) {
    return (
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
        <p className="text-[12px] text-green-700">Stade validé par votre mentor.</p>
      </div>
    )
  }

  if (dejaSOumis) {
    return (
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <Send className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-[12px] text-amber-700">Soumis au mentor. En attente d'évaluation.</p>
      </div>
    )
  }

  const nb_valides = gate.conditions.filter((c) => c.valide).length
  const nb_total = gate.conditions.length

  return (
    <div className={cn(
      'border rounded-xl overflow-hidden',
      peutSoumettre ? 'border-green-200' : 'border-zinc-200',
    )}>
      {/* Header cliquable */}
      <div
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 text-left transition-colors cursor-pointer',
          peutSoumettre ? 'bg-green-50 hover:bg-green-100' : 'bg-zinc-50 hover:bg-zinc-100',
        )}
      >
        <div className="flex items-center gap-2">
          {peutSoumettre
            ? <CheckCircle2 className="w-4 h-4 text-green-600" />
            : <XCircle className="w-4 h-4 text-zinc-400" />
          }
          <span className="text-[12px] text-zinc-700">
            Conditions gate : <span className={cn('font-medium', peutSoumettre ? 'text-green-700' : 'text-zinc-600')}>
              {nb_valides}/{nb_total}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {open ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </div>
      </div>

      {/* Bouton soumettre séparé */}
      {peutSoumettre && (
        <div className="px-4 py-2 bg-green-50 border-t border-green-200">
          <button
            onClick={onSoumettre}
            disabled={submitting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[11px] font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            Soumettre au mentor
          </button>
        </div>
      )}

      {/* Conditions détail */}
      {open && (
        <div className="px-4 py-3 border-t border-zinc-100 bg-white space-y-1.5">
          {gate.conditions.map((c) => (
            <div key={c.code} className="flex items-start gap-2">
              {c.valide
                ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                : <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
              }
              <span className={cn('text-[11px]', c.valide ? 'text-zinc-500' : 'text-zinc-700')}>
                {c.libelle}
                {!c.valide && (
                  <span className="text-zinc-400"> — actuel: {String(c.valeur_actuelle)}, requis: {String(c.valeur_requise)}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
