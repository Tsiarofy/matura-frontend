import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Send, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { GateResult } from '@/hooks/useStades'
import { Button } from '@/components/ui/button'

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
      <div className="panel-soft flex items-center gap-2 rounded-[20px] px-4 py-3">
        <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0" />
        <p className="text-[12px] text-[var(--color-text-secondary)]">Stade validé par votre mentor.</p>
      </div>
    )
  }

  if (dejaSOumis) {
    return (
      <div className="panel-soft flex items-center gap-2 rounded-[20px] px-4 py-3">
        <Send className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
        <p className="text-[12px] text-[var(--color-text-secondary)]">Soumis au mentor. En attente d'évaluation.</p>
      </div>
    )
  }

  const nb_valides = gate.conditions.filter((c) => c.valide).length
  const nb_total = gate.conditions.length

  return (
    <div className={cn(
      'border border-gray-200 rounded-lg overflow-hidden',
      !peutSoumettre && 'opacity-95',
    )}>      {/* Header cliquable */}
      <div
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 text-left transition-colors cursor-pointer',
          'bg-gray-50 hover:bg-gray-100',
        )}
      >
        <div className="flex items-center gap-2">
          {peutSoumettre
            ? <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
            : <XCircle className="w-4 h-4 text-[var(--color-text-muted)]" />
          }
          <span className="text-[12px] text-[var(--color-text-secondary)]">
            Conditions gate : <span className={cn('font-semibold', peutSoumettre ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]')}>
              {nb_valides}/{nb_total}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {open ? <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />}
        </div>
      </div>

      {/* Bouton soumettre séparé */}
      {peutSoumettre && (
        <div className="px-4 py-3 border-t border-gray-200 bg-white">
          <Button
            onClick={onSoumettre}
            disabled={submitting}
            size="sm"
            variant="success"
          >
            {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            Soumettre au mentor
          </Button>
        </div>
      )}

      {/* Conditions détail */}
      {open && (
        <div className="px-4 py-3 border-t border-gray-200 bg-white space-y-1.5">
          {gate.conditions.map((c) => (
            <div key={c.code} className="flex items-start gap-2">
              {c.valide
                ? <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)] mt-0.5 shrink-0" />
                : <XCircle className="w-3.5 h-3.5 text-[var(--color-error)] mt-0.5 shrink-0" />
              }
              <span className={cn('text-[11px]', c.valide ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-secondary)]')}>
                {c.libelle}
                {!c.valide && (
                  <span className="text-[var(--color-text-muted)]"> — actuel: {String(c.valeur_actuelle)}, requis: {String(c.valeur_requise)}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
