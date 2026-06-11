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
      <div className="flex items-center gap-2.5 rounded-[18px] border border-[var(--color-success-border)] bg-[var(--color-success-bg)] px-4 py-3">
        <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0" />
        <p className="text-[12px] font-medium text-[var(--color-success-text)]">Stade validé par votre mentor.</p>
      </div>
    )
  }

  if (dejaSOumis) {
    return (
      <div className="flex items-center gap-2.5 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3">
        <Send className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
        <p className="text-[12px] font-medium text-[var(--color-text-secondary)]">Soumis au mentor · En attente d'évaluation.</p>
      </div>
    )
  }

  const nb_valides = gate.conditions.filter((c) => c.valide).length
  const nb_total = gate.conditions.length
  const progressPct = nb_total > 0 ? Math.round((nb_valides / nb_total) * 100) : 0

  return (
    <div className={cn(
      'rounded-[18px] border overflow-hidden',
      peutSoumettre
        ? 'border-[var(--color-success-border)]'
        : 'border-[var(--color-border)]',
    )}>
      {/* Header */}
      <div
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3.5 text-left cursor-pointer transition-colors',
          peutSoumettre
            ? 'bg-[var(--color-success-bg)] hover:brightness-[0.98]'
            : 'bg-[var(--color-surface-soft)] hover:bg-[var(--color-border)]',
        )}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {peutSoumettre
            ? <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0" />
            : <XCircle className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
          }
          <div className="flex-1 min-w-0">
            <span className="text-[12px] font-semibold text-[var(--color-text-secondary)]">
              Conditions gate :{' '}
              <span className={cn('font-bold', peutSoumettre ? 'text-[var(--color-success-text)]' : 'text-[var(--color-text-primary)]')}>
                {nb_valides}/{nb_total}
              </span>
            </span>
            {/* Mini progress bar */}
            <div className="mt-1.5 h-1 w-full max-w-[160px] bg-white/60 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', peutSoumettre ? 'bg-[var(--color-success)]' : 'bg-zinc-400')}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {open ? <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />}
        </div>
      </div>

      {/* Submit button */}
      {peutSoumettre && (
        <div className="px-4 py-3 border-t border-[var(--color-success-border)] bg-white">
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

      {/* Conditions detail */}
      {open && (
        <div className="px-4 py-4 border-t border-[var(--color-border)] bg-white space-y-2.5">
          {gate.conditions.map((c) => (
            <div key={c.code} className="flex items-start gap-2.5">
              {c.valide
                ? <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)] mt-0.5 shrink-0" />
                : <XCircle className="w-3.5 h-3.5 text-[var(--color-error)] mt-0.5 shrink-0" />
              }
              <span className={cn('text-[11px] leading-relaxed', c.valide ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-secondary)]')}>
                {c.libelle}
                {!c.valide && (
                  <span className="text-[var(--color-text-disabled)]">
                    {' '}— actuel : {String(c.valeur_actuelle)}, requis : {String(c.valeur_requise)}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
